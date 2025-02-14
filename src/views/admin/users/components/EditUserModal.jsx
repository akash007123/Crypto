import React, { useEffect, useState } from "react";
import { reactIcons } from "utils/icons";
import { Dialog, DialogContent } from "@mui/material";
import { sortedCountryList } from "utils/country";
import { patchApiReq } from "utils/ApiHandlers";
import { isYupError } from "utils/Yup";
import { parseYupError } from "utils/Yup";
import { toast } from "react-toastify";
import { editUserValidation } from "utils/validation";
const initialState = {
  firstname: "",
  lastname: "",
  username: "",
  email: "",
  userType: "",
  mobile: "",
  dialCode: "+91",
};
const EditUserModal = ({ isEdit, setIsEdit, editUserData, refresh }) => {
  const [form, setForm] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (editUserData?.mobile) {
      // Find the matching dial code from the sortedCountryList
      const foundDialCode = sortedCountryList.find((country) =>
        editUserData.mobile.startsWith(country.dial_code)
      );

      if (foundDialCode) {
        const dialCode = foundDialCode.dial_code;
        const mobileNumber = editUserData.mobile.replace(dialCode, "");

        setForm((prev) => ({
          ...prev,
          firstname: editUserData.firstname,
          lastname: editUserData.lastname,
          username: editUserData.username,
          email: editUserData.email,
          mobile: mobileNumber,
          dialCode: dialCode,
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          firstname: editUserData.firstname,
          lastname: editUserData.lastname,
          username: editUserData.username,
          email: editUserData.email,
          mobile: editUserData.mobile,
          dialCode: "+91",
        }));
      }
    }
  }, [editUserData, isEdit, sortedCountryList]);
  const handleEditUser = async () => {
    setIsLoading(true);
    if (editUserData.id) {
      try {
        setFormError({});
        await editUserValidation.validate(form, {
          abortEarly: false,
        });
        const payload = {
          ...form,
          mobile: `${form.dialCode}${form.mobile}`, // Combine dialCode and mobile
        };
        const res = await patchApiReq(`/users/${editUserData.id}`, payload);

        const { status, data, error } = res;
        console.log("commonresponce", res);
        if (status) {
          setIsLoading(false);
          toast.success("Updated Successfully");
          refresh();
          setForm({});
          setIsEdit(false);
        } else {
          setIsLoading(false);
          toast.error(error.message?.[0] || data.message);
        }
      } catch (error) {
        if (isYupError(error)) {
          setFormError(parseYupError(error));
          setIsLoading(false);
        } else {
          toast.error(error.data.message);
          setIsLoading(false);
        }
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isEdit} aria-labelledby="responsive-dialog-title">
      <div className="w-[400px] rounded-md bg-white md:w-[600px] ">
        <div className="flex justify-between rounded-full">
          <div className="my-2  flex flex-1 justify-center">
            <h1 className="text-[20px] font-[900]">Edit User </h1>
          </div>
          <span
            className="text-black cursor-pointer text-[24px]"
            onClick={() => {
              setForm({});
              setIsEdit(false);
            }}
          >
            {reactIcons.close}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 p-5">
          <div>
            <label>First Name</label>
            <div>
              <input
                type="text"
                name="firstname"
                onChange={handleChange}
                value={form.firstname}
                placeholder="Enter your first name"
                className="bg-whtie  border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
              />
              {formError.firstname && (
                <p className="mt-2 text-sm text-red-600">
                  {formError.firstname}
                </p>
              )}
            </div>
          </div>
          <div>
            <label>Last Name</label>
            <div>
              <input
                type="text"
                name="lastname"
                onChange={handleChange}
                value={form.lastname}
                placeholder="Enter your last name"
                className="bg-whtie  border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
              />
              {formError.lastname && (
                <p className="mt-2 text-sm text-red-600">
                  {formError.lastname}
                </p>
              )}
            </div>
          </div>
          <div>
            <label>Email</label>
            <div>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={form.email}
                placeholder="Enter your email"
                className="bg-whtie  border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
              />
              {formError.email && (
                <p className="mt-2 text-sm text-red-600">{formError.email}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white">
              Country
            </label>
            <div className="relative mt-1">
              <select
                name="dialCode"
                value={form.dialCode || ""}
                onChange={(e) => {
                  const selectedCountry = sortedCountryList.find(
                    (item) => item.dial_code === e.target.value
                  );
                  setForm((prev) => ({
                    ...prev,
                    dialCode: selectedCountry?.dial_code || "",
                    country: selectedCountry?.name || "", // Optionally set the country name if needed
                  }));
                }}
                className="border-black h-[40px] w-full rounded-md border-[1px] bg-white px-2 outline-none dark:bg-navy-900 dark:text-white"
              >
                <option value="" disabled hidden>
                  Select a country
                </option>
                {sortedCountryList.map((item, index) => (
                  <option value={item.dial_code} key={index}>
                    {item.flag} {item.name}
                  </option>
                ))}
              </select>
            </div>
            {formError.dialCode && (
              <p className="mt-2 text-sm text-red-600">{formError.dialCode}</p>
            )}
          </div>
          <div>
            <label>Mobile</label>
            <div>
              <div className="flex gap-1">
                <input
                  type="text"
                  name="mobile"
                  value={form.dialCode}
                  placeholder="dialcode"
                  className="border-black h-[40px] w-[70px] rounded-md border-[1px] bg-white px-2 outline-none"
                />
                <input
                  type="text"
                  name="mobile"
                  onChange={handleChange}
                  value={form.mobile}
                  placeholder="Enter your mobile"
                  className="bg-whtie border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
                />
                {formError.mobile && (
                  <p className="mt-2 text-sm text-red-600">
                    {formError.mobile}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogContent>
          <div className="my-2 flex justify-end">
            <button
              onClick={() => {
                setForm({});
                setIsEdit(false);
              }}
              className={`text-white ${
                isLoading ? "bg-gray-400" : "bg-blueSecondary"
              } w-28 rounded-md border-[1px]  py-1 px-3`}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleEditUser}
              className={`text-white ${
                isLoading ? "bg-gray-400" : "bg-blueSecondary"
              } w-28 rounded-md border-[1px]  py-1 px-3`}
              disabled={isLoading}
            >
              Update
            </button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default EditUserModal;
