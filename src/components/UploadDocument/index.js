import React, { useState } from "react";
import PropTypes from "prop-types";
import { reactIcons } from "utils/icons";
import ImagePreviewModal from "components/ImagePreviewModal";

function UploadDocument({
  upload,
  instrunctionList,
  heading,
  handleFileChange,
  name,
  id,
  value,
  handleRemoveDoc,
  preview,
}) {
  const [viewImage, setViewImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const userDetailsHandelar = (url) => {
    setViewImage(true);
    setImageUrl(url);
  };
  console.log("imageUrl", viewImage, imageUrl);

  return (
    <div className="">
      <p className="text-16 text-black mb-3 font-[500] dark:text-white  md:text-[16px]">
        {heading}
      </p>
      <ul className="text-12 dark:text-lightgray list-disc pl-8 text-navy-400">
        {instrunctionList?.map((item) => {
          return (
            <li key={item.id} className="text-14 md:text-16">
              {item.text}
            </li>
          );
        })}
      </ul>
      {upload && (
        <div>
          <div className="grid grid-cols-12">
            {value &&
              value?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="relative col-span-2 mx-2 mt-2 h-24 w-24 rounded-sm border border-gray-500"
                  >
                    {item?.substring(item?.length - 3) === "pdf" ? (
                      <div onClick={() => userDetailsHandelar(item)}>
                        <iframe src={item} className="h-24 w-24"></iframe>
                      </div>
                    ) : (
                      <div onClick={() => userDetailsHandelar(item)}>
                        <img src={`${item}`} alt="img" className="h-24 w-24" />
                      </div>
                    )}
                    {!preview && (
                      <span
                        onClick={() => handleRemoveDoc(index, name)}
                        className="absolute -top-2 -left-2 cursor-pointer text-[30px] text-navy-500"
                      >
                        {reactIcons.circleclose}
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
          {!preview && (
            <label htmlFor={id}>
              <div className="my-5 flex h-20 w-full cursor-pointer items-center justify-center rounded-sm border-[1px] border-dotted border-navy-500">
                <span className="text-24 text-navy-500">
                  {reactIcons.camera}
                </span>
                <input
                  name={name}
                  type="file"
                  id={id}
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files[0]) handleFileChange(e);
                  }}
                />
              </div>
            </label>
          )}
        </div>
      )}
      {/* <ImagePreviewModal
        viewImage={viewImage}
        ClosedImageView={() => {
          setViewImage(false);
        }}
        imageUrl={imageUrl}
        setViewImage={setViewImage}
      /> */}
    </div>
  );
}

UploadDocument.propTypes = {
  instrunctionList: PropTypes.array,
  upload: PropTypes.bool,
  heading: PropTypes.string,
  handleFileChange: PropTypes.func,
  name: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.string,
  handleRemoveDoc: PropTypes.any,
  preview: PropTypes.any,
};
export default UploadDocument;
