import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import ToastMsg from "components/toast/ToastMsg";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { postApiReq } from "utils/ApiHandlers";
import { putApiReq } from "utils/ApiHandlers";
import { getApiReq } from "utils/ApiHandlers";
import { reactIcons } from "utils/icons";

const initialState = {
  name: "",
  icon: "",
  iconShow: "",
  isEVM: 0,
};

function EditChainModal({
  openEditChainModal,
  setOpenEditChainModal,
  chainData,
  getChain,
}) {
  const [getCurrencyData, setCurrencyData] = useState();
  const [form, setForm] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getFireBlocks();
  }, [chainData]);
  const getFireBlocks = () => {
    getApiReq(`/fire-blocks`).then((res) => {
      if (res.status) {
        setCurrencyData(res.data);
      } else {
        toast.error(<ToastMsg title={res.error} />);
      }
    });
  };

  useEffect(() => {
    if (chainData) {
      setForm({
        ...form,
        name: chainData?.name,
        icon: chainData?.icon,
        iconShow: chainData.iconPath,
        isEVM: chainData?.isEVM,
      });
    }
  }, [chainData]);

  const getFileUrl = async (data) => {
    return await postApiReq("/upload", data);
  };

  const handleFileChange = async (e) => {
    if (e.target.files[0]?.size > 15728640.01) {
      toast.error("File size should not exceed 15MB");
      return;
    }
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    try {
      const response = await getFileUrl(formData);
      if (response.status) {
        setForm({
          ...form,
          [e.target.name]: response.data,
          iconShow: response.data.url,
        });
      } else {
        toast.error(response.error.message, "register error");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChain = () => {
    setIsLoading(true);
    const data = {
      name: form.name,
      icon: form?.icon?.meta?.filename || form?.icon,
      isEVM: form.isEVM,
    };
    putApiReq(`/chains/${chainData.id}/`, data).then((res) => {
      setIsLoading(false);
      if (res.status) {
        toast.success(<ToastMsg title={"Chain updated successfully"} />);
        getChain();
        setOpenEditChainModal(false);
        setForm({});
      } else {
        toast.error(<ToastMsg title={res.error.message[0]} />);
      }
    });
  };

  return (
    <Dialog open={openEditChainModal} aria-labelledby="responsive-dialog-title">
      <div className="w-[400px] rounded-md bg-white ">
        <div className="flex justify-between rounded-full">
          <div className="my-2 flex flex-1 justify-center">
            <h1 className="text-[20px] font-[700]">Edit Chain </h1>
          </div>
          <span
            className="text-black cursor-pointer text-[24px]"
            onClick={() => setOpenEditChainModal(false)}
          >
            {reactIcons.close}
          </span>
        </div>
        <DialogContent>
          <div>
            <label>Select chain</label>
            <div>
              <select
                name="name"
                value={form.name}
                onChange={handleChange}
                className="bg-whtie  border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
              >
                <option value="">Select chain</option>
                {getCurrencyData?.map((item, index) => {
                  return (
                    <option value={item} key={index}>
                      {item.replaceAll("_", " ")}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="mt-5 flex items-center">
            <label htmlFor="coin_icon">
              <span className="border-black cursor-pointer border-[1px] bg-lightPrimary py-1 px-3">
                Upload Icon
              </span>
              {/* <p className="text-green-500">
                {form?.icon?.meta?.filename || form.icon}
              </p> */}
            </label>
            <input
              name="icon"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              id="coin_icon"
            />
            <img src={form.iconShow} alt="icon" className="ml-5 h-7 w-7" />
          </div>
          <div className="mt-5 flex items-center">
            <label htmlFor="coin_icon">
              Is EVM Chain
              {/* <p className="text-green-500">
                {form?.icon?.meta?.filename || form.icon}
              </p> */}
            </label>
            <br />
            <select
              className="bg-whtie  border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
              name="isEVM"
              value={form.isEVM}
              onChange={(e) => {
                setForm({ ...form, isEVM: parseInt(e.target.value) });
              }}
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>
          <div className="my-2 flex justify-end">
            <button
              onClick={handleEditChain}
              className={`w-28 rounded-md border-[1px] ${
                isLoading ? "bg-gray-400" : " bg-blueSecondary text-white"
              } py-1 px-3 text-white`}
              disabled={isLoading}
            >
              Update
            </button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default EditChainModal;
