import InputField from "components/fields/InputField";
import { FcGoogle } from "react-icons/fc";
import Checkbox from "components/checkbox";
import { useState } from "react";
import { loginValidation } from "utils/validation";
import { isYupError } from "utils/Yup";
import { parseYupError } from "utils/Yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ToastMsg from "components/toast/ToastMsg";
import { BeatLoader } from "react-spinners";
import Cookies from "js-cookie";
import { postApiReq } from "utils/ApiHandlers";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value.trim() });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setErrors({});
      await loginValidation.validate(form, {
        abortEarly: false,
      });

      postApiReq("/auth/login", form)
        .then((res) => {
          console.log(res, "xckhgjkhsdfjkgsfjkbgjk");
          if (res.status) {
            setIsLoading(false);
            Cookies.set(
              "user",
              JSON.stringify({
                token: res?.data?.accessToken,
                // user: res?.data?.user,
              })
            );
            Cookies.set(
              "__admin__isLoggedIn",
              JSON.stringify({
                token: res?.data?.accessToken,
                // user: res?.data?.user,
              })
            );
            navigate("/admin/default");
            toast.success(<ToastMsg title="Login Successfully" />);
          } else {
            setIsLoading(false);
            toast.error(<ToastMsg title={res?.error?.message} />);
          }
        })
        .catch((e) => {
          setIsLoading(false);
        });
    } catch (error) {
      setIsLoading(false);
      if (isYupError(error)) {
        setErrors(parseYupError(error));
      }
    }
  };

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Sign in section */}
      <form
        onSubmit={handleSubmit}
        className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]"
      >
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Welcome
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email and password to sign in!
        </p>
        {/* Email */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="Enter your email"
          id="email"
          name="email"
          type="text"
          value={form.email}
          onChange={handleChange}
          state={errors.email ? "error" : "success"}
          error={errors.email}
        />

        <div className=" ">
          <div className="relative">
            <InputField
              variant="auth"
              extra="mb-3"
              label="Password*"
              placeholder="Min. 8 characters"
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              state={errors.password ? "error" : "success"}
              onChange={handleChange}
              error={errors.password}
            />
            <span
              // type="button"
              onClick={toggleVisibility}
              className="bg-transparent absolute  right-3 top-14 -translate-y-1/2"
            >
              {showPassword ? (
                <FiEye className="btn-blu" />
              ) : (
                <FiEyeOff className="btn-blu" />
              )}
            </span>
          </div>
        </div>
        {/* Checkbox */}
        {/* <div className="mb-4 flex items-center justify-between px-2">
          <div className="flex items-center">
            <Checkbox name="consent" />
            <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
              Keep me logged In
            </p>
          </div>

          <a
            className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
            href=" "
          >
            Forgot Password?
          </a>
        </div> */}
        <button
          type="submit"
          disabled={isLoading}
          className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
        >
          {isLoading ? <BeatLoader color="#ffffff" className="" /> : " Log In"}
        </button>
        {/* <div className="mt-4">
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
            Not registered yet?
          </span>
          <a
            href=" "
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Create an account
          </a>
        </div> */}
      </form>
    </div>
  );
}
