// WorkerComponent.jsx
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PDFViewerComponent = ({ pdfData, fileName, className = "pdf-viewer-container" }) => {

  // Tạo default layout plugin, thay thế tên file bằng tên fileName truyền vào:
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    toolbarPlugin: {
      getFilePlugin: {
        fileNameGenerator: (file) => fileName || "document.pdf",
      },
    },
  });

  return (
    <div className={className}>
      <Worker
        // workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
        workerUrl={"/pdfjs/pdf.worker.min.js"}
      >
        {pdfData && 
          <Viewer
            defaultScale={window.innerWidth < 768 ? 0.8 : 1.0}
            fileUrl={pdfData}
            plugins={[defaultLayoutPluginInstance]}
          />
        }
      </Worker>
    </div>
  );
};

export default PDFViewerComponent;
