"use client";

import React from "react";
import { Button } from "@/components/ui/button";

type Props = {
  dashboardRef: React.RefObject<HTMLDivElement>;
};

function copyStylesHtml() {
  const nodes = Array.from(document.querySelectorAll("link[rel=stylesheet], style, link[rel=preload]"));
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
      if (fill && fill !== "none") el.setAttribute("fill", fill);
      else if ((!fill || fill === "none") && color) el.setAttribute("fill", color);

      if (stroke && stroke !== "none") el.setAttribute("stroke", stroke);
      if (strokeWidth) el.setAttribute("stroke-width", strokeWidth);
      if (opacity && opacity !== "1") el.setAttribute("opacity", opacity);

      if (el.tagName.toLowerCase() === "text") {
        if (fontSize) el.setAttribute("font-size", fontSize);
        if (fontFamily) el.setAttribute("font-family", fontFamily.replace(/['"]/g, ""));
        if (fontWeight) el.setAttribute("font-weight", fontWeight);
        if (textAnchor) el.setAttribute("text-anchor", textAnchor);
      }
    } catch {
    
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

export default function DownloadDashboardPdf({
  dashboardRef,
}: Props) {
  const handlePrint = async () => {
    const target = dashboardRef?.current;
    if (!target) {
      console.warn("DownloadDashboardPdf: dashboardRef missing or null");
      return;
    }

    const cloned = target.cloneNode(true) as HTMLElement;
    Array.from(cloned.querySelectorAll("*")).forEach((el) => sanitizeElementForPrint(el));
    const svgs = Array.from(cloned.querySelectorAll<SVGSVGElement>("svg"));
    svgs.forEach((svg) => inlineSvgComputedStyles(svg));

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Unable to open print window (popup blocked).");
      return;
    }
    const stylesHtml = copyStylesHtml();
    const additional = `
      <style>
        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        svg { shape-rendering: geometricPrecision; }
        * { filter: none !important; -webkit-filter: none !important; box-shadow: none !important; }
      </style>
    `;

    printWindow.document.open();
    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <base href="${location.origin}">
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          ${stylesHtml}
          ${additional}
        </head>
        <body style="background:#fff; margin:0;">
        </body>
      </html>
    `);
    printWindow.document.close();

    const imported = printWindow.document.importNode(cloned, true);
    printWindow.document.body.appendChild(imported);

    try {
      const imgs = Array.from(printWindow.document.images || []);
      await Promise.all(
        imgs.map(
          (img) =>
            new Promise<void>((res) => {
              if (img.complete) return res();
              img.onload = () => res();
              img.onerror = () => res();
            })
        )
      );

      if ((printWindow.document as any).fonts && (printWindow.document as any).fonts.ready) {
        await (printWindow.document as any).fonts.ready;
      } else if ((document as any).fonts && (document as any).fonts.ready) {
        await (document as any).fonts.ready;
      }
    } catch (err) {
      console.warn("Resource loading issues before print:", err);
    }

    printWindow.focus();

    // Use onafterprint to close the window as soon as the user is done
    printWindow.onafterprint = () => {
      printWindow.close();
    };

    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  return (
    <Button onClick={handlePrint} className="mt-0 mb-1 rounded-full">
      Print / Save as PDF
    </Button>
  );
}