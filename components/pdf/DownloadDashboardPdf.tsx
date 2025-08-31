/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Capacitor } from "@capacitor/core";

type Props = {
  dashboardRef: React.RefObject<HTMLDivElement | null>;
  buttonClassName?: string;
};

function copyStylesHtml() {
  const nodes = Array.from(
    document.querySelectorAll("link[rel=stylesheet], style, link[rel=preload]")
  );
  const allowed = nodes.filter((n) => {
    if (n.tagName.toLowerCase() === "link") {
      const rel = (n as HTMLLinkElement).rel;
      return rel === "stylesheet" || (rel === "preload" && (n as HTMLLinkElement).as === "style");
    }
    return true;
  });
  return allowed.map((n) => n.outerHTML).join("\n");
}

function sanitizeElementForPrint(el: Element) {
  const e = el as HTMLElement;
  const unsafe: Record<string, string> = {
    transform: "none",
    filter: "none",
    "backdrop-filter": "none",
    "clip-path": "none",
    "mask-image": "none",
    "mix-blend-mode": "normal",
    isolation: "auto",
    willChange: "auto",
    "-webkit-backface-visibility": "visible",
    "backface-visibility": "visible",
    "-webkit-transform": "none",
  };

  const existing = (e.getAttribute && e.getAttribute("style")) || "";
  let override = "";
  for (const [k, v] of Object.entries(unsafe)) {
    override += `${k}:${v} !important;`;
  }
  override += "background-clip: border-box !important;";

  if (e.setAttribute) e.setAttribute("style", existing + override);
}

