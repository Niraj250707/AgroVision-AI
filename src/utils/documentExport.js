/**
 * Production-ready utility for printing and saving agricultural reports,
 * APMC electronic gate passes, and AGMARK quality certificates.
 * Designed to work reliably inside sandboxed iframes, mobile browsers, and desktop.
 */

/**
 * Robust print helper that handles iframe sandboxes, popups, and fallbacks
 */
export const triggerPrintDocument = (printableElementOrHtml, docTitle = "AgroVision_Document") => {
  try {
    let contentHtml = "";
    if (typeof printableElementOrHtml === "string") {
      contentHtml = printableElementOrHtml;
    } else if (printableElementOrHtml && printableElementOrHtml.innerHTML) {
      contentHtml = printableElementOrHtml.innerHTML;
    } else {
      contentHtml = document.body.innerHTML;
    }

    const styledHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${docTitle}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              padding: 24px;
              color: #1a1a1a;
              background: #ffffff;
              line-height: 1.5;
              font-size: 13px;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .no-print { display: none !important; }
            table { width: 100%; border-collapse: collapse; margin: 16px 0; }
            th, td { border: 1px solid #dcdcdc; padding: 8px 10px; text-align: left; }
            th { background-color: #f4f4f4; font-weight: bold; }
            .header { text-align: center; border-bottom: 2px solid #2d6a4f; padding-bottom: 12px; margin-bottom: 20px; }
            .header h1 { font-size: 20px; color: #1b4332; margin-bottom: 4px; }
            .header p { font-size: 11px; color: #555; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px; }
            .card { border: 1px solid #e0e0e0; padding: 12px; border-radius: 8px; background: #fafafa; }
            .badge { display: inline-block; padding: 3px 8px; border-radius: 9999px; font-weight: bold; font-size: 11px; }
            .badge-success { background: #d8f3dc; color: #1b4332; }
            .badge-gold { background: #fef08a; color: #854d0e; }
            @media print {
              @page { margin: 10mm; size: auto; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${contentHtml}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.focus();
                window.print();
              }, 250);
            };
          </script>
        </body>
      </html>
    `;

    // Strategy 1: Try printing via a dedicated hidden iframe
    const iframeId = "agrovision-print-sandbox-frame";
    let printFrame = document.getElementById(iframeId);
    if (printFrame) {
      try {
        document.body.removeChild(printFrame);
      } catch {
        // ignore removal error
      }
    }

    printFrame = document.createElement("iframe");
    printFrame.id = iframeId;
    printFrame.setAttribute("style", "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;visibility:hidden;");
    document.body.appendChild(printFrame);

    try {
      const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument;
      if (frameDoc) {
        frameDoc.open();
        frameDoc.write(styledHtml);
        frameDoc.close();

        setTimeout(() => {
          try {
            printFrame.contentWindow?.focus();
            printFrame.contentWindow?.print();
          } catch (iframeErr) {
            console.warn("Iframe print blocked by browser sandbox policy, executing direct print:", iframeErr);
            fallbackDirectPrint();
          }
        }, 300);
      }
    } catch (writeErr) {
      console.warn("Cannot write to print iframe:", writeErr);
      fallbackDirectPrint();
    }

    function fallbackDirectPrint() {
      // Strategy 2: Direct window.print()
      // Tag element so print stylesheet can isolate it
      if (printableElementOrHtml && typeof printableElementOrHtml !== "string") {
        printableElementOrHtml.classList.add("agrovision-print-target");
      }
      setTimeout(() => {
        window.print();
        if (printableElementOrHtml && typeof printableElementOrHtml !== "string") {
          setTimeout(() => printableElementOrHtml.classList.remove("agrovision-print-target"), 1000);
        }
      }, 100);
    }
  } catch (err) {
    console.error("Print execution failed, using window.print fallback:", err);
    window.print();
  }
};

/**
 * Downloads formatted document as a standalone offline HTML/PDF-ready file
 */
export const downloadDocumentFile = ({ filename, title, contentHtml }) => {
  try {
    const safeTitle = title || "AgroVision Certified Document";
    const cleanFilename = (filename || "AgroVision_Document.html")
      .replace(/[^\w.-]/g, "_");

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      margin: 0;
      padding: 24px;
      background: #f1f5f9;
      color: #0f172a;
      line-height: 1.5;
    }
    .container {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.08);
    }
    .print-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e2e8f0;
    }
    .btn {
      background: #1b4332;
      color: #ffffff;
      padding: 9px 18px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      border: none;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    }
    .btn:hover {
      background: #2d6a4f;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
      margin-bottom: 16px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 10px 12px;
      text-align: left;
      font-size: 13px;
    }
    th {
      background-color: #f8fafc;
      font-weight: 600;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .container { border: none; box-shadow: none; padding: 0; max-width: 100%; }
      .print-bar { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="print-bar">
      <div>
        <strong style="color: #1b4332; font-size: 16px; display: block;">AgroVision AI Certified Document</strong>
        <span style="font-size: 12px; color: #64748b;">Official Agri-Transit & Realization Ledger • Valid for APMC & e-NAM Clearance</span>
      </div>
      <button class="btn" onclick="window.print()">Print / Save as PDF</button>
    </div>
    ${contentHtml}
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = cleanFilename.endsWith(".html") ? cleanFilename : `${cleanFilename}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    return true;
  } catch (err) {
    console.error("Document download error:", err);
    return false;
  }
};
