import { Tooltip } from "@mui/material";
import Card from "components/card";
import SelectField from "components/SelectField/SelectField";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { postReq } from "utils/ApiHandlers";
import { getMonth, getYear } from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import axios from "axios";
import { countryList } from "utils/country";
import UploadDocument from "components/UploadDocument";
import { uploadIdentificationInstruction } from "utils/utils";
import { addressInstuction } from "utils/utils";
import { addressDocument } from "utils/utils";
import { identification } from "utils/utils";
import { memodrandomAssociationDoc } from "utils/utils";
import { companyDocInst } from "utils/utils";
import ActionButton from "components/ActionButton/ActionButton";
import PreviewUserDetails from "components/PreviewUserDetails/PreviewUserDetails";
import { reactIcons } from "utils/icons";
import { purposeOfOpeningAccount } from "utils/utils";
import { restrictedCountries } from "utils/utils";
import useAuth from "utils/useAuth";
import InputFields from "components/InputFields/InputFields";
import "react-country-state-city/dist/react-country-state-city.css";
import "react-datepicker/dist/react-datepicker.css";
import { postApiReq } from "utils/ApiHandlers";
import { ShareholdersDocList } from "utils/utils";
import { AssociationDocList } from "utils/utils";
import { ExtractDocList } from "utils/utils";
const UserKyc = () => {
  const navigate = useNavigate();
  const initialState = {
    firstname: "",
    lastname: "",
    dob: "",
    taxId: "",
    accountOpeningPurpose: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    name: "",
    role: "",
    registrationNumber: "",
  };
  const { getFileUrl, verifyUser } = useAuth();
  const range = (start, end, step) => {
    return Array.from(
      { length: Math.floor((end - start) / step) + 1 },
      (_, index) => start + index * step
    );
  };
  const years = range(1900, getYear(new Date()) + 1, 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const devEnv = process.env.NODE_ENV !== "production";
  const API_URL = `${
    devEnv ? process.env.REACT_APP_DEV_API : process.env.REACT_APP_PROD_API
  }`;
  const [form, setForm] = useState(initialState);
  const [preview, setPreview] = useState(false);
  const [verifyUserData, setVerifyUserData] = useState();
  const [value, setValue] = useState(null);
  const [ageErr, setAgeErr] = useState("");
  const [countryid, setCountryid] = useState(0);
  const [stateid, setstateid] = useState(0);
  const [profileImg, setProfileImg] = useState("");
  const [doc, setDoc] = useState({
    governmentId: [],
    addressProof: [],
    companyRegistrationProof: [],
    memorandumOfAssociation: [],
    registryOfShareholders: [],
    articlesOfAssociation: [],
    registryOfExtract: [],
  });
  let location = useLocation();
  const user = location.state;
  const [showDoc, setShowDoc] = useState({
    governmentId: [],
    addressProof: [],
    companyRegistrationProof: [],
    memorandumOfAssociation: [],
    registryOfShareholders: [],
    articlesOfAssociation: [],
    registryOfExtract: [],
  });
  const isFormValid = () => {
    if (
      form.firstname &&
      form.lastname &&
      form.dob &&
      form.taxId &&
      form.street &&
      form.city &&
      form.state &&
      form.postalCode &&
      doc.governmentId.length > 0 &&
      doc.addressProof.length > 0 &&
      !ageErr
    ) {
      return true;
    } else {
      return false;
    }
  };
  useEffect(() => {
    if (user) {
      setForm({
        firstname: user?.firstname || "",
        lastname: user?.lastname || "",
        dob: user?.dob || "",
        taxId: user?.taxId || "",
        accountOpeningPurpose: user?.accountOpeningPurpose || "",
        street: user?.address?.street || "",
        city: user?.address?.city || "",
        state: user?.address?.state || "",
        postalCode: user?.address?.postalCode || "",
        country: user?.address?.country,
        name: user?.company?.name || "",
        role: user?.company?.role || "",
        registrationNumber: user?.company?.registrationNumber || "",
      });
    }
  }, [user]);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "gray",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "black", // Change background color of the dropdown menu
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "gray" : "gray", // Change background color of the options
      color: "black", // Change text color of the options
    }),
  };
  const [userLocation, setUserLocation] = useState("");
  useEffect(() => {
    axios
      .get(
        "https://api.ipgeolocation.io/ipgeo?apiKey=f5f5eb4a0f0540ceb77064d801b6606b"
      )
      .then((response) => {
        const country = response.data;
        setUserLocation(country);
      });
  }, []);
  const handleStateCity = (e, names) => {
    if (names === "country") {
      const { id, name } = e;
      setCountryid(e.id);
      const country = countryList.find((c) => c.name === name);
      if (country) {
        setForm({
          ...form,
          dialCode: country.phone,
          country: e.name,
          mobile: "",
          state: "",
          city: "",
        });
      }

      return;
    }
    if (names === "state") {
      const { id, name } = e;
      setstateid(e.id);
      setForm({ ...form, state: e.name, city: "" });
      return;
    }
    if (names === "city") {
      const { id, name } = e;
      setForm({ ...form, city: e.name });
      return;
    }
  };
  function validateAge(dob, minAge) {
    const today = new Date();
    const birthDate = new Date(dob);
    const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25; // Considering leap years

    const age = Math.floor((today - birthDate) / millisecondsInYear);

    return age >= minAge;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    let inputValue = value;
    inputValue = inputValue < 0 ? 0 : inputValue;
    setForm((prevState) => ({
      ...prevState,
      [name]: inputValue,
    }));
  };
  const handleRemoveDoc = (dIndex, type) => {
    setDoc((prev) => ({
      ...prev,
      [type]: prev[type].filter((item, index) => index !== dIndex),
    }));
    setShowDoc((prev) => ({
      ...prev,
      [type]: prev[type].filter((item, index) => index !== dIndex),
    }));
  };
  const handleFileChange = async (e, profileImg) => {
    if (e.target.files[0]?.size > 5242880) {
      toast.error("File size should not exceed 5MB");
      return;
    }
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    try {
      const response = await getFileUrl(formData);
      if (response.status) {
        const data = {
          profileImage: response.data.meta.filename,
        };
        if (!profileImg) {
          setDoc((prev) => ({
            ...prev,
            [e.target.name]: [
              ...prev[e.target.name],
              response.data.meta.filename,
            ],
          }));
          setShowDoc((prev) => ({
            ...prev,
            [e.target.name]: [...prev[e.target.name], response.data.url],
          }));
        }

        if (profileImg) {
          const profileData = {
            userId: user?.id,
            profileImage: data.profileImage,
          };
          const response = await postApiReq(
            "/admin/user-profile-image",
            profileData
          );

          if (response.status) {
            setProfileImg(response?.data?.profileImage);
            toast.success("Profile image uploaded successfully");
          }
        }
      } else {
        toast.error(response.error.message, "register error");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  const handleSubmit = async () => {
    if (restrictedCountries.includes(form?.country)) {
      alert(`${form?.country} is not allowed.`);
    } else {
      try {
        const data = {
          firstname: form.firstname,
          lastname: form.lastname,
          dob: form.dob,
          taxId: form.taxId,
          accountOpeningPurpose: form.accountOpeningPurpose,
          address: {
            street: form.street,
            city: form.city,
            state: form.state,
            postalCode: form.postalCode,
            country: form.country,
          },
          governmentIds: doc.governmentId,
          addressProofs: doc.addressProof,
          companyRegistrationProofs: doc.companyRegistrationProof,
          memorandumOfAssociations: doc.memorandumOfAssociation,
          company: {
            name: form.name || null,
            role: form.role || null,
            registrationNumber: form.registrationNumber || null,
          },
          registryOfShareholders: doc.registryOfShareholders || [],
          articlesOfAssociation: doc.articlesOfAssociation || [],
          registryOfExtract: doc.registryOfExtract || [],
        };
        const response = await verifyUser(data, user?.id);
        if (response) {
          navigate("/admin/default");
          toast.success("Kyc details Successfully submitted");
        } else {
          toast.error(response.error.message, "register error");
        }
      } catch (err) {
        toast.error(err.message);
      }
    }
  };
  return (
    <>
      {" "}
      <Card extra={"w-full pb-10 p-4 h-full"}>
        {!preview ? (
          <>
            <div className="text-black dark:text-white">
              <div className="flex justify-between">
                <h1 className=" text-20 font-extrabold dark:text-white">
                  Personal Information
                </h1>
              </div>

              <div className="my-5 block md:flex">
                <div className="w-full flex-grow-0 md:w-[160px] xl:w-[350px]  ">
                  <div className="relative flex w-full justify-center">
                    <div className="mt-5">
                      <Tooltip
                        title="upload your profile photo"
                        sx={{ fontSize: "16px" }}
                      >
                        <img
                          src={
                            profileImg && profileImg
                              ? profileImg
                              : `${API_URL}/storage/user/profile/${user.profileImage}`
                          }
                          alt="profile_img"
                          className="h-32 w-32 rounded-full border-2 border-navy-500 xl:h-36   xl:w-36"
                        />
                      </Tooltip>
                      <label htmlFor="profile_file">
                        <img
                          src="/images/icons/upload.png"
                          alt="upload_icon"
                          className=" relative -top-[27px] left-[unset] -right-[105px] cursor-pointer rounded-full border-[1px] border-navy-500 bg-white  p-1 md:left-28 md:right-[unset] xl:left-28 "
                        />
                      </label>
                      <input
                        name="profileImage"
                        type="file"
                        className="hidden"
                        id="profile_file"
                        onChange={(e) => handleFileChange(e, true)}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-12">
                    <div className="col-span-full px-3 md:col-span-6">
                      <label className="text-14  md:text-16 ">
                        First Name <span className="text-red-700">*</span>
                      </label>

                      <InputFields
                        value={form.firstname}
                        name="firstname"
                        type="text"
                        inpClass="px-3 text-14 md:text-16 outline-none border-[1px] border-navy-50 text-black w-full h-10 rounded-lg dark:!bg-navy-900  dark:text-white dark:!border-navy-900 "
                        placeholder="First Name"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-span-full px-3 md:col-span-6">
                      <label className="text-14  md:text-16">
                        Last Name <span className="text-red-700">*</span>
                      </label>
                      <InputFields
                        value={form.lastname}
                        name="lastname"
                        type="text"
                        inpClass="px-3 text-14 md:text-16 outline-none border-[1px] border-navy-50 text-black w-full h-10 rounded-lg dark:!bg-navy-900  dark:text-white dark:!border-navy-900"
                        placeholder="Last Name"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-span-full px-3 md:col-span-6">
                      <label className="text-14  md:text-16">
                        Email <span className="text-red-700">*</span>
                      </label>
                      <InputFields
                        inpClass="px-3 text-14 md:text-16 outline-none border-[1px] border-navy-50 text-black w-full h-10 rounded-lg dark:!bg-navy-900  dark:text-white dark:!border-navy-900"
                        placeholder="Email"
                        name=""
                        value={user && user.email}
                      />
                    </div>
                    <div className="col-span-full px-3 md:col-span-6">
                      <label className="text-14  md:text-16">
                        Date of Birth <span className="text-red-700">*</span>
                      </label>
                      <div className="mt-2  ">
                        <DatePicker
                          style={{
                            width: "100%",
                            border: "1px solid black",
                            backgroundColor: "blue",
                          }}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/mm/yyyy"
                          value={new Date(form.dob) || value}
                          renderCustomHeader={({
                            date,
                            changeYear,
                            changeMonth,
                            decreaseMonth,
                            increaseMonth,
                            prevMonthButtonDisabled,
                            nextMonthButtonDisabled,
                          }) => (
                            <div
                              style={{
                                margin: "10px 20px",
                                display: "flex",
                                justifyContent: "space-around",
                              }}
                            >
                              <button
                                onClick={decreaseMonth}
                                disabled={prevMonthButtonDisabled}
                              >
                                {"<"}
                              </button>
                              <select
                                value={getYear(date)}
                                onChange={({ target: { value } }) =>
                                  changeYear(value)
                                }
                                style={{
                                  border: "1px solid gray",
                                  padding: "2px 5px",
                                  borderRadius: "3px",
                                }}
                              >
                                {years.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                              <select
                                value={months[getMonth(date)]}
                                onChange={({ target: { value } }) =>
                                  changeMonth(months.indexOf(value))
                                }
                                style={{
                                  border: "1px solid gray",
                                  padding: "2px 5px",
                                  borderRadius: "3px",
                                }}
                              >
                                {months.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>

                              <button
                                onClick={increaseMonth}
                                disabled={nextMonthButtonDisabled}
                              >
                                {">"}
                              </button>
                            </div>
                          )}
                          selected={(form?.dob && new Date(form?.dob)) || value}
                          onChange={(date) => {
                            if (validateAge(date, 18)) {
                              setAgeErr("");
                              setValue(date);
                              setForm({ ...form, dob: date });
                            } else {
                              setAgeErr("Minimum age must be 18 years");
                              setValue(date);
                              setForm({ ...form, dob: date });
                            }
                          }}
                        />
                        {ageErr && (
                          <span className="mt-1 text-red-500">{ageErr}</span>
                        )}
                      </div>
                    </div>
                    <div className="col-span-full px-3 lg:col-span-6">
                      <label className="text-14  md:text-16">
                        Tax ID <span className="text-red-700">*</span>
                      </label>
                      <InputFields
                        value={form.taxId}
                        name="taxId"
                        type="text"
                        inpClass="px-3 text-14 md:text-16 outline-none border-[1px] border-navy-50 text-black w-full h-10 rounded-lg dark:!bg-navy-900  dark:text-white dark:!border-navy-900"
                        placeholder="Enter your Tax ID"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-span-full  px-3 lg:col-span-6">
                      <label className="text-14  md:text-16">
                        Purpose of opening account{" "}
                        <span className="text-red-700">*</span>
                      </label>
                      <SelectField
                        value={form.accountOpeningPurpose}
                        name="accountOpeningPurpose"
                        selectClass="px-3 text-14 md:text-16 bg-white outline-none border-[1px] border-navy-50 text-black w-full h-10 rounded-lg dark:!bg-navy-900  dark:text-white dark:!border-navy-900"
                        iconClass="abosolute ay-center text-navy-500 right-3"
                        selectLabel="Select purpose"
                        onChange={handleChange}
                        list={purposeOfOpeningAccount}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {user.userType === "Business" && (
              <div>
                <div className="text-black my-3">
                  <h1>Company Details</h1>
                </div>
                <div className="text-black  grid grid-cols-12 dark:text-white">
                  <div className="col-span-full px-3 lg:col-span-4">
                    {" "}
                    <label className="text-14  md:text-16">Company Name</label>
                    <InputFields
                      value={form.name}
                      type="text"
                      name="name"
                      inpClass="px-3 text-14 md:text-16 outline-none border-[1px] border-navy-50 text-black w-full h-10 rounded-lg dark:!bg-navy-900  dark:text-white dark:!border-navy-900"
                      placeholder="Enter your company name"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-full px-3 lg:col-span-4">
                    <label className="text-14  md:text-16">
                      Role within the company
                    </label>
                    <InputFields
                      value={form.role}
                      type="text"
                      name="role"
                      inpClass="px-3 text-14 md:text-16 outline-none border-[1px] border-navy-50 text-black w-full h-10 rounded-lg dark:!bg-navy-900  dark:text-white dark:!border-navy-900"
                      placeholder="Enter your role"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-full px-3 lg:col-span-4">
                    <label className="text-14  md:text-16">
                      Company registration number
                    </label>
                    <InputFields
                      value={form.registrationNumber}
                      type="text"
                      name="registrationNumber"
                      inpClass="px-3 text-14 md:text-16 outline-none border-[1px] border-navy-50 text-black w-full h-10 rounded-lg dark:!bg-navy-900  dark:text-white dark:!border-navy-900"
                      placeholder="Enter your registration number"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="border-lightgray my-10 border-t">
              <div className="text-black my-3 ">
                <h1 className="text-20 my-6 font-bold dark:text-white">
                  Address Details
                </h1>
              </div>
              <div className="text-black grid grid-cols-12 ">
                <div className="col-span-full px-3 md:col-span-6">
                  <label className="text-14  md:text-16 dark:text-white">
                    Country <span className="text-red-700">*</span>
                  </label>
                  <CountrySelect
                    // styles={{ backgroundColor: 'black' }}
                    onChange={(e) => {
                      handleStateCity(e, "country");
                    }}
                    placeHolder={
                      form?.country ? form?.country : userLocation?.country_name
                    }
                  />
                </div>
                <div className="col-span-full px-3 md:col-span-6">
                  <label className="text-14  md:text-16 dark:text-white">
                    State/Province <span className="text-red-700">*</span>
                  </label>
                  <StateSelect
                    styles={customStyles}
                    countryid={countryid}
                    onChange={(e) => {
                      handleStateCity(e, "state");
                    }}
                    name="state"
                    placeHolder={
                      form?.state ? form?.state : userLocation.state_prov
                    }
                  />
                </div>
                <div className="col-span-full px-3 md:col-span-6 ">
                  <label className="text-14  md:text-16 dark:text-white">
                    City <span className="text-red-700">*</span>
                  </label>
                  <CitySelect
                    styles={customStyles}
                    countryid={countryid}
                    stateid={stateid}
                    onChange={(e) => {
                      handleStateCity(e, "city");
                    }}
                    placeHolder={form?.city ? form?.city : userLocation?.city}
                  />
                </div>
                <div className="col-span-full px-3 md:col-span-6">
                  <label className="text-14  md:text-16 dark:text-white">
                    Postal Code/ZIP <span className="text-red-700">*</span>
                  </label>
                  <InputFields
                    value={form.postalCode}
                    name="postalCode"
                    type="number"
                    inpClass="px-3 text-14 md:text-16 outline-none border-[1px]  border-navy-50 text-black w-full h-10 rounded-lg dark:text-white dark:!bg-navy-900  dark:!border-navy-900"
                    placeholder="Postal Code/ZIP"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-span-full px-3    ">
                  <label className="text-14  md:text-16 dark:text-white">
                    Street Address <span className="text-red-700">*</span>
                  </label>
                  <InputFields
                    value={form.street}
                    name="street"
                    placeholder="Enter full street address"
                    inpClass="px-3 bg-white text-14 md:text-16 outline-none border-[1px] border-navy-50 text-black w-full h-10 rounded-lg dark:text-white dark:!bg-navy-900  dark:!border-navy-900"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div>
              <div className=" text-black border-lightgray border-t dark:text-white">
                <h1 className="text-20 my-6 font-bold">Documents</h1>
              </div>
              <div className="grid grid-cols-12">
                <div className="col-span-full px-3 md:col-span-6">
                  <UploadDocument
                    upload={true}
                    instrunctionList={uploadIdentificationInstruction}
                    heading="Upload your Identification"
                    handleFileChange={(e) => handleFileChange(e)}
                    name="governmentId"
                    id="gId"
                    value={showDoc.governmentId}
                    // value={
                    //   form?.governmentId?.url ||
                    //   verifyUserData?.document?.governmentId
                    // }
                    setForm={setForm}
                    verifyUserData={verifyUserData}
                    handleRemoveDoc={handleRemoveDoc}
                  />
                </div>
                <div className="col-span-full px-3 md:col-span-6">
                  <UploadDocument
                    upload={false}
                    instrunctionList={identification}
                    heading="We accept these types of Identifications"
                  />
                </div>
                <div className="col-span-full mt-3 px-3 md:col-span-6">
                  <UploadDocument
                    upload={true}
                    instrunctionList={addressInstuction}
                    heading="Proof of Address"
                    handleFileChange={(e) => handleFileChange(e)}
                    name="addressProof"
                    id="aId"
                    // value={
                    //   form?.addressProof?.url ||
                    //   verifyUserData?.document?.addressProof
                    // }
                    value={showDoc.addressProof}
                    setForm={setForm}
                    verifyUserData={verifyUserData}
                    handleRemoveDoc={handleRemoveDoc}
                  />
                </div>
                <div className="col-span-full mt-3 px-3 md:col-span-6">
                  <UploadDocument
                    upload={false}
                    instrunctionList={addressDocument}
                    heading="Valid documents include, but are not limited to:"
                  />
                </div>
                {user?.userType === "Business" && (
                  <>
                    <div className="col-span-full mt-3 px-3 md:col-span-6">
                      <UploadDocument
                        upload={true}
                        instrunctionList={companyDocInst}
                        heading="Proof of Company Registration"
                        handleFileChange={(e) => handleFileChange(e)}
                        name="companyRegistrationProof"
                        id="cId"
                        // value={
                        //   form?.companyRegistrationProof?.url ||
                        //   verifyUserData?.document?.companyRegistrationProof
                        // }
                        value={showDoc.companyRegistrationProof}
                        setForm={setForm}
                        verifyUserData={verifyUserData}
                        handleRemoveDoc={handleRemoveDoc}
                      />
                    </div>
                    <div className="col-span-full mt-3 px-3 md:col-span-6">
                      <UploadDocument
                        upload={true}
                        instrunctionList={memodrandomAssociationDoc}
                        heading="Memorandum of Association"
                        handleFileChange={(e) => handleFileChange(e)}
                        name="memorandumOfAssociation"
                        id="rId"
                        value={showDoc.memorandumOfAssociation}
                        setForm={setForm}
                        handleRemoveDoc={handleRemoveDoc}
                      />
                    </div>
                    <div className="col-span-full mt-3 px-3 md:col-span-6">
                      <UploadDocument
                        upload={true}
                        instrunctionList={ShareholdersDocList}
                        heading="Registry Of Shareholders"
                        handleFileChange={(e) => handleFileChange(e)}
                        name="registryOfShareholders"
                        id="mId"
                        value={showDoc.registryOfShareholders}
                        setForm={setForm}
                        handleRemoveDoc={handleRemoveDoc}
                      />
                    </div>
                    <div className="col-span-full mt-3 px-3 md:col-span-6">
                      <UploadDocument
                        upload={true}
                        instrunctionList={AssociationDocList}
                        heading="Articles Of Association"
                        handleFileChange={(e) => handleFileChange(e)}
                        name="articlesOfAssociation"
                        id="nId"
                        value={showDoc.articlesOfAssociation}
                        setForm={setForm}
                        handleRemoveDoc={handleRemoveDoc}
                      />
                    </div>
                    <div className="col-span-full mt-3 px-3 md:col-span-6">
                      <UploadDocument
                        upload={true}
                        instrunctionList={ExtractDocList}
                        heading="Registry Of Extract"
                        handleFileChange={(e) => handleFileChange(e)}
                        name="registryOfExtract"
                        id="oId"
                        value={showDoc.registryOfExtract}
                        setForm={setForm}
                        handleRemoveDoc={handleRemoveDoc}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <div>
            <div
              onClick={() => setPreview(false)}
              className="mb-3 cursor-pointer"
            >
              <span className="text-24 text-bluewhale">
                {reactIcons.arrowcirclefilled}
              </span>
            </div>
            <PreviewUserDetails
              showDoc={showDoc}
              form={form}
              verifyUserData={verifyUserData}
              user={user}
            />
          </div>
        )}
        <div className="my-6 flex justify-end">
          <ActionButton
            btnName="Preview"
            btnClass="bg-navy-500 px-3 md:px-5 mr-5 py-1 md:py-2 outline-none text-14 md:text-16  text-white bg-bluewhalelight rounded-lg"
            onClick={() => {
              setPreview(true);
            }}
          />
          <ActionButton
            btnName="Submit"
            btnClass={`${
              isFormValid() ? "bg-navy-500" : "bg-navy-200"
            } px-3 md:px-5 mr-5 py-1 md:py-2 text-white text-14 md:text-16 bg-bluewhalelight outline-none rounded-lg`}
            onClick={handleSubmit}
            isDisabled={!isFormValid()}
          />
        </div>
      </Card>
    </>
  );
};

export default UserKyc;
