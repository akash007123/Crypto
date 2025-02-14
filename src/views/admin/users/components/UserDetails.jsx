import Card from "components/card";
import Loader from "components/loader";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { postApiReq } from "utils/ApiHandlers";
import { getReq } from "utils/ApiHandlers";
import { BASE_URL } from "utils/endpoints";
import PreviewImage from "components/PreviewImage";
import PreviewDocuments from "./PreviewDocuments";

function UserDetails() {
  const { userId } = useParams();
  const [form, setForm] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState();
  const [reasonErr, setReasonErr] = useState("");
  const navigate = useNavigate();

  const getUserDetails = useCallback(async () => {
    setIsLoading(true);
    const response = await getReq(`/users/${userId}`);
    setIsLoading(false);
    if (response.status) {
      setForm(response.data);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      getUserDetails();
    }
  }, [userId, getUserDetails]);

  const handleVerifyUser = async (status) => {
    if (status == "Rejected" && !reason) {
      setReasonErr("This field is required.");
      return;
    }
    let data = {
      rejectionReason: reason,
    };
    setLoading(true);
    const response = await postApiReq(
      `/users/${userId}/verification/${status}`,
      data
    );
    setLoading(false);
    setStatus("");
    if (response.status) {
      navigate("/admin/users");
      toast.success("User is updated successfully");
    } else {
      toast.error(response.error.message || "Something went wrong");
    }
  };
  return (
    <div className="mt-5">
      <Card extra={"w-full pb-10 p-4 h-full"}>
        <Loader isLoading={isLoading} />
        <header className="relative  items-center justify-between">
          <div className="mb-3 text-xl font-bold text-navy-700 dark:text-white">
            User Details
          </div>
          <div className="text-black grid grid-cols-2 gap-2">
            <div className="col-span-2 mb-2 flex items-center">
              <div>
                <img
                  src="/images/icons/profile.png"
                  alt="profile"
                  className="h-6 w-6"
                />
              </div>
              <p className="mx-3  text-lg">Personal Details</p>
              <div className="cursor-pointer"></div>
            </div>
            <div className="theme-scroller col-span-2 overflow-x-auto overflow-y-hidden">
              <table className="w-full min-w-[550px]">
                <tbody>
                  <tr>
                    <td className="w-4">
                      <img
                        src={`/images/icons/${
                          form?.firstname ? "success.png" : "danger.png"
                        }`}
                        alt={form?.firstname ? "success" : "danger"}
                      />
                    </td>
                    <td className="text-bluewhale w-[250px] px-3 md:w-[300px] lg:w-96">
                      First Name
                    </td>
                    <td className="text-bluewhalelight">
                      {form?.firstname ? form?.firstname : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-4">
                      <img
                        src={`/images/icons/${
                          form?.lastname ? "success.png" : "danger.png"
                        }`}
                        alt={form?.lastname ? "success" : "danger"}
                      />
                    </td>
                    <td className="text-bluewhale w-[250px] px-3 md:w-[300px] lg:w-96">
                      Last Name
                    </td>
                    <td className="text-bluewhalelight">
                      {form?.lastname ? form?.lastname : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-4">
                      <img
                        src={`/images/icons/${
                          form?.dob ? "success.png" : "danger.png"
                        }`}
                        alt={form?.dob ? "success" : "danger"}
                      />
                    </td>
                    <td className="text-bluewhale w-[250px] px-3 md:w-[300px] lg:w-96">
                      Date of Birth
                    </td>
                    <td className="text-bluewhalelight">
                      {form?.dob ? moment(form?.dob).format("DD-MM-YYYY") : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-4">
                      <img
                        src={`/images/icons/${
                          form?.meta.taxId ? "success.png" : "danger.png"
                        }`}
                        alt={form?.metataxId ? "success" : "danger"}
                      />
                    </td>
                    <td className="text-bluewhale w-[250px] px-3 md:w-[300px] lg:w-96">
                      Tax ID
                    </td>
                    <td className="text-bluewhalelight">
                      {form?.meta.taxId ? form?.meta.taxId : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-4">
                      <img
                        src={`/images/icons/${
                          form?.meta.accountOpeningPurpose
                            ? "success.png"
                            : "warning.png"
                        }`}
                        alt={
                          form?.meta.accountOpeningPurpose
                            ? "success"
                            : "warning"
                        }
                      />
                    </td>
                    <td className="text-bluewhale w-[250px] px-3 md:w-[300px] lg:w-96">
                      Purpose of opening account
                    </td>
                    <td className="text-bluewhalelight">
                      {form?.meta?.accountOpeningPurpose
                        ? form?.meta.accountOpeningPurpose
                        : "-"}
                    </td>
                  </tr>
                  {form?.userType == "Business" && (
                    <>
                      <tr>
                        <td className="w-4">
                          <img
                            src={`/images/icons/${
                              form?.meta?.company?.name
                                ? "success.png"
                                : "warning.png"
                            }`}
                            alt={
                              form?.meta?.company?.name ? "success" : "warning"
                            }
                          />
                        </td>
                        <td className="text-bluewhale w-[250px] px-3 md:w-[300px] lg:w-96">
                          Company Name
                        </td>
                        <td className="text-bluewhalelight">
                          {form?.meta?.company?.name
                            ? form?.meta?.company?.name
                            : "-"}
                        </td>
                      </tr>
                      <tr>
                        <td className="w-4">
                          <img
                            src={`/images/icons/${
                              form?.meta?.company?.role
                                ? "success.png"
                                : "warning.png"
                            }`}
                            alt={
                              form?.meta?.company?.role ? "success" : "warning"
                            }
                          />
                        </td>
                        <td className="text-bluewhale w-[250px] px-3 md:w-[300px] lg:w-96">
                          Role Within the Company
                        </td>
                        <td className="text-bluewhalelight">
                          {form?.meta?.company?.role
                            ? form?.meta?.company?.role
                            : "-"}
                        </td>
                      </tr>
                      <tr>
                        <td className="w-4">
                          <img
                            src={`/images/icons/${
                              form?.meta?.company?.registrationNumber
                                ? "success.png"
                                : "warning.png"
                            }`}
                            alt={
                              form?.meta?.company?.registrationNumber
                                ? "success"
                                : "warning"
                            }
                          />
                        </td>
                        <td className="text-bluewhale w-[250px] px-3 md:w-[300px] lg:w-96">
                          Company registration number
                        </td>
                        <td className="text-bluewhalelight">
                          {form?.meta?.company?.registrationNumber
                            ? form?.meta?.company?.registrationNumber
                            : "-"}
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <div className="col-span-2 mb-2 flex items-center">
              <div>
                <img
                  src="/images/icons/location.png"
                  alt="profile"
                  className="h-6 w-6"
                />
              </div>
              <p className="mx-3  text-lg">Address Details</p>
              <div className="cursor-pointer"></div>
            </div>
            <div className="theme-scroller col-span-2 overflow-x-auto overflow-y-hidden">
              <table className="w-full min-w-[550px]">
                <tbody>
                  <tr>
                    <td className="w-4">
                      <img
                        src={`/images/icons/${
                          form?.address?.country ? "success.png" : "danger.png"
                        }`}
                        alt={form?.address?.country ? "success" : "danger"}
                      />
                    </td>
                    <td className="text-bluewhale w-[250px] px-3 md:w-[300px] lg:w-96">
                      Country
                    </td>
                    <td className="text-bluewhalelight">
                      {form?.address?.country ? form?.address?.country : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-4">
                      <img
                        src={`/images/icons/${
                          form?.address?.state ? "success.png" : "danger.png"
                        }`}
                        alt={form?.address?.state ? "success" : "danger"}
                      />
                    </td>
                    <td className="text-bluewhale w-[250px] px-3 md:w-[300px] lg:w-96">
                      State/Province
                    </td>
                    <td className="text-bluewhalelight">
                      {form?.address?.state ? form?.address?.state : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-4">
                      <img
                        src={`/images/icons/${
                          form?.address?.city ? "success.png" : "danger.png"
                        }`}
                        alt={form?.address?.city ? "success" : "danger"}
                      />
                    </td>
                    <td className="text-bluewhale w-[250px] px-3 md:w-[300px] lg:w-96">
                      City
                    </td>
                    <td className="text-bluewhalelight">
                      {form?.address?.city ? form?.address?.city : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-4">
                      <img
                        src={`/images/icons/${
                          form?.address?.addressLine1
                            ? "success.png"
                            : "danger.png"
                        }`}
                        alt={form?.address?.addressLine1 ? "success" : "danger"}
                      />
                    </td>
                    <td className="text-bluewhale w-[250px] px-3 md:w-[300px] lg:w-96">
                      Street Address
                    </td>
                    <td className="text-bluewhalelight">
                      {form?.address?.addressLine1
                        ? form?.address?.addressLine1
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="w-4">
                      <img
                        src={`/images/icons/${
                          form?.address?.postalCode
                            ? "success.png"
                            : "danger.png"
                        }`}
                        alt={form?.address?.postalCode ? "success" : "danger"}
                      />
                    </td>
                    <td className="text-bluewhale w-[250px] px-3 md:w-[300px] lg:w-96">
                      Postal Code/ZIP
                    </td>
                    <td className="text-bluewhalelight">
                      {form?.address?.postalCode
                        ? form?.address?.postalCode
                        : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-span-2 mb-2 flex items-center">
              <div>
                <img
                  src="/images/icons/document.png"
                  alt="profile"
                  className="h-6 w-6"
                />
              </div>
              <p className="mx-3  text-lg">Documents</p>
              <div className="cursor-pointer"></div>
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-6 my-2">
              <PreviewDocuments
                heading="Government Id"
                value={form?.governmentDocuments}
              />
            </div>
            <div className="col-span-6 my-2">
              <PreviewDocuments
                heading="Address Proof"
                value={form?.addressProofDocuments}
              />
            </div>
            {form?.userType === "Business" && (
              <>
                <div className="col-span-6 my-2">
                  <PreviewDocuments
                    heading="Company Registration Proof"
                    value={form?.companyRegistrationDocuments}
                  />
                </div>
                <div className="col-span-6 my-2">
                  <PreviewDocuments
                    heading="Memorandum Of Association Proof"
                    value={form?.memorandumDocuments}
                  />
                </div>

                <div className="col-span-6 my-2">
                  <PreviewDocuments
                    heading="Registry Of Shareholders Proof"
                    value={form?.registryOfShareholders}
                  />
                </div>
                <div className="col-span-6 my-2">
                  <PreviewDocuments
                    heading="Articles Of Association Proof"
                    value={form?.articlesOfAssociation}
                  />
                </div>
                <div className="col-span-6 my-2">
                  <PreviewDocuments
                    heading="Registry Of Extract Proof"
                    value={form?.registryOfExtract}
                  />
                </div>
              </>
            )}
          </div>
          {/* <div className='grid grid-cols-12'>
              <div className='col-span-6 mx-5 my-2 '>
                <label className='my-3'>Proof of Identification	</label>
                <div>
                  { form?.meta?.governmentId?.substring(form?.meta?.governmentId?.length - 3) === "pdf" ?
                  <iframe src={BASE_URL + form?.meta?.governmentId} className='w-full mt-3 max-h-[600px]'></iframe> :
                  <img src={`${BASE_URL + form?.meta?.governmentId}`} alt="img" className='w-full mt-3 max-h-[600px]' />
                  }
                </div>
              </div>
              <div className='col-span-6 mx-5 my-2 '>
                <label className='my-3'>Proof of Address	</label>
                <div>
                     { form?.meta?.addressProof?.substring(form?.meta?.addressProof?.length - 3) === "pdf" ?
                  <iframe src={BASE_URL + form?.meta?.addressProof} className='w-full mt-3 max-h-[600px]'></iframe> :
                  <img src={`${BASE_URL + form?.meta?.addressProof}`} alt="img" className='w-full mt-3 max-h-[600px]' />
                  }
                </div>
              </div>
              <div className='col-span-6 mx-5 my-2 '>
                <label className='my-3'>Proof of Company Registration (Optional)	</label>
                <div>
                    { form?.meta?.companyRegistrationProof?.substring(form?.meta?.companyRegistrationProof?.length - 3) === "pdf" ?
                  <iframe src={BASE_URL + form?.meta?.companyRegistrationProof} className='w-full mt-3 max-h-[600px]'></iframe> :
                  <img src={`${BASE_URL + form?.meta?.companyRegistrationProof}`} alt="img" className='w-full mt-3 max-h-[600px]' />
                  }
                </div>
              </div>
              <div className='col-span-6 mx-5 my-2 '>
                <label className='my-3'>Memorandum of Association (Optional)</label>
                <div>
                    { form?.meta?.memorandumOfAssociation?.substring(form?.meta?.memorandumOfAssociation?.length - 3) === "pdf" ?
                  <iframe src={BASE_URL + form?.meta?.memorandumOfAssociation} className='w-full mt-3 max-h-[600px]'></iframe> :
                  <img src={`${BASE_URL + form?.meta?.memorandumOfAssociation}`} alt="img" className='w-full mt-3 max-h-[600px]' />
                  }
                </div>
              </div>
        </div> */}
        </header>
        <div className="my-3 flex items-center justify-end">
          <div className="flex items-center">
            <div className="w-full flex-1">
              {/* <p>Reason of Rejection</p> */}
              <textarea
                onChange={(e) => {
                  setReasonErr("");
                  setReason(e.target.value);
                }}
                type="text"
                placeholder="Reason of Rejection"
                className="mx-3 mt-1 h-11 w-[700px] rounded-[4px] border border-blueSecondary p-1 outline-none"
              />
              {reasonErr && (
                <p className="text-14 ml-3 text-red-500">{reasonErr}</p>
              )}
            </div>
            <div className="flex">
              <button
                onClick={() => {
                  setStatus("Rejected");
                  handleVerifyUser("Rejected");
                }}
                className={`w-28 rounded-md border-[1px] ${
                  status === "Rejected" && loading
                    ? "bg-gray-300"
                    : "bg-red-500"
                } mx-2  h-12 py-1 px-3 text-white`}
              >
                Reject
              </button>
              <button
                onClick={() => {
                  setStatus("Verified");
                  handleVerifyUser("Verified");
                }}
                className={`w-28 rounded-md border-[1px] ${
                  status === "Verified" && loading
                    ? "text-black bg-gray-300"
                    : "bg-blueSecondary"
                } h-12 py-1 px-3 text-white`}
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default UserDetails;
