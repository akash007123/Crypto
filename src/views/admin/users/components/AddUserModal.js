import { Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { postApiReq } from "utils/ApiHandlers";
import { userProffesionList } from "utils/constants";
import { sortedCountryList } from "utils/country";
import { reactIcons } from "utils/icons";
import { addUserValidation } from "utils/validation";
import { parseYupError } from "utils/Yup";
import { isYupError } from "utils/Yup";

const initialState = {
  firstname: "",
  lastname: "",
  email: "",
  userType: "",
  mobile: "",
  password: "",
  confirm_password: "",
  dialCode: "+91",
};

function AddUserModal({ isOpen, setIsOpen, refresh }) {
  const [form, setForm] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
    setFormError((prevFormError) => ({
      ...prevFormError,
      [name]: "",
    }));
  };
  const handleAddUser = async () => {
    setIsLoading(true);
    try {
      setFormError({});
      await addUserValidation.validate(form, {
        abortEarly: false,
      });
      const payload = {
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        userType: form.userType,
        mobile: form.dialCode + form.mobile,
        password: form.password,
        confirm_password: form.confirm_password,
      };
      const res = await postApiReq("/admin/create-user-by-admin", payload);

      if (res.data.status === "success" || res.status == false) {
        setIsLoading(false);
        toast.success("User Added Successfully");
        setIsOpen(false);
        refresh();
        setForm(initialState);
      } else {
        setIsLoading(false);
        toast.error(res?.data?.message);
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
  };
  console.log("adduser", form);

  return (
    <Dialog open={isOpen} aria-labelledby="responsive-dialog-title">
      <div className="w-[400px] rounded-md bg-white md:w-[600px] ">
        <div className="flex justify-between rounded-full">
          <div className="my-2  flex flex-1 justify-center">
            <h1 className="text-[20px] font-[900]">Add User </h1>
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
            <label>User Type</label>
            <div>
              <select
                name="userType"
                value={form.userType}
                onChange={handleChange}
                className="border-black h-[40px] w-full rounded-md border-[1px] bg-white px-2 outline-none"
              >
                <option value="">Select user type</option>
                {userProffesionList?.map((item, index) => {
                  return (
                    <option value={item.value} key={index}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              {formError.userType && (
                <p className="mt-2 text-sm text-red-600">
                  {formError.userType}
                </p>
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
                  placeholder="Enter your mobile"
                  className="border-black h-[40px] w-[70px] rounded-md border-[1px] bg-white px-2 outline-none"
                />
                {/* <select
                  className="border-black h-[40px] w-[70px] rounded-md border-[1px] bg-white px-2 outline-none"
                  value={form.dialCode || ""}
                  onChange={handleChange}
                  name="dialCode"
                >
                  {sortedCountryList.map((item, index) => (
                    <option value={item.dial_code} key={index}>
                      {item.dial_code}
                    </option>
                  ))}
                </select> */}
                <input
                  type="text"
                  name="mobile"
                  onChange={handleChange}
                  value={form.mobile}
                  placeholder="Enter your mobile"
                  className="bg-whtie border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
                />
              </div>

              {formError.mobile && (
                <p className="mt-2 text-sm text-red-600">{formError.mobile}</p>
              )}
            </div>
          </div>

          <div>
            <label>Password</label>
            <div>
              <input
                type="text"
                name="password"
                onChange={handleChange}
                value={form.password}
                placeholder="Enter your password"
                className="bg-whtie  border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
              />
              {formError.password && (
                <p className="mt-2 text-sm text-red-600">
                  {formError.password}
                </p>
              )}
            </div>
          </div>
          <div>
            <label>Confirm Password</label>
            <div>
              <input
                type="text"
                name="confirm_password"
                onChange={handleChange}
                value={form.confirm_password}
                placeholder="Enter your confirm password"
                className="bg-whtie  border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
              />
              {formError.confirm_password && (
                <p className="mt-2 text-sm text-red-600">
                  {formError.confirm_password}
                </p>
              )}
            </div>
          </div>
        </div>
        <DialogContent>
          <div className="my-2 flex justify-end">
            <button
              onClick={handleAddUser}
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

export default AddUserModal;