function inlineSvgComputedStyles(svg: SVGSVGElement) {
  const all = Array.from(svg.querySelectorAll<SVGElement>("*"));
  all.forEach((el) => {
    const cs = window.getComputedStyle(el as Element);
    const fill = cs.getPropertyValue("fill");
    const stroke = cs.getPropertyValue("stroke");
    const strokeWidth = cs.getPropertyValue("stroke-width");
    const opacity = cs.getPropertyValue("opacity");
    const fontSize = cs.getPropertyValue("font-size");
    const fontFamily = cs.getPropertyValue("font-family");
    const fontWeight = cs.getPropertyValue("font-weight");
    const textAnchor = cs.getPropertyValue("text-anchor");
    const color = cs.getPropertyValue("color");

    try {
      if (fill && fill !== "none") (el as SVGElement).setAttribute("fill", fill);
      else if ((!fill || fill === "none") && color) (el as SVGElement).setAttribute("fill", color);

      if (stroke && stroke !== "none") (el as SVGElement).setAttribute("stroke", stroke);
      if (strokeWidth) (el as SVGElement).setAttribute("stroke-width", strokeWidth);
      if (opacity && opacity !== "1") (el as SVGElement).setAttribute("opacity", opacity);

      if (el.tagName.toLowerCase() === "text") {
        if (fontSize) (el as SVGElement).setAttribute("font-size", fontSize);
        if (fontFamily) (el as SVGElement).setAttribute("font-family", fontFamily.replace(/['"]/g, ""));
        if (fontWeight) (el as SVGElement).setAttribute("font-weight", fontWeight);
        if (textAnchor) (el as SVGElement).setAttribute("text-anchor", textAnchor);
      }
    } catch {
      // ignore inline set failures for some library-generated nodes
    }
  });

  try {
    if (!svg.getAttribute("viewBox")) {
      const vb = svg.viewBox.baseVal;
      if (vb && vb.width && vb.height) {
        svg.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.width} ${vb.height}`);
      } else {
        const bbox = svg.getBBox();
        svg.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
      }
    }
  } catch {
    const r = svg.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${r.width} ${r.height}`);
  }
  if (!svg.getAttribute("width")) {
    const r = svg.getBoundingClientRect();
    svg.setAttribute("width", String(r.width || 600));
    svg.setAttribute("height", String(r.height || 300));
  }
}

/** Wait for images/fonts inside a document (or fragment) to load */
async function waitForResources(doc: Document | ShadowRoot | HTMLElement) {
  try {
    const imgs = Array.from((doc as any).images || []);
    await Promise.all(
      imgs.map(
        (img: HTMLImageElement) =>
          new Promise<void>((res) => {
            if (img.complete) return res();
            img.onload = () => res();
            img.onerror = () => res();
          })
      )
    );

    if ((doc as any).fonts && (doc as any).fonts.ready) {
      await (doc as any).fonts.ready;
    } else if ((document as any).fonts && (document as any).fonts.ready) {
      await (document as any).fonts.ready;
    }
  } catch (err) {
    console.warn("Resource loading issues before print:", err);
  }
}

export default function DownloadDashboardPdf({
  dashboardRef,
}: Props) {
  const handlePrint = async () => {
    const target = dashboardRef?.current;
    if (!target) {
      console.warn("DownloadDashboardPdf: dashboardRef missing or null");
      return;
    }

    // 1) Clone and sanitize the node (same behavior as your original)
    const cloned = target.cloneNode(true) as HTMLElement;
    Array.from(cloned.querySelectorAll("*")).forEach((el) => sanitizeElementForPrint(el));
    const svgs = Array.from(cloned.querySelectorAll<SVGSVGElement>("svg"));
    svgs.forEach((svg) => inlineSvgComputedStyles(svg));

    // 2) Build styles and wrapper
    const stylesHtml = copyStylesHtml();
    const additional = `
      <style>
        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        svg { shape-rendering: geometricPrecision; }
        * { filter: none !important; -webkit-filter: none !important; box-shadow: none !important; }
        body { background: #fff; margin: 0; }
      </style>
    `;

    const printableHtml = `
      <!doctype html>
      <html>
        <head>
          <base href="${location.origin}">
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          ${stylesHtml}
          ${additional}
        </head>
        <body>
          ${cloned.innerHTML}
        </body>
      </html>
    `;

    // wait for images/fonts inside the cloned fragment (so native print captures them)
    // create a temporary container in DOM (hidden) to allow resources to load
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.style.top = "-9999px";
    container.style.opacity = "0";
    container.style.pointerEvents = "none";
    container.innerHTML = printableHtml;
    document.body.appendChild(container);
    await waitForResources(container);
    // remove the helper container after resources loaded
    document.body.removeChild(container);

    // 3) If running in Capacitor native -> use native plugin
    const isNative = Capacitor.isNativePlatform();
    if (isNative) {
      try {
        // dynamic import - will fail harmlessly on web where plugin isn't installed
        const printerModule: any = await import("@bcyesil/capacitor-plugin-printer").catch((e) => {
          // plugin not found; try capawesome style package name fallback
          return (globalThis as any).Printer ? { Printer: (globalThis as any).Printer } : null;
        });

        const Printer = printerModule?.Printer ?? (printerModule?.default ?? null);
        if (!Printer || !Printer.print) {
          console.warn(
            "Printer plugin not available. Make sure you installed a capacitor printer plugin and ran `npx cap sync`."
          );
          // fallback to opening system browser to print (less ideal)
          const w = window.open();
          if (w) {
            w.document.write(printableHtml);
            w.document.close();
            w.focus();
            setTimeout(() => w.print(), 300);
          }
          return;
        }

        // call native print - plugin will show native print dialog where user can Save as PDF
        await Printer.print({
          content: printableHtml,
          name: "Dashboard",
          // plugin-specific options may be accepted; these are example fields
          orientation: "portrait",
          duplex: false,
        });
        return;
      } catch (err) {
        console.error("Native printer plugin error:", err);
        // fallback to web print below
      }
    }

    // 4) Web/Desktop fallback: use the old window.open -> print approach
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Unable to open print window (popup blocked).");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(printableHtml);
    printWindow.document.close();

    // Wait for resources in that new window
    try {
      await waitForResources(printWindow.document);
    } catch {
      /* ignored */
    }

    printWindow.focus();
    printWindow.onafterprint = () => {
      printWindow.close();
    };
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  return (
    <Button onClick={handlePrint} className="mt-0 mb-1 rounded-full">
      Print / Save as PDF2
    </Button>
  );
}
