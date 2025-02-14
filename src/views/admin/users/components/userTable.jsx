import InfiniteScroll from "react-infinite-scroll-component";
import Card from "components/card";
import React, { useEffect, useState } from "react";

// import { MdCancel, MdCheckCircle } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
import { getApiReq } from "utils/ApiHandlers";
import { toast } from "react-toastify";
import ToastMsg from "components/toast/ToastMsg";
import { imageHandler } from "utils/formatter";
import Loader from "components/loader";
import { Link } from "react-router-dom";
import { reactIcons } from "utils/icons";
import { postApiReq } from "utils/ApiHandlers";
import { FiSearch } from "react-icons/fi";
import Pagination from "components/Pagination/Pagination";
import UserList from "./UserList";

// import Switch from "components/switch";
// import { postApiReq } from "utils/ApiHandlers";
const cutString = (string, length) => {
  if (typeof string != "string") string = JSON.stringify(string);
  if (string?.length < length) return string;

  return string?.substring(0, length) + "...";
};

const ColumnsTable = (props) => {
  const [userData, setUserData] = useState([]);
  // const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [openOption, setOpenOption] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Pending");
  const [queries, setQueries] = useState();
  const [page, setPage] = useState(0);
  const [dataCount, setDataCount] = useState();
  const [pageSize, setPageSize] = useState(10);
  useEffect(() => {
    let timeout;
    const delay = 700;
    const fetchData = () => {
      let query = "";
      if (search) {
        query = `?search=${search}`;
      }

      if (status) {
        query += query ? `&status=${status}` : `?status=${status}`;
      }

      setQueries(query);

      if (query) {
        getUserData(query);
      }
      if (!query && !search) {
        getUserData(query);
      }
    };

    const throttledFetchData = () => {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          fetchData();
        }, delay);
      }
    };

    throttledFetchData();

    return () => clearTimeout(timeout); // Clear the timeout on unmount or before the next effect
  }, [search, status]);

  const getUserData = (query) => {
    setIsLoading(true);
    // getApiReq(`/users/verification-requests?take=${page}&skip=${pageSize}${query ? query : ''}`)
    getApiReq(`/users/verification-requests${query ? query : ""}`).then(
      (res) => {
        if (res.status) {
          setIsLoading(false);
          setUserData(res.data.data);
          setDataCount(res.data.count);
        } else {
          toast.error(<ToastMsg title={res.error} />);
          setIsLoading(false);
        }
      }
    );
    setIsLoading(false);
  };

  // useEffect(() => {
  //   getCreatorData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [tab, offset]);

  // const getCreatorData = () => {
  //   setIsLoading(true);
  //   getApiReq(`/creators?status=${tab}&offset=${offset}`).then((res) => {
  //     if (res.status) {
  //       if (offset > 0) {
  //         setCreatorData([...creatorData, ...res.data]);
  //         setIsLoading(false);
  //       } else {
  //         setCreatorData(res.data);
  //         setIsLoading(false);
  //       }
  //     } else {
  //       toast.error(<ToastMsg title={res.error} />);
  //       setIsLoading(false);
  //     }
  //   });
  // };
  // const getMoreList = () => {
  //   if (creatorData.length > 9) setOffset(offset + 10);
  // };

  // const handleChangeStatus = (userId, index) => {
  //   let data = {
  //     userId: userId,
  //   };
  //   setIsLoading(true);
  //   postApiReq("/admin/update-status", data).then((res) => {
  //     if (res.status) {
  //       toast.success(<ToastMsg title="User status updated" />);
  //       let tempData = [...creatorData];
  //       tempData[index].isActive = !tempData[index].isActive;
  //       setCreatorData(tempData);
  //       setIsLoading(false);
  //     } else {
  //       toast.error(<ToastMsg title={res.error} />);
  //     }
  //   });
  // };

  // useEffect(() => {
  //   return setOffset(0);
  // }, []);

  const handleChangeUserStatus = async (userId, status) => {
    const response = await postApiReq(`/users/${userId}/${status}`);
    if (response.status) {
      toast.success("User status is successfully updated.");
      let updateStatus = userData.map((item) =>
        item.id === userId ? { ...item, status: status } : item
      );
      setUserData(updateStatus);
    } else {
      toast.error(response.error.message || "Something went wrong");
    }
  };

  return (
    <Card extra={"w-full pb-10 p-4 h-full"}>
      <Loader isLoading={isLoading} />
      <header className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          User Kyc List
        </div>
        <div className="flex items-center">
          <div className="mx-3 flex h-12 items-center rounded-full bg-white text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
            <p className="pl-3 pr-2 text-xl">
              <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
            </p>
            <input
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="block h-12 w-full rounded-full  text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
            />
          </div>
          <div className="mt-2 flex items-center justify-center">
            <select
              onChange={(e) => setStatus(e.target.value)}
              value={status}
              className="text-14 mb-3 mr-2 flex h-10  items-center justify-center rounded-md bg-blueSecondary px-3 text-sm font-bold text-gray-600 outline-none hover:cursor-pointer dark:text-white"
            >
              {/* <option value=''>Status</option> */}
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
              <option value="NotInitiated">Not initiated</option>
            </select>
          </div>
        </div>
      </header>
      <InfiniteScroll
        dataLength={userData.length}
        // next={getMoreList}
        hasMore={true}
        style={{ overflow: "none" }}
      >
        <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    Profile Image
                  </div>
                </th>
                <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    User Name
                  </div>
                </th>
                <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    Email
                  </div>
                </th>
                {/* <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    Wallet Address
                  </div>
                </th> */}
                <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    Mobile
                  </div>
                </th>
                <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    Status
                  </div>
                </th>
                <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    KYC
                  </div>
                </th>
                {/* <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    Action
                  </div>
                </th> */}
              </tr>
            </thead>

            <tbody>
              {userData?.length > 0 &&
                userData?.map((user, index) => {
                  return (
                    <tr key={index}>
                      <td className="pt-[14px] pb-[20px] text-center sm:text-[14px]">
                        <img
                          className="image h-10 w-10 rounded-full"
                          src={
                            imageHandler(user?.profileImage, 1) ||
                            "/images/av.jpg"
                          }
                          onError={(e) => {
                            e.target.onerror = null; // Prevent looping in case the fallback image fails too
                            e.target.src = "/images/av.jpg"; // Fallback image
                          }}
                          alt={user?.firstname}
                        />
                      </td>
                      <td className="pt-[14px] pb-[20px] sm:text-[14px]">
                        <Link
                          to={`/admin/details/${user.id}`}
                          className="underline"
                        >
                          <p className="text-sm font-bold text-navy-700 dark:text-white">
                            {`${user?.firstname} ${user?.lastname}` ||
                              "Anonymous"}
                          </p>
                        </Link>
                      </td>
                      <td className="pt-[14px] pb-[20px] pr-3 sm:text-[14px]">
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {user?.email || "N/A"}
                        </p>
                      </td>
                      {/* 
                      <td className="pt-[14px] pb-[20px] sm:text-[14px]">
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {cutString(user.address || "N/A", 10)}
                        </p>
                      </td> */}
                      <td className="pt-[14px] pb-[20px] sm:text-[14px]">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-navy-700 dark:text-white">
                            {user.mobile == null ? "NA" : user.mobile}
                          </p>
                        </div>
                      </td>

                      {/* new one */}
                      <td className="pt-[14px] pb-[20px] sm:text-[14px]">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-navy-700 dark:text-white">
                            {user?.status}
                          </p>
                        </div>
                      </td>
                      {/* old one */}
                      {/* <td className="pt-[14px] pb-[20px] sm:text-[14px]">
                      {user?.status}
                      <Switch
                        color={user.isActive ? "green" : "red"}
                        id={user.id}
                        name="isActive"
                        checked={user.isActive}
                        onChange={() => handleChangeStatus(user._id, index)}
                      />
                    </td> */}

                      {/* new one */}
                      <td className="pt-[14px] pb-[20px] sm:text-[14px]">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-navy-700 dark:text-white">
                            {user.verificationStatus}
                          </p>
                        </div>
                      </td>
                      {/* old one */}
                      {/* <td className="pt-[14px] pb-[20px] sm:text-[14px]">
                      <div className="flex items-center gap-2">
                        {user.isVerifiedCreator ? (
                          <div className={`rounded-full text-xl`}>
                            <MdCheckCircle className="text-green-500" />
                          </div>
                        ) : (
                          <div className={`rounded-full text-xl`}>
                            <MdCancel className="text-red-500" />
                          </div>
                        )}
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {user.isVerifiedCreator ? "Verified" : "Pending"}
                        </p>
                      </div>
                    </td> */}

                      {/* old one */}
                      {/* <td
                      onClick={() => navigate(`/admin/users/${user._id}`)}
                      className="cursor-pointer pt-[14px] pb-[20px] sm:text-[14px]"
                    >
                      <button className="rounded-[20px] bg-lightPrimary px-4 py-2 text-base font-medium text-brand-500 transition duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:active:bg-white/20">
                        View
                      </button>
                    </td> */}
                      {/* <td>
                        <div className="">
                          <span
                            className="text-16 text-black cursor-pointer"
                            onClick={() => {
                              setOpenOption(user.id);
                            }}
                          >
                            {reactIcons.dots}
                          </span>
                          {openOption === user.id && (
                            <div
                              className="min-h-12 absolute right-10  z-[1000] max-h-fit w-40 rounded-lg border-[1px] bg-white"
                              onMouseLeave={() => setOpenOption(false)}
                            >
                              <div className="text-black p-2 py-2 text-left">
                                <p
                                  onClick={() =>
                                    handleChangeUserStatus(
                                      user.id,
                                      user.status === "Active"
                                        ? "Blocked"
                                        : "Active"
                                    )
                                  }
                                  className="text-14 cursor-pointer font-[400]"
                                >
                                  {user.status === "Active"
                                    ? "Inactive"
                                    : "Active"}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </td> */}
                    </tr>
                  );
                })}
              {userData.length == 0 && !isLoading && (
                <tr>
                  {" "}
                  <td
                    className="pt-[14px] pb-[20px] text-center sm:text-[14px]"
                    colSpan={7}
                  >
                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                      No Data Found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination
            dataCount={dataCount}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />
        </div>
      </InfiniteScroll>
    </Card>
  );
};

export default ColumnsTable;
