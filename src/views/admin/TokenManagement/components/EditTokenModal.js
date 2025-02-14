import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import ToastMsg from "components/toast/ToastMsg";
import React, { useEffect, useState } from "react";
import { IoTennisball } from "react-icons/io5";
import { toast } from "react-toastify";
import { putApiReq } from "utils/ApiHandlers";
import { patchApiReq } from "utils/ApiHandlers";
import { postApiReq } from "utils/ApiHandlers";
import { getApiReq } from "utils/ApiHandlers";
import { reactIcons } from "utils/icons";

const initialState = {
  name: "",
  tiker: "",
};

function EditTokenModal({
  openEditTokenModal,
  setOpenEditTokenModal,
  tokenData,
  getTokenList,
}) {
  const [inputFields, setInputFields] = useState([
    { chainId: "", address: "" },
  ]);
  const [chainData, setChainData] = useState();
  const [form, setForm] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (tokenData) {
      if (tokenData) {
        setForm({
          ...form,
          name: tokenData?.name,
          tiker: tokenData?.tiker,
          icon: tokenData.icon,
          iconShow: tokenData.imagePath,
        });
      }
    }
    const fields = tokenData?.platforms?.map(
      ({ chainId, address, tokenId }) => ({
        chainId,
        address,
        tokenId,
      })
    );

    setInputFields(fields);
  }, [tokenData]);

  const handleAddField = () => {
    setInputFields([...inputFields, { chainId: "", address: "" }]);
  };
  const handleInputChange = (index, event) => {
    const values = [...inputFields];
    if (event.target.name === "chainId")
      values[index].chainId = parseInt(event.target.value);
    values[index].tokenId = tokenData?.platforms[0]?.tokenId;
    if (event.target.name === "address")
      values[index].address = event.target.value;
    setInputFields(values);
  };
  const handleRemoveField = (index) => {
    const values = [...inputFields];
    if (values.length > 1) {
      values.splice(index, 1);
      setInputFields(values);
    }
  };

  useEffect(() => {
    getTokens();
  }, []);
  const getTokens = () => {
    // setIsLoading(true);
    getApiReq(`/chains/`).then((res) => {
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

  const handleUpdateToken = () => {
    setIsLoading(true);
    const data = {
      name: form.name,
      tiker: form.tiker,
      platforms: inputFields,
      icon: form?.icon?.meta?.filename || form?.icon,
    };
    patchApiReq(`/tokens/${tokenData.id}`, data).then((res) => {
      setIsLoading(false);
      console.log("responce", res);
      if (res.status) {
        toast.success(<ToastMsg title={"Token updated successfully"} />);
        getTokenList();
        setOpenEditTokenModal(false);
        setForm({});
        // setIsLoading(false);
      } else {
        toast.error(
          <ToastMsg
            title={
              res.error.message.length === 0
                ? res.error.message
                : res.error.message[0]
            }
          />
        );
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
        setForm({
          ...form,
          [e.target.name]: response.data,
          iconShow: response.data.url,
        });
      } else {
        toast.error(response?.error?.message[0], "register error");
      }
    } catch (err) {
      toast.error(err?.message);
    }
  };

  return (
    <Dialog open={openEditTokenModal} aria-labelledby="responsive-dialog-title">
      <div className="w-[500px] rounded-md bg-white ">
        <div className="flex justify-between rounded-full">
          <div className="flex flex-1 justify-center">
            <h1 className="my-2 text-[20px] font-[700]">Edit Token</h1>
          </div>
          <span
            className="text-black cursor-pointer text-[24px]"
            onClick={() => setOpenEditTokenModal(false)}
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
                  value={form.name}
                  placeholder="Token"
                  className="bg-whtie  border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
                />
              </div>
              <div className="mx-1 flex-1">
                <label>Ticker</label>
                <input
                  onChange={handleChange}
                  value={form?.tiker}
                  name="tiker"
                  type="text"
                  placeholder="Ticker"
                  className="bg-whtie  border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
                />
              </div>
            </div>
            <div className="mt-5 flex items-center">
              <label htmlFor="token_icon">
                <span className="border-black cursor-pointer border-[1px] bg-lightPrimary py-1 px-3">
                  Upload Icon
                </span>
                {/* <p className="text-green-500">
                  {" "}
                  {form?.icon?.meta?.filename || form.icon}
                </p> */}
              </label>
              <input
                name="icon"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                id="token_icon"
              />
              <img src={form.iconShow} alt="icon" className="ml-5 h-7 w-7" />
            </div>
          </div>
          <div className="my-2">
            <label>Network</label>
            <div className="">
              {/* <input
                type="text"
            /> */}
              {inputFields?.map((inputField, index) => {
                return (
                  <div className="my-1 flex items-center">
                    <div className="mr-2 flex-1">
                      <select
                        name="chainId"
                        className="bg-whtie  border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
                        key={index}
                        type="text"
                        value={inputField?.chainId}
                        onChange={(event) => handleInputChange(index, event)}
                      >
                        <option>Select chain</option>
                        {chainData &&
                          chainData?.map((item, index) => {
                            return (
                              <option key={index} value={item.id}>
                                {item.name}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                    <div className="mr-2 flex flex-1 items-center">
                      <input
                        name="address"
                        type="text"
                        value={inputField.address}
                        onChange={(event) => handleInputChange(index, event)}
                        placeholder="Address"
                        className="bg-whtie  border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
                      />
                    </div>
                    <span
                      className="text-24 cursor-pointer"
                      onClick={() => handleRemoveField(index)}
                    >
                      {reactIcons.close}
                    </span>
                  </div>
                );
              })}
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
                {/* <button
                  className="ml-3 h-8 w-10 rounded-md bg-lightPrimary"
                  onClick={() => {
                    if (inputFields.length > 1) {
                      handleRemoveField();
                    }
                  }}
                >
                  -
                </button> */}
              </div>
            </div>
          </div>
          <div className="my-2 flex justify-end">
            <button
              onClick={handleUpdateToken}
              disabled={isLoading}
              className={`${
                isLoading ? "bg-gray-400" : "bg-blueSecondary text-white"
              }  w-28 rounded-md border-[1px]  py-1 px-3`}
            >
              Update
            </button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default EditTokenModal;
