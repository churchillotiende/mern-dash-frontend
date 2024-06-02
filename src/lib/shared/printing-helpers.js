import { PDFDocument } from "pdf-lib";
import getLogger from "./logger";

const logger = getLogger("Printing Helper");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (typeof window !== "undefined") {
  import("print-js").then(() => {
    //
  });
}

export const isViewMobile = () => {
  if (typeof window !== undefined) {
    if (window.innerWidth > 1024) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
};

export const isViewTab = () => {
  try {
    if (typeof window !== undefined) {
      if (window.innerWidth > 768) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  } catch (e) {
    return false;
  }
};

export const printRemotePdf = (address) => {
  if (isViewMobile()) {
    legacyRemotePdf(address);
    return;
  }

  printJS({
    printable: address,
    type: "pdf",
    showModal: true,
    modalMessage: "Please wait...",
  });
};

export const legacyRemotePdf = (url) => {
  if (!url) {
    return;
  }

  const startTime = new Date();
  logger.log("legacyRemotePdf::BEGIN");

  fetch(url, {
    headers: {
      Accept: "application/json",
    },
  }).then(async (response) => {
    const data = await response.blob();
    const endTime = new Date();
    const seconds = endTime.getTime() - startTime.getTime();
    logger.log("legacyRemotePdf::END", { took: seconds });

    if (!response.ok) {
      logger.warn("legacyRemotePdf::ERROR", { took: seconds });
    }

    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(data);
    a.innerHTML = "report.pdf";
    a.target = "_blank";
    a.click();
  });
};

export const printRemotePdfSilent = (address) => {
  printJS({
    printable: address,
    type: "pdf",
    showModal: true,
  });
};

export const printPdfBlob = ({ data = null, silent = false } = {}) => {
  const blob = new Blob([data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  // window.open(url);
  printJS({
    printable: url,
    type: "pdf",
    showModal: !silent,
    modalMessage: "Please wait...",
  });
};

export const mergeRemotePdfFiles = async (addresses) => {
  const mergedPdf = await PDFDocument.create();

  for (const pdfCopyDoc of addresses) {
    const pdfBytes = await fetch(pdfCopyDoc).then((res) => res.arrayBuffer());
    //const pdfBytes = fs.readFileSync(pdfCopyDoc);
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }
  const mergedPdfFile = await mergedPdf.save();

  return mergedPdfFile;
};
