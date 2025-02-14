import React, { useState } from "react";

const PreviewImage = () => {
  const src = "/images/icons/";
  const [scale, setScale] = useState(1);

  const onDownload = () => {
    fetch(src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.download = "image.png";
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        link.remove();
      });
  };

  const onFlipY = () => {
    // Implement flipping image vertically
  };

  const onFlipX = () => {
    // Implement flipping image horizontally
  };

  const onRotateLeft = () => {
    // Implement rotating image left
  };

  const onRotateRight = () => {
    // Implement rotating image right
  };

  const onZoomOut = () => {
    if (scale > 1) {
      setScale(scale - 1);
    }
  };

  const onZoomIn = () => {
    if (scale < 50) {
      setScale(scale + 1);
    }
  };

  return (
    <div>
      <img src={src} width={200 * scale} alt="Preview" />
      <div className="toolbar-wrapper">
        <button onClick={onDownload}>Download</button>
        <button onClick={onFlipY}>Flip Y</button>
        <button onClick={onFlipX}>Flip X</button>
        <button onClick={onRotateLeft}>Rotate Left</button>
        <button onClick={onRotateRight}>Rotate Right</button>
        <button disabled={scale === 1} onClick={onZoomOut}>
          Zoom Out
        </button>
        <button disabled={scale === 50} onClick={onZoomIn}>
          Zoom In
        </button>
      </div>
    </div>
  );
};

export default PreviewImage;
