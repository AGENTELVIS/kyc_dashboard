/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Capacitor } from "@capacitor/core";

type Props = {
  dashboardRef: React.RefObject<HTMLDivElement | null>;
  buttonClassName?: string;
};

function copyProgressWidths(original: HTMLElement, cloned: HTMLElement) {
  // Find all progress bars in original
  const originalProgressBars = original.querySelectorAll('[role="progressbar"], .progress, [data-radix-collection-item]');
  const clonedProgressBars = cloned.querySelectorAll('[role="progressbar"], .progress, [data-radix-collection-item]');
  
  originalProgressBars.forEach((origBar, index) => {
    if (clonedProgressBars[index]) {
      // Find the inner div that represents the fill (usually the first child div)
      const origFill = origBar.querySelector('div');
      const clonedFill = clonedProgressBars[index].querySelector('div');
      
      if (origFill && clonedFill) {
        // Get computed width from original
        const computedStyle = window.getComputedStyle(origFill);
        const width = computedStyle.width;
        const transform = computedStyle.transform;
        
        // Apply to cloned element
        (clonedFill as HTMLElement).style.width = width;
        if (transform && transform !== 'none') {
          (clonedFill as HTMLElement).style.transform = transform;
        }
        
        // Also copy any data attributes that might control width
        if (origFill.hasAttribute('data-value')) {
          clonedFill.setAttribute('data-value', origFill.getAttribute('data-value') || '');
        }
        
        // For Radix UI Progress component specifically
        if (origFill.hasAttribute('data-state')) {
          clonedFill.setAttribute('data-state', origFill.getAttribute('data-state') || '');
        }
        if (origFill.hasAttribute('data-max')) {
          clonedFill.setAttribute('data-max', origFill.getAttribute('data-max') || '');
        }
      }
    }
  });
  
  // Also handle inline styles for transform-based progress bars
  const origTransformElements = original.querySelectorAll('[style*="transform"], [style*="width"]');
  const clonedTransformElements = cloned.querySelectorAll('[style*="transform"], [style*="width"]');
  
  origTransformElements.forEach((origEl, index) => {
    if (clonedTransformElements[index]) {
      const origStyle = (origEl as HTMLElement).style;
      const clonedStyle = (clonedTransformElements[index] as HTMLElement).style;
      
      if (origStyle.width) clonedStyle.width = origStyle.width;
      if (origStyle.transform) clonedStyle.transform = origStyle.transform;
    }
  });
}

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
    const imgs: HTMLImageElement[] = (doc instanceof Document
      ? Array.from(doc.images || [])
      : Array.from((doc as HTMLElement).querySelectorAll?.("img") || [])) as HTMLImageElement[];

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

    if ((doc as any).fonts && (doc as any).fonts.ready) {
      await (doc as any).fonts.ready;
    } else if ((document as any).fonts && (document as any).fonts.ready) {
      await (document as any).fonts.ready;
    }
  } catch (err) {
    console.warn("Resource loading issues before print:", err);
  }
}

/**
 * Copy computed progress widths from original DOM into cloned DOM.
 * - Looks for elements with role=progressbar, elements with class names containing 'progress',
 *   and common fill selectors; pairs them by order.
 */

export default function DownloadDashboardPdf({
  dashboardRef,
}: Props) {
  const handlePrint = async () => {
    const target = dashboardRef?.current;
    if (!target) {
      console.warn("DownloadDashboardPdf: dashboardRef missing or null");
      return;
    }

    // Clone and sanitize
    const cloned = target.cloneNode(true) as HTMLElement;
    
    // IMPORTANT: Copy progress widths BEFORE sanitizing
    copyProgressWidths(target, cloned);
    
    // Now sanitize (but preserve the widths we just set)
    Array.from(cloned.querySelectorAll("*")).forEach((el) => {
      const elem = el as HTMLElement;
      // Skip sanitizing width and transform for progress elements
      if (elem.closest('[role="progressbar"]') || elem.closest('.progress')) {
        // Apply minimal sanitization without affecting size/position
        const unsafe: Record<string, string> = {
          filter: "none",
          "backdrop-filter": "none",
          "clip-path": "none",
          "mask-image": "none",
        };
        const existing = elem.getAttribute("style") || "";
        let override = "";
        for (const [k, v] of Object.entries(unsafe)) {
          override += `${k}:${v} !important;`;
        }
        elem.setAttribute("style", existing + override);
      } else {
        sanitizeElementForPrint(el);
      }
    });
    
    const svgs = Array.from(cloned.querySelectorAll<SVGSVGElement>("svg"));
    svgs.forEach((svg) => inlineSvgComputedStyles(svg));

    // Build styles with explicit progress bar preservation
    const stylesHtml = copyStylesHtml();
    const additional = `
      <style>
        @page { margin: 12mm; }
        html, body { height: 100%; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        body { background: #fff; margin: 0; padding: 12mm; box-sizing: border-box; }
        svg { shape-rendering: geometricPrecision; }
        * { filter: none !important; -webkit-filter: none !important; box-shadow: none !important; }
        
        /* Preserve progress bar styles */
        [role="progressbar"] > div,
        .progress > div {
          transition: none !important;
          animation: none !important;
        }
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

    // 3) attach to hidden container so resources load and computed sizes are available
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.style.top = "-9999px";
    container.style.opacity = "0";
    container.style.pointerEvents = "none";
    container.innerHTML = printableHtml;
    document.body.appendChild(container);

    // wait for images/fonts so widths are accurate
    await waitForResources(container);

    // give the browser a tick to layout
    await new Promise((r) => requestAnimationFrame(() => r(undefined)));

    // COPY the progress widths from the live (original) DOM into the cloned container

    // remove helper container (we already copied inline widths into container's elements)
    // But we need clone's innerHTML updated to reflect those inline styles:
    const finalHtml = `
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
          ${container.innerHTML}
        </body>
      </html>
    `;

    document.body.removeChild(container);

    // 4) If running in Capacitor native -> use native plugin
    const isNative = Capacitor.isNativePlatform();
    if (isNative) {
      try {
        const printerModule: any = await import("@bcyesil/capacitor-plugin-printer").catch(() => {
          return (globalThis as any).Printer ? { Printer: (globalThis as any).Printer } : null;
        });

        const Printer = printerModule?.Printer ?? (printerModule?.default ?? null);
        if (!Printer || !Printer.print) {
          console.warn(
            "Printer plugin not available. Make sure you installed a capacitor printer plugin and ran `npx cap sync`."
          );
          // fallback to web print
          const w = window.open();
          if (w) {
            w.document.write(finalHtml);
            w.document.close();
            w.focus();
            setTimeout(() => w.print(), 300);
          }
          return;
        }

        await Printer.print({
          content: finalHtml,
          name: "Dashboard",
          orientation: "portrait",
          duplex: false,
        });
        return;
      } catch (err) {
        console.error("Native printer plugin error:", err);
        // fallback to web print below
      }
    }

    // 5) Web/Desktop fallback: open print window
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Unable to open print window (popup blocked).");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(finalHtml);
    printWindow.document.close();

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
      Print / Save as PDF
    </Button>
  );
}
