import ImagePreviewModal from 'components/ImagePreviewModal';
import React, { useState } from 'react'

function PreviewDocuments({ value, heading }) {
    const [openModal, setOpenModal] = useState(null);
  return (
    <div>  {value?.length > 0 && (
      <div>
        <div>
          <p className='text-black font-[600]'>{heading}</p>
        </div>
          <div className="grid grid-cols-12">
            {value &&
              value?.map((item, index) => {
                  return (
                      <div
                      key={index}
                      className="col-span-2 mx-2 text-center rounded-sm h-32 w-24 mt-2  relative "
                      >
                          <ImagePreviewModal value={item?.url} openModal={openModal} setOpenModal={setOpenModal} />
                    {item?.url?.substring(item?.url?.length - 3) === 'pdf' ? (
                      <iframe src={item?.url} className="w-24 h-24"></iframe>
                    ) : (
                      <img src={`${item?.url}`} alt="img" className="w-24 h-24" />
                    )}
                    {/* <span
                      onClick={() => handleRemoveDoc(index, name)}
                      className="text-[30px] cursor-pointer text-navy-500 absolute -top-2 -right-3"
                    >
                      {reactIcons.circleclose}
                    </span> */}
                        <button onClick={() => setOpenModal(item)} className='px-2 py-1 my-2 text-white rounded-md text-12 bg-navy-200'>Preview</button>
                  </div>
                );
              })}
          </div>
          
        </div>
      )}</div>
  )
}

export default PreviewDocuments