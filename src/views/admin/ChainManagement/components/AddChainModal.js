import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import ToastMsg from "components/toast/ToastMsg";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { postApiReq } from "utils/ApiHandlers";
import { getApiReq } from "utils/ApiHandlers";
import { reactIcons } from "utils/icons";

const initialState = {
  name: "",
  icon: "",
  isEVM: 0,
};

function AddChainModal({ isOpen, setIsOpen, getChain }) {
  const [getCurrencyData, setCurrencyData] = useState();
  const [form, setForm] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getFireBlocks();
  }, []);
  const getFireBlocks = () => {
    getApiReq(`/fire-blocks`).then((res) => {
      if (res.status) {
        setCurrencyData(res.data);
      } else {
        toast.error(<ToastMsg title={res.error} />);
      }
    });
  };

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
        setForm({ ...form, [e.target.name]: response.data });
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

  const handleAddChain = () => {
    setIsLoading(true);
    const data = {
      name: form.name,
      icon: form?.icon?.meta?.filename,
      isEVM: parseInt(form?.isEVM),
    };
    postApiReq("/chains", data).then((res) => {
      setIsLoading(false);
      if (res.status) {
        toast.success(<ToastMsg title={"Chain added successfully"} />);
        setIsOpen(false);
        getChain();
        setForm(initialState);
      } else if (res.error.statusCode === 500) {
        toast.error(<ToastMsg title={res.error.message} />);
      } else {
        toast.error(<ToastMsg title={res.error.message[0]} />);
      }
    });
  };

  return (
    <Dialog open={isOpen} aria-labelledby="responsive-dialog-title">
      <div className="w-[400px] rounded-md bg-white ">
        <div className="flex justify-between rounded-full">
          <div className="my-2  flex flex-1 justify-center">
            <h1 className="text-[20px] font-[900]">Add Chain </h1>
          </div>
          <span
            className="text-black cursor-pointer text-[24px]"
            onClick={() => {
              setForm({});
              setIsOpen(false);
            }}
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
          <div className="mt-5">
            <label htmlFor="coin_icon">
              <span className="border-black cursor-pointer border-[1px] bg-lightPrimary py-1 px-3">
                Upload Icon
              </span>
              <p className="text-green-500">{form?.icon?.meta?.filename}</p>
            </label>
            <input
              name="icon"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              id="coin_icon"
            />
          </div>
          <div className="mt-5">
            <label>Is EVM</label>
            <div>
              <select
                name="isEVM"
                value={form.isEVM}
                onChange={handleChange}
                className="bg-whtie  border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>
          </div>
          <div className="my-2 flex justify-end">
            <button
              onClick={handleAddChain}
              className={`text-white ${
                isLoading ? "bg-gray-400" : "bg-blueSecondary"
              } w-28 rounded-md border-[1px]  py-1 px-3`}
              disabled={isLoading}
            >
              Add
            </button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default AddChainModal;
