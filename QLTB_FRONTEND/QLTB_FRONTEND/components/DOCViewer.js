import React, { useEffect, useRef } from 'react';
import { renderAsync } from 'docx-preview';

const DocxViewerComponent = ({ file, className = 'docx-viewer-container' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const renderDocx = async () => {
      if (!file || !containerRef.current) return;

      let blob;

      try {
        if (typeof file === 'string') {
          const res = await fetch(file);
          blob = await res.blob();
        } else {
          blob = file;
        }

        // Clear old content
        containerRef.current.innerHTML = '';

        // Render DOCX
        await renderAsync(blob, containerRef.current, undefined, {
          inWrapper: true,
          className: 'docx', // for optional styling
        });
      } catch (err) {
        console.error('Không thể hiển thị file DOCX:', err);
        containerRef.current.innerHTML =
          '<p style="color:red">Không thể hiển thị file DOCX</p>';
      }
    };

    renderDocx();
  }, [file]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ border: '1px solid #ccc', padding: '1rem', overflowX: 'auto' }}
    />
  );
};

export default DocxViewerComponent;
