import { Dialog, DialogContent } from "@mui/material";
import React, { useState } from "react";
import { reactIcons } from "utils/icons";

function ImagePreviewModal({ value, openModal, setOpenModal }) {
  console.log("value", value, openModal, value);
  const src = value?.url;
  const [scale, setScale] = useState(3);

  // const onDownload = (fileName, fileType) => {
  //   fetch(src)
  //     .then((response) => response.blob())
  //     .then((blob) => {
  //       const url = URL.createObjectURL(new Blob([blob], { type: fileType }));
  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.download = fileName;
  //       document.body.appendChild(link);
  //       link.click();
  //       URL.revokeObjectURL(url);
  //       link.remove();
  //     });
  // };

  const onFlipY = () => {
    // Implement flipping image vertically
    const imageElement = document.querySelector("#img"); // Replace with the appropriate selector for your image
    imageElement.style.transform = "scaleY(-1)";
  };

  const onFlipX = () => {
    // Implement flipping image horizontally
    const imageElement = document.querySelector("#img"); // Replace with the appropriate selector for your image
    imageElement.style.transform = "scaleX(-1)";
  };

  const onRotateLeft = () => {
    // Implement rotating image left
    const imageElement = document.querySelector("#img"); // Replace with the appropriate selector for your image
    imageElement.style.transform = "rotate(-90deg)";
    imageElement.style.marginTop = "70px";
  };

  const onRotateRight = () => {
    // Implement rotating image right
    const imageElement = document.querySelector("#img"); // Replace with the appropriate selector for your image
    imageElement.style.transform = "rotate(90deg)";
    imageElement.style.marginTop = "70px";
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
    <Dialog
      open={value == openModal?.url}
      aria-labelledby="responsive-dialog-title"
      sx={{ width: "100%", height: "80%" }}
    >
      <div className=" w-full rounded-md  ">
        <div className="flex justify-end rounded-full">
          <span
            className="text-black cursor-pointer text-[24px]"
            onClick={() => {
              setOpenModal(null);
            }}
          >
            {reactIcons.close}
          </span>
        </div>
      </div>
      <div className="toolbar-wrapper  px-2">
        <div className="flex gap-2">
          {/* <button
            className="rounded-md bg-navy-500 px-2 py-1 text-white"
            onClick={() => {
              if (value?.substring(value?.length - 3) === "pdf") {
                onDownload("document.pdf", "document.pdf", "application/pdf");
              } else {
                onDownload("image.jpg", "image.jpg", "image/jpeg");
              }
            }}
          >
            Download
          </button> */}
          <button
            className="text-14 rounded-md bg-navy-500 px-2 py-1 font-[500] text-white"
            onClick={onFlipY}
          >
            Flip Y
          </button>
          <button
            className="text-14 rounded-md bg-navy-500 px-2 py-1 font-[500] text-white"
            onClick={onFlipX}
          >
            Flip X
          </button>
          <button
            className="text-14 rounded-md bg-navy-500 px-2 py-1 font-[500] text-white"
            onClick={onRotateLeft}
          >
            Rotate Left
          </button>
          <button
            className="text-14 rounded-md bg-navy-500 px-2 py-1 font-[500] text-white"
            onClick={onRotateRight}
          >
            Rotate Right
          </button>
          <button
            className="w-8 rounded-md bg-navy-500 text-white"
            disabled={scale === 50}
            onClick={onZoomIn}
          >
            +
          </button>
          <button
            className="w-8 rounded-md bg-navy-500 text-white"
            disabled={scale === 1}
            onClick={onZoomOut}
          >
            -
          </button>
        </div>
      </div>
      <DialogContent>
        <div className="h-fit">
          {value?.substring(value?.length - 3) === "pdf" ? (
            <iframe
              src={value}
              id="img"
              width={200 * scale}
              className="h-[600px] min-w-[650px]"
            ></iframe>
          ) : (
            <img
              id="img"
              src={value}
              width={200 * scale}
              className="h-full"
              alt="Preview"
            />
          )}
        </div>

        {/* <img src={src} width={200 * scale} alt="Preview" /> */}
      </DialogContent>
    </Dialog>
  );
}

export default ImagePreviewModal;
