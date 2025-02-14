import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import UploadDocument from "components/UploadDocument";
function PreviewUserDetails({ form, showDoc, user }) {
  return (
    <div className=" text-black px-2 dark:text-white">
      <div className="my-2 flex w-full justify-between">
        <div className="flex-1">
          <div>
            <h1 className="my-1 font-[600] text-navy-500">Personal Details</h1>
            <p>First Name</p>
            <p>Last Name</p>
            <p>Date of Birth</p>
            <p>Tax ID</p>
            <p>Purpose of opening account (optional)</p>
          </div>

          <div>
            <h1 className="my-1 font-[600] text-navy-500">Address Details</h1>
            <p>Country*</p>
            <p>State/Province*</p>
            <p>City*</p>
            <p>Postal Code/ZIP*</p>
            <p>Street Address*</p>
          </div>
          <div>
            <h1 className="my-1 font-[600] text-navy-500">Documents</h1>
            <div className="h-40">
              <p>Proof of Identification</p>
            </div>
            <div className="h-40">
              <p>Proof of Address</p>
            </div>
            {user?.userType == "Business" && (
              <>
                <div className="h-40">
                  <p>Proof of Company Registration </p>
                </div>
                <div className="h-40">
                  <p>Memorandum of Association </p>
                </div>

                <div className="h-40">
                  <p>Registry Of Shareholders:</p>
                </div>
                <div className="h-40">
                  <p>Articles Of Association </p>
                </div>
                <div className="h-40">
                  <p>Registry Of Extract" </p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex-1">
          <div>
            <h1 className="my-1 opacity-0"> -</h1>
            <p>{form.firstname ? form.firstname : "N/A"}</p>
            <p>{form.lastname ? form.lastname : "N/A"}</p>
            <p>{form.dob ? moment(form.dob).format("DD-MM-YYYY") : "N/A"}</p>
            <p>{form.taxId ? form.taxId : "N/A"}</p>
            <p>
              {form.accountOpeningPurpose ? form.accountOpeningPurpose : "N/A"}
            </p>
          </div>

          <div>
            <h1 className="my-1 opacity-0">-</h1>
            <p>{form.country ? form.country : "N/A"}</p>
            <p>{form.state ? form.state : "N/A"}</p>
            <p>{form.city ? form.city : "N/A"}</p>
            <p>{form.postalCode ? form.postalCode : "N/A"}</p>
            <p>{form.street ? form.street : "N/A"}</p>
          </div>
          <div>
            <h1 className="my-1 opacity-0">-</h1>
            <div className="my-1 h-40">
              <UploadDocument
                upload={true}
                preview={true}
                name="governmentId"
                id="gId"
                value={showDoc?.governmentId}
              />
            </div>
            <div className="h-40">
              <UploadDocument
                upload={true}
                preview={true}
                name="governmentId"
                id="gId"
                value={showDoc?.addressProof}
              />
            </div>
            {user?.userType == "Business" && (
              <>
                <div className="h-40">
                  <UploadDocument
                    upload={true}
                    preview={true}
                    name="governmentId"
                    id="gId"
                    value={showDoc?.companyRegistrationProof}
                  />
                </div>
                <div className="h-40">
                  <UploadDocument
                    upload={true}
                    preview={true}
                    name="governmentId"
                    id="gId"
                    value={showDoc?.memorandumOfAssociation}
                  />
                </div>

                <div className="h-40">
                  <UploadDocument
                    upload={true}
                    preview={true}
                    name="registryOfShareholders"
                    id="gId"
                    value={showDoc?.registryOfShareholders}
                  />
                </div>
                <div className="h-40">
                  <UploadDocument
                    upload={true}
                    preview={true}
                    name="articlesOfAssociation"
                    id="gId"
                    value={showDoc?.articlesOfAssociation}
                  />
                </div>
                <div className="h-40">
                  <UploadDocument
                    upload={true}
                    preview={true}
                    name="registryOfExtract"
                    id="gId"
                    value={showDoc?.registryOfExtract}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

PreviewUserDetails.propTypes = {
  form: PropTypes.object,
  verifyUserData: PropTypes.object,
  user: PropTypes.object,
};

export default PreviewUserDetails;
