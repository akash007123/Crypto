import React, { useEffect, useState } from "react";

import InfiniteScroll from "react-infinite-scroll-component";
import Card from "components/card";

// import { MdCancel, MdCheckCircle } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
import { getApiReq } from "utils/ApiHandlers";
import { toast } from "react-toastify";
import ToastMsg from "components/toast/ToastMsg";
// import { imageHandler } from "utils/formatter";
import Loader from "components/loader";
import { Link, useNavigate } from "react-router-dom";
import { reactIcons } from "utils/icons";
import { postApiReq } from "utils/ApiHandlers";
import { FiSearch } from "react-icons/fi";
import Pagination from "components/Pagination/Pagination";
import { patchApiReq } from "utils/ApiHandlers";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
const UserList = () => {
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openOption, setOpenOption] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [editUserData, setEditUserData] = useState({});
  const [page, setPage] = useState(1);
  const take = 5;
  const [dataCount, setDataCount] = useState();
  const [pageSize] = useState(10);

  const getUserData = () => {
    setIsLoading(true);
    getApiReq(
      `/admin/user-list?search=${search}&take=${take}&skip=${(page - 1) * take}`
    ).then((res) => {
      if (res.status) {
        setIsLoading(false);
        setUserData(res?.data?.data);
        setDataCount(res.data.totalCount);
      } else {
        toast.error(<ToastMsg title={res.error} />);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    getUserData();
    setPage((prevRowCountState) =>
      page !== undefined ? page : prevRowCountState
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, take, page, pageSize]);

  const handleChangeUserStatus = async (userId, status) => {
    const requestedData = {
      userId: userId,
      status: status,
    };
    const response = await postApiReq(
      "/admin/user-status-update",
      requestedData
    );
    if (response.status) {
      toast.success(
        response?.data?.message || "User status is successfully updated."
      );
      let updateStatus = userData.map((item) =>
        item.id === userId ? { ...item, status: status } : item
      );
      setUserData(updateStatus);
      console.log("updateStatus", updateStatus);
    } else {
      toast.error(response.error.message || "Something went wrong");
    }
  };
  const handleDeleteUser = async (userId) => {
    try {
      const response = await patchApiReq(
        `/admin/user-delete?isDeleted=true&userId=${userId}`
      );
      if (response.status) {
        toast.success("User deleted successfully.");
        getUserData();
      } else {
        toast.error(response.error.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error);
    }
  };
  const devEnv = process.env.NODE_ENV !== "production";
  const API_URL = `${
    devEnv ? process.env.REACT_APP_DEV_API : process.env.REACT_APP_PROD_API
  }`;
  const handleAddUserKyc = (user) => {
    navigate(`/admin/user-kyc/${user.id}`, {
      state: user,
    });
  };
  const handleOpenEdit = (userInfo) => {
    setIsEdit(true);
    setEditUserData(userInfo);
  };
  return (
    <>
      <Card extra={"w-full pb-10 p-4 h-full"}>
        <Loader isLoading={isLoading} />
        <header className="relative flex items-center justify-between">
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Userlist
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
            <button
              onClick={() => {
                setIsOpen(true);
              }}
              className="text-black linear cursor-pointer rounded-xl bg-white px-4 py-2 text-center text-base font-medium transition duration-200 hover:!bg-white/80 "
            >
              Add User
            </button>
          </div>
        </header>
        <InfiniteScroll
          dataLength={userData.length}
          // next={getMoreList}
          hasMore={true}
          style={{ overflow: "none" }}
        >
          <div className="mt-8 overflow-x-scroll ">
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
                  <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                    <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                      Action
                    </div>
                  </th>
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
                            src={`${API_URL}/storage/user/profile/${user?.profileImage}`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/images/av.jpg";
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
                        <td className="pr-3 pt-[14px] pb-[20px] sm:text-[14px]">
                          <p className="text-sm font-bold text-navy-700 dark:text-white">
                            {user?.email || "N/A"}
                          </p>
                        </td>
                        <td className="pt-[14px] pb-[20px] sm:text-[14px]">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-navy-700 dark:text-white">
                              {user.mobile == null ? "NA" : user.mobile}
                            </p>
                          </div>
                        </td>
                        <td className="pt-[14px] pb-[20px] sm:text-[14px]">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-navy-700 dark:text-white">
                              {user?.status}
                            </p>
                          </div>
                        </td>
                        <td className="pt-[14px] pb-[20px] sm:text-[14px]">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-navy-700 dark:text-white">
                              {user.verificationStatus == "NotInitiated"
                                ? "Not initiated"
                                : user.verificationStatus}
                            </p>
                          </div>
                        </td>
                        <td>
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
                                className="min-h-12 absolute right-10 z-[1000] max-h-fit w-40 rounded-lg border bg-white shadow-md"
                                onMouseLeave={() => setOpenOption(false)}
                              >
                                <div
                                  key={index}
                                  className="text-black p-2 text-left hover:bg-gray-100 dark:text-gray-800 dark:hover:bg-gray-700"
                                >
                                  <p
                                    onClick={() =>
                                      handleChangeUserStatus(
                                        user.id,
                                        user.status === "Active"
                                          ? "Inactive"
                                          : "Active"
                                      )
                                    }
                                    className="text-14 cursor-pointer font-[400] dark:text-gray-800"
                                  >
                                    {user.status === "Active"
                                      ? "Inactive"
                                      : "Active"}
                                  </p>
                                </div>
                                <div className="text-black p-2 text-left hover:bg-gray-100 dark:text-gray-800 dark:hover:bg-gray-700">
                                  <p
                                    className="text-14 cursor-pointer font-[400] dark:text-gray-800"
                                    onClick={() =>
                                      handleChangeUserStatus(user.id, "Blocked")
                                    }
                                  >
                                    Blocked
                                  </p>
                                </div>
                                <div className="text-black p-2 text-left hover:bg-gray-100 dark:text-gray-800 dark:hover:bg-gray-700">
                                  <p
                                    className="text-14 cursor-pointer font-[400] dark:text-gray-800"
                                    onClick={() =>
                                      handleChangeUserStatus(user.id, "Freeze")
                                    }
                                  >
                                    Freeze
                                  </p>
                                </div>
                                <div className="text-black p-2 text-left hover:bg-gray-100 dark:text-gray-800 dark:hover:bg-gray-700">
                                  <p
                                    className="text-14 cursor-pointer font-[400] dark:text-gray-800"
                                    onClick={() => handleOpenEdit(user)}
                                  >
                                    Edit
                                  </p>
                                </div>
                                {user.verificationStatus === "NotInitiated" && (
                                  <div className="text-black p-2 text-left hover:bg-gray-100 dark:text-gray-800 dark:hover:bg-gray-700">
                                    <p
                                      className="text-14 cursor-pointer font-[400] dark:text-gray-800"
                                      onClick={() => handleAddUserKyc(user)}
                                    >
                                      Add KYC
                                    </p>
                                  </div>
                                )}
                                <div className="text-black p-2 text-left hover:bg-gray-100 dark:text-gray-800 dark:hover:bg-gray-700">
                                  <p
                                    className="text-14 cursor-pointer font-[400] dark:text-gray-800"
                                    onClick={() => handleDeleteUser(user.id)}
                                  >
                                    Delete
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                {userData?.length === 0 && !isLoading && (
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
              pageCount={dataCount}
              setPageNumber={setPage}
              take={take}
            />
          </div>
        </InfiniteScroll>
      </Card>
      <AddUserModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        refresh={getUserData}
      />
      <EditUserModal
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        editUserData={editUserData}
        refresh={getUserData}
      />
    </>
  );
};

export default UserList;
