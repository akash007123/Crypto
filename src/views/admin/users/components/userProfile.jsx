import Card from "components/card";
import { imageHandler } from "utils/formatter";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { postApiReq } from "utils/ApiHandlers";
import { getApiReq } from "utils/ApiHandlers";
import { useEffect, useState } from "react";
import ToastMsg from "components/toast/ToastMsg";
import { BeatLoader } from "react-spinners";
import Loader from "components/loader";

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
//   const data = {
//     _id: "647f9a2b9b45cc01c14e6b1d",
//     username: "auramedia",
//     email: "auramediapro@gmail.com",
//     profile:
//       "https://api.artzcape.com/user/profile/ec0ac7ea30b2eedf3fa0a4949d5454bf.jpg",
//     banner:
//       "https://api.artzcape.com/user/banner/756575d5f1b462f1ab3b369a16580a9a.png",
//     bio: "",
//     links: {
//       yoursite: "https://www.auramediapro.com",
//       instagram: null,
//       twitter: "https://twitter.com/auramediapro",
//       telegram: null,
//       medium: null,
//       discord: null,
//     },
//     address: "0x0220b5BEaB0bE1f20E6F16CCDee45f5ce5d1E2A3",
//     userType: "USER",
//     isVerifiedCreator: true,
//     KYC: {
//       photo:
//         "https://api.artzcape.com/user/verification/13eca83211e024c0dfe0b2e60209dfd5.jpg",
//       address:
//         "https://api.artzcape.com/user/verification/978dab05f01cc737a92025211a859bec.jpg",
//     },
//     nonce: 175994,
//     status: 0,
//     awardsAchievements: [],
//     news: [],
//     createdAt: "2023-06-06T20:42:19.724Z",
//     updatedAt: "2023-09-05T17:00:22.696Z",
//     __v: 0,
//     totalFollowings: 0,
//     totalFollowers: 1,
//     isFollowing: 0,
//   };

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleApproveCreator = (e) => {
    const data = {
      creatorId: id,
    };
    setIsLoading(true);
    postApiReq("/admin/verify-creator", data).then((res) => {
      if (res.status) {
        toast.success(<ToastMsg title="User verified successfully" />);
        setIsLoading(false);
        navigate("/admin/users");
      } else {
        toast.error(<ToastMsg title={res.error} />);
      }
    });
    setIsLoading(true);
  };

  const handleUnapproveCreator = (e) => {
    const data = {
      creatorId: id,
    };
    setIsLoading(true);
    postApiReq("/admin/verify-creator", data).then((res) => {
      if (res.status) {
        toast.success(<ToastMsg title="User unverified successfully" />);
        setIsLoading(false);
        navigate("/admin/users");
      } else {
        toast.error(<ToastMsg title={res.error} />);
      }
    });
    setIsLoading(true);
  };

  useEffect(() => {
    console.log(id);
    if (id) getCreatorDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getCreatorDetails = () => {
    setIsLoading(true);
    getApiReq(`/creator/${id}`).then((res) => {
      if (res.status) {
        setData(res.data);
        setIsLoading(false);
      } else {
        toast.error(<ToastMsg title={res.error} />);

        setIsLoading(false);
      }
    });
  };

  if (data)
    return (
      <Card extra={"items-center w-full p-[16px] bg-cover"}>
        <Loader isLoading={isLoading} />
        <div className="mt-5 h-full w-full">
          <div className="mt-3 w-full">
            <div className="lg:!mb-0">
              <div
                className="relative mt-1 flex h-56 w-full justify-center rounded-xl bg-cover bg-no-repeat  bg-gray-400"
                style={{
                  backgroundImage: `url(${imageHandler(data.banner, 2)})`,
                }}
              >
                <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
                  <img
                    className="h-full w-full rounded-full"
                    src={imageHandler(data.profile, 1)}
                    alt=""
                  />
                </div>
              </div>

              {/* Name and position */}
              <div className="mt-16 flex flex-col items-center">
                <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                  {data.username}
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-2 gap-5 px-2">
          <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-lg text-gray-600">Email</p>
            <p className="text-base font-semibold  text-navy-700 dark:text-white">
              {data.email}
            </p>
          </div>
          <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-lg text-gray-600">Wallet Address</p>
            <p className="text-base font-semibold  text-navy-700 dark:text-white">
              {data.address}
            </p>
          </div>
          <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-lg text-gray-600">Photo KYC</p>
            <img
              className="h-52 w-full object-contain"
              src={imageHandler(data.KYC.address, 3)}
              alt=""
            />
          </div>
          <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-lg text-gray-600">Address KYC</p>
            <img
              className="h-52 w-full object-contain"
              src={imageHandler(data.KYC.address, 3)}
              alt=""
            />
          </div>

          <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-lg text-gray-600">Link - Yoursite</p>
            <p className="text-base font-semibold  text-navy-700 dark:text-white">
              {data?.links?.yoursite || "N/A"}
            </p>
          </div>
          <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-lg text-gray-600">Link - Discord</p>
            <p className="text-base font-semibold  text-navy-700 dark:text-white">
              {data?.links?.discord || "N/A"}
            </p>
          </div>
          <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-lg text-gray-600">Link - Instagram</p>
            <p className="text-base font-semibold  text-navy-700 dark:text-white">
              {data?.links?.instagram || "N/A"}
            </p>
          </div>
          <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-lg text-gray-600">Link - Twitter</p>
            <p className="text-base font-semibold  text-navy-700 dark:text-white">
              {data?.links?.twitter || "N/A"}
            </p>
          </div>
          <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-lg text-gray-600">Link - Telegram</p>
            <p className="text-base font-semibold  text-navy-700 dark:text-white">
              {data?.links?.telegram || "N/A"}
            </p>
          </div>
          <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-lg text-gray-600">Link - Medium</p>
            <p className="text-base font-semibold  text-navy-700 dark:text-white">
              {data?.links?.medium || "N/A"}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-col justify-start rounded-2xl  bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <p className="text-lg text-gray-600">Bio</p>
          <p className="text-base font-semibold  text-navy-700 dark:text-white">
            {data.bio ||
              "N/A"}
          </p>
        </div>
        <div className="mt-3 flex w-full justify-end gap-5 rounded-2xl  bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="linear text-black dark:text-black mt-2 w-fit rounded-xl bg-gray-500 py-[12px] px-[12px] text-base font-medium transition duration-200 hover:bg-gray-600 active:bg-gray-700 dark:bg-gray-400 dark:hover:bg-gray-300 dark:active:bg-brand-200"
          >
            {" "}
            Back
          </button>

          {!data?.isVerifiedCreator ? (
            <button
              type="button"
              onClick={handleApproveCreator}
              className="linear mt-2 w-fit rounded-xl bg-brand-500 py-[12px] px-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            >
              {" "}
              Verify kyc
            </button>
          ) : (
            <button
              type="button"
              onClick={handleUnapproveCreator}
              className="linear mt-2 w-fit rounded-xl bg-brand-500 py-[12px] px-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            >
              {" "}
              Remove kyc
            </button>
          )}
        </div>
      </Card>
    );
  else return <BeatLoader color="#ffffff" className="" />;
};

export default UserProfile;
