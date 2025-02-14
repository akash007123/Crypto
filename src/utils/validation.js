import * as yup from "yup";
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{3,3}$/i;
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[~!@#$%^&*()/_=+[\]{}|;:,.<>?-])(?=.*[0-9])(?=.*[a-z]).{8,40}$/;

export const loginValidation = yup.object().shape({
  email: yup
    .string()
    .required("Please enter you email address")
    .matches(emailRegex, "Please enter valid email"),
  password: yup
    .string()
    .required("Please enter password.")
    .matches(
      passwordRegex,
      "Only accept One Uppercase and atleast one special characters and numbers."
    )
    .min(8, "Minimum 8 characters is required."),
});

export const ChainValidation = yup.object().shape({
  name: yup.string().required("Please Select the chain name"),
  icon: yup.string().required("Please upload chain icon"),
});
export const changePasswordValidation = yup.object().shape({
  oldPassword: yup.string().required("Please enter old password"),
  newPassword: yup
    .string()
    .required("Please enter new password.")
    .matches(
      /^(?=.*[A-Z])(?=.*[~!@#$%^&*()/_=+[\]{}|;:,.<>?-])(?=.*[0-9])(?=.*[a-z]).{8,14}$/,
      "Only accept One Uppercase and atleast one special characters and numbers."
    )
    .min(8, "Minimum 8 characters is required."),
  confirmPassword: yup
    .string()
    .required("Please enter confirm password")
    .oneOf([yup.ref("newPassword")], "Passwords not matched"),
});

export const UpdateProfileValidation = yup.object().shape({
  firstname: yup.string().required("please enter your frist name"),
  lastname: yup.string().required("please enter your last name"),
  // email: yup.string().required("please enter your email"),
  // username: yup.string().required("please enter your user name"),
  // country: yup.string().required("please enter country name"),
});

export const addUserValidation = yup.object().shape({
  firstname: yup.string().required("Please enter first name"),
  lastname: yup.string().required("Please enter last name"),
  email: yup.string().email().required("Please enter email"),
  userType: yup.string().required("Please select user type"),
  mobile: yup.string().required("Please enter mobile number"),
  password: yup
    .string()
    .required("Please enter password.")
    .min(6, "Minimum 8 characters is required.")
    .max(15, "Maximum 15 characters is required."),
  confirm_password: yup
    .string()
    .required("Please enter confirm password")
    .oneOf([yup.ref("password")], "Passwords not matched"),
});
export const editUserValidation = yup.object().shape({
  firstname: yup.string().required("Please enter first name"),
  lastname: yup.string().required("Please enter last name"),
  email: yup.string().email().required("Please enter email"),
  mobile: yup.string().required("Please enter mobile number"),
});
