import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
import { reactIcons } from "utils/icons";
import { deleteApiReq } from "utils/ApiHandlers";
import { toast } from "react-toastify";
import ToastMsg from "components/toast/ToastMsg";

function DeleteCoinPairModal({
  openTokenDeleteModal,
  setOpenTokenDeleteModal,
  tokenData,
  getTokenList,
}) {
  console.log("tokenData", tokenData);

  const handleDeleteToken = () => {
    if (tokenData) {
      deleteApiReq(`/swap-pairs/${tokenData?.id}`).then((res) => {
        console.log("-----token del res ", res);
        if (res.status) {
          setOpenTokenDeleteModal(false);
          getTokenList();
          toast.success(<ToastMsg title={"Token deleted successfully"} />);
        } else if (res.error.statusCode === 500) {
          toast.error(<ToastMsg title={res.error.message} />);
        } else {
          toast.error(<ToastMsg title={res.error} />);
        }
      });
    }
  };

  return (
    <Dialog
      open={openTokenDeleteModal}
      // onClose={{}}
      aria-labelledby="responsive-dialog-title"
    >
      <div className="w-[400px] rounded-md bg-white">
        <DialogTitle id="responsive-dialog-title">
          <div className="flex justify-end">
            <span
              className="text-black cursor-pointer"
              onClick={() => setOpenTokenDeleteModal(false)}
            >
              {reactIcons.close}
            </span>
          </div>
        </DialogTitle>
        <DialogContent>
          <div>
            <div className="mb-3 flex justify-center">
              <p className="text-gray-900">
                Are you sure you want to delete this token?
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleDeleteToken}
                className="text-14 mx-3 ml-1 rounded-md bg-green-500 py-1 px-3 font-[600] text-white"
              >
                Yes
              </button>
              <button
                onClick={() => setOpenTokenDeleteModal(false)}
                className="text-14 ml-1 rounded-md bg-red-500 py-1 px-3 font-[600] text-white"
              >
                No
              </button>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default DeleteCoinPairModal;
