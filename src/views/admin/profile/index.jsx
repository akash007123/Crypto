import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { patchApiReq, postApiReq } from "utils/ApiHandlers";
import {
  changePasswordValidation,
  UpdateProfileValidation,
} from "utils/validation";
import { parseYupError, isYupError } from "../../../utils/Yup";
import InputField from "components/fields/InputField";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Loader from "components/loader";
import { getApiReq } from "utils/ApiHandlers";

const ProfileOverview = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [eye, setEye] = useState(false);
  const [eye1, setEye1] = useState(false);
  const [eye2, setEye2] = useState(false);
  const [isDetail, setIsDetail] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState({});

  useEffect(() => {
    if (adminData !== null) {
      setForm((prevForm) => ({
        ...prevForm,
        firstname: adminData.firstname || "",
        lastname: adminData.lastname || "",
        email: adminData.email || "",
      }));
    }
  }, [adminData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
    setFormError((prevFormError) => ({
      ...prevFormError,
      [name]: "",
    }));
  };

  // const getAdminDetails = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await getReq("/admin");
  //     if (response.status) {
  //       setAdminData(response.data);
  //       setIsLoading(false);
  //     } else {
  //       console.log(response.error);
  //       setIsLoading(false);
  //     }
  //   } catch (error) {
  //     console.log("Error", error);
  //     setIsLoading(false);
  //   }
  // };

  const getAdminDetails = async () => {
    setIsLoading(true);
    try {
      const response = await getApiReq("/admin");
      if (response.status) {
        setAdminData(response.data);
        setIsLoading(false);
      } else {
        console.error("getAdminDetails error:", response.error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching admin details:", error);
      setIsLoading(false);
    }
  };

  // Edit this code see above

  useEffect(() => {
    getAdminDetails();
  }, []);

  // Edit for Sub-admin
  // const handleUserInfoUpdate = async (e) => {
  //   if (adminData?.role === "sub-admin") {
  //     toast.error("Sub-admins are not allowed to edit profiles.");
  //     return;
  //   }
  const handleUserInfoUpdate = async (e) => {
    e.preventDefault();
    if (adminData?.role === "sub-admin") {
      toast.error("Sub-admins are not allowed to edit profiles.");
      return;
    }

    setIsLoading(true);
    e.preventDefault();
    try {
      setFormError({});
      await UpdateProfileValidation.validate(form, {
        abortEarly: false,
      });
      const res = await patchApiReq("/admin", form);
      console.log("response", res);
      const { status, data } = res;
      if (status) {
        setIsLoading(false);
        toast.success("Updated Successfully");
        setIsDisable(true);
        getAdminDetails();
        console.log("updates");
      } else {
        setIsLoading(false);
        toast.error(data.message);
      }
    } catch (error) {
      if (isYupError(error)) {
        setFormError(parseYupError(error));
      } else {
        toast.error(error?.data?.message);
      }
      setIsLoading(false);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    // Edit for Sub-admin
    if (adminData?.role === "sub-admin") {
      toast.error("Sub-admins are not allowed to change passwords.");
      return;
    }

    setIsLoading(true);
    e.preventDefault();
    try {
      setFormError({});
      await changePasswordValidation.validate(form, {
        abortEarly: false,
      });
      const res = await postApiReq("/admin/change-password", form);
      if (res.data.status === "success") {
        setIsLoading(false);
        toast.success("Password Changed Successfully");
        setForm((prevForm) => ({
          ...prevForm,
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        setIsLoading(false);
        toast.error(res?.data?.message);
      }
    } catch (error) {
      if (isYupError(error)) {
        setFormError(parseYupError(error));
      } else {
        toast.error(error.data.message);
      }
      toast.error("Please fill details");
      setIsLoading(false);
    }
  };

  const handleDetailsChange = () => {
    setIsDetail(!isDetail);
    setForm({});
    setFormError({});
  };

  const editButton = () => {
    // Edit for Sub-admin
    if (adminData?.role === "sub-admin") {
      toast.error("Sub-admins are not allowed to edit profiles.");
      return;
    }
    setIsDisable(!isDisable);
    setFormError({});
  };

  console.log(form, "form");
  console.log(adminData, "adminData");

  return (
    <div className="flex w-full flex-col gap-5 dark:text-white">
      <Loader isLoading={isLoading} />
      {!isDetail ? (
        <div className="flex w-full items-start justify-start">
          <div className="m-auto w-full max-w-[700px] px-4">
            <div className="grid w-full grid-cols-1 gap-4 py-6 sm:grid-cols-2">
              <div className="input_field mt-2">
                <InputField
                  extra="mb-3"
                  label="First Name"
                  placeholder="Please enter first name"
                  id="firstname"
                  name="firstname"
                  type="text"
                  value={form.firstname || ""}
                  onChange={handleChange}
                  state={formError.firstname ? "error" : "success"}
                  error={formError.firstname}
                  disabled={isDisable || adminData?.role === "sub-admin"}
                />
              </div>
              <div className="input_field mt-2">
                <InputField
                  extra="mb-3"
                  label="Last Name"
                  placeholder="Please enter last name"
                  id="lastname"
                  name="lastname"
                  type="text"
                  value={form.lastname || ""}
                  onChange={handleChange}
                  state={formError.lastname ? "error" : "success"}
                  error={formError.lastname}
                  disabled={isDisable || adminData?.role === "sub-admin"}
                />
              </div>
              <div className="input_field mt-2">
                <InputField
                  extra="mb-3"
                  label="Email"
                  placeholder="Please enter email"
                  id="email"
                  name="email"
                  type="text"
                  value={adminData?.email || ""}
                  onChange={handleChange}
                  disabled={true}
                />
              </div>
            </div>
            <div className="flex flex-col-reverse gap-5 sm:flex-row-reverse">
              <button
                onClick={() => {
                  handleDetailsChange();
                  setIsLoading(false);
                }}
                type="button"
                className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 sm:w-[200px]"
              >
                Change Password
              </button>
              <button
                type="button"
                onClick={handleUserInfoUpdate}
                className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 sm:w-[200px]"
              >
                Update
              </button>
            </div>
          </div>
          {/* Edit for Sub-Admin */}
          {adminData?.role !== "sub-admin" && (
            <div
              className="linear mx-4 mt-[66px] cursor-pointer rounded-xl bg-brand-500 py-2 px-6 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
              onClick={editButton}
            >
              Edit
            </div>
          )}
        </div>
      ) : (
        <div className="flex w-full items-center justify-start">
          <div className="m-auto w-full max-w-[500px] px-4">
            <div className="flex w-full flex-col gap-2 py-6">
              <div className="input_field relative mt-3">
                <InputField
                  variant="auth"
                  extra="mb-3"
                  label="oldPassword"
                  placeholder="Old Password"
                  id="oldPassword"
                  name="oldPassword"
                  type={eye ? "text" : "password"}
                  value={form.oldPassword || ""}
                  onChange={handleChange}
                  state={formError.oldPassword ? "error" : "success"}
                  error={formError.oldPassword}
                  // Edit for Sub-admin
                  disabled={adminData?.role === "sub-admin"}
                />
                <span
                  className="absolute right-4 top-[50px] z-10 translate-y-[-50%] cursor-pointer"
                  onClick={() => setEye(!eye)}
                >
                  {eye ? (
                    <FiEye className="btn-blu" />
                  ) : (
                    <FiEyeOff className="btn-blu" />
                  )}
                </span>
              </div>
              <div className="input_field relative mt-3">
                <InputField
                  variant="auth"
                  extra="mb-3"
                  label="New Password"
                  placeholder="New Password"
                  id="New Password"
                  name="newPassword"
                  type={eye1 ? "text" : "password"}
                  value={form.newPassword || ""}
                  onChange={handleChange}
                  state={formError.newPassword ? "error" : "success"}
                  error={formError.newPassword}
                  // Edit for Sub-admin
                  disabled={adminData?.role === "sub-admin"}
                />

                <span
                  className="absolute right-4 top-[50px] z-10 translate-y-[-50%] cursor-pointer"
                  onClick={() => setEye1(!eye1)}
                >
                  {eye1 ? (
                    <FiEye className="btn-blu" />
                  ) : (
                    <FiEyeOff className="btn-blu" />
                  )}
                </span>
              </div>
              <div className="input_field relative mt-3">
                <InputField
                  variant="auth"
                  extra="mb-3"
                  label="New Password"
                  placeholder="Confirm New Password"
                  id="confirmPassword"
                  name="confirmPassword"
                  type={eye2 ? "text" : "password"}
                  value={form.confirmPassword || ""}
                  onChange={handleChange}
                  state={formError.confirmPassword ? "error" : "success"}
                  error={formError.confirmPassword}
                  // Edit for Sub-admin
                  disabled={adminData?.role === "sub-admin"}
                />

                <span
                  className="absolute right-4 top-[50px] z-10 translate-y-[-50%] cursor-pointer"
                  onClick={() => setEye2(!eye2)}
                >
                  {eye2 ? (
                    <FiEye className="btn-blu" />
                  ) : (
                    <FiEyeOff className="btn-blu" />
                  )}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-5 sm:flex-row sm:justify-center">
              <button
                onClick={() => {
                  handleDetailsChange();
                  setIsLoading(true);
                }}
                type="button"
                className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 sm:w-auto sm:px-6"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleChangePasswordSubmit}
                className="inear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 sm:w-auto sm:px-6"
              >
                {" "}
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileOverview;

// Edit
