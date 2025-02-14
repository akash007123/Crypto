import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import ToastMsg from "components/toast/ToastMsg";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { postApiReq } from "utils/ApiHandlers";
import { getApiReq } from "utils/ApiHandlers";
import { reactIcons } from "utils/icons";

const initialState = {
  name: "",
  tiker: "",
  icon: "",
  type: "Crypto",
  fireblocksassetid: "",
};

function AddTokenModal({ isOpen, setIsOpen, getTokenList }) {
  const [inputFields, setInputFields] = useState([
    { chainId: "", address: "", fireblocksassetid: "" },
  ]);
  const [chainData, setChainData] = useState();
  const [form, setForm] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const handleAddField = () => {
    setInputFields([...inputFields, { chainId: 2, address: "sdf23" }]);
  };

  const handleInputChange = (index, event) => {
    const values = [...inputFields];
    if (event.target.name === "chainId")
      values[index].chainId = parseInt(event.target.value);
    if (event.target.name === "address")
      values[index].address = event.target.value;
    if (event.target.name === "fireblocksassetid")
      values[index].fireblocksassetid = event.target.value;

    setInputFields(values);
  };
  const handleRemoveField = (index) => {
    const values = [...inputFields];
    values.pop();
    setInputFields(values);
  };

  useEffect(() => {
    getTokens();
  }, []);
  const getTokens = () => {
    // setIsLoading(true);
    getApiReq(`/chains?status=Active`).then((res) => {
      if (res.status) {
        // setIsLoading(false);
        setChainData(res.data);
      } else {
        toast.error(<ToastMsg title={res.error} />);
        // setIsLoading(false);
      }
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddToken = () => {
    setIsLoading(true);
    const data = {
      name: form.name,
      tiker: form.tiker,
      platforms: inputFields,
      icon: form?.icon?.meta?.filename,
      type: form?.type,
      fireblocksassetid: form.fireblocksassetid,
    };
    postApiReq("/tokens", data).then((res) => {
      setIsLoading(false);
      if (res.status) {
        toast.success(<ToastMsg title={"Token added successfully"} />);
        setForm(initialState);
        setIsOpen(false);
        getTokenList();
        setInputFields([{ chainId: "", address: "", fireblocksassetid: "" }]);
      } else if (res.error.statusCode === 500) {
        toast.error(<ToastMsg title={res.error.message} />);
      } else {
        if (res.error.message && res.error.message.length > 0) {
          res.error.message.map((err) => {
            toast.error(<ToastMsg title={err} />);
            return true;
          });
        }
      }
    });
  };

  const getFileUrl = async (data) => {
    return await postApiReq("/upload", data);
  };
  // console.log("data", responce);
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

  return (
    <Dialog open={isOpen} aria-labelledby="responsive-dialog-title">
      <div className="w-[500px] rounded-md bg-white ">
        <div className="flex justify-between rounded-full">
          <div className="my-2 flex flex-1 justify-center">
            <h1 className="text-[20px] font-[700]">Add Token</h1>
          </div>
          <span
            className="text-black cursor-pointer text-[24px]"
            onClick={() => {
              setForm(initialState);
              setIsOpen(false);
            }}
          >
            {reactIcons.close}
          </span>
        </div>
        <DialogContent>
          <div>
            <div className="flex">
              <div className="mr-1 flex-1">
                <label>Token Name</label>
                <input
                  onChange={handleChange}
                  name="name"
                  type="text"
                  placeholder="Token"
                  className="bg-whtie  border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
                />
              </div>
              <div className="mx-1 flex-1">
                <label>Ticker</label>
                <input
                  onChange={handleChange}
                  name="tiker"
                  type="text"
                  placeholder="Ticker"
                  className="bg-whtie  border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
                />
              </div>
            </div>
            <div className="mt-5">
              <label htmlFor="token_icon">
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
                id="token_icon"
              />
            </div>
            <div className="mt-5">
              <label>Currency Type</label>
              <select
                name="type"
                className="bg-whtie  border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
                value={form.type}
                onChange={handleChange}
              >
                <option value="Crypto">Crypto</option>
                <option value="Fiat">Fiat</option>
              </select>
            </div>
            {/* <div className="mt-5 flex-1">
              <label>Fireblocks Asset Id</label>
              <input
                onChange={handleChange}
                name="fireblocksassetid"
                type="text"
                placeholder="Fireblocks Asset Id"
                className="bg-whtie  border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
              />
            </div> */}
          </div>
          <div className="my-2">
            <label>Network</label>
            <div className="">
              {/* <input
                type="text"
            /> */}
              {inputFields?.map((inputField, index) => (
                <div className="my-1 flex">
                  <div className="mr-2 flex-1">
                    <select
                      name="chainId"
                      className="bg-whtie  border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
                      key={index}
                      type="text"
                      // value={inputField.value}
                      onChange={(event) => handleInputChange(index, event)}
                    >
                      <option>Select Network</option>
                      {chainData?.map((item, index) => {
                        return (
                          <option key={index} value={item.id}>
                            <img src={item.iconPath} alt="icon" />
                            {item.name.replaceAll("_", " ")}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="mr-2 flex-1">
                    <input
                      name="address"
                      type="text"
                      onChange={(event) => handleInputChange(index, event)}
                      placeholder="Address"
                      className="bg-whtie  border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
                    />
                  </div>
                  <div className="mr-2 flex-1">
                    <input
                      name="fireblocksassetid"
                      type="text"
                      placeholder="Fireblocks Asset Id"
                      onChange={(event) => handleInputChange(index, event)}
                      className="bg-whtie  border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="my-3 flex justify-end">
              <label>Add more networks</label>
              <div className="flex items-center">
                <button
                  className="ml-3 h-8 w-10 rounded-md bg-lightPrimary"
                  onClick={handleAddField}
                >
                  +
                </button>
                <button
                  className="ml-3 h-8 w-10 rounded-md bg-lightPrimary"
                  onClick={() => {
                    if (inputFields.length > 1) {
                      handleRemoveField();
                    }
                  }}
                >
                  -
                </button>
              </div>
            </div>
          </div>
          <div className="my-2 flex justify-end">
            <button
              onClick={handleAddToken}
              disabled={isLoading}
              className={`w-28 rounded-md border-[1px] ${
                isLoading ? "bg-gray-400" : "bg-blueSecondary text-white"
              } py-1 px-3 text-white`}
            >
              Add
            </button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default AddTokenModal;
