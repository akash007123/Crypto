import React, { useEffect, useState } from "react";

import InfiniteScroll from "react-infinite-scroll-component";
import Card from "components/card";
import moment from "moment";
import { getApiReq } from "utils/ApiHandlers";
import { toast } from "react-toastify";
import ToastMsg from "components/toast/ToastMsg";
import Loader from "components/loader";
import { FiSearch } from "react-icons/fi";

import { Tooltip } from "@mui/material";
import Pagination from "components/Pagination/Pagination";

const Transection = () => {
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activtyData, setActivityData] = useState([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
  });
  const cutString = (string, length) => {
    if (typeof string != "string") string = JSON.stringify(string);
    if (string?.length < length) return string;

    return string?.substring(0, length) + "...";
  };
  // &take=${take}&skip=${skip}
  const take = 5;
  const skip = (page - 1) * take;
  const getTodayActivity = async () => {
    setIsLoading(true);
    await getApiReq(
      `/admin/users-transation?search=${search}&skip=${skip}&take=${take}`
    )
      .then((res) => {
        setActivityData(res.data.data);
        setIsLoading(false);
        setPagination({
          totalCount: res.data.count,
        });
      })

      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };
  useEffect(() => {
    getTodayActivity();
    setPage((prevRowCountState) =>
      page !== undefined ? page : prevRowCountState
    );
  }, [page, take, search]);

  const devEnv = process.env.NODE_ENV !== "production";
  const API_URL = `${
    devEnv ? process.env.REACT_APP_DEV_API : process.env.REACT_APP_PROD_API
  }`;
  const dataOfApi = [
    { name: "btc", ticker: "BTC" },
    { name: "eth", ticker: "ETH" },
    { name: "dot", ticker: "DOT" },
    { name: "bnb", ticker: "BNB" },
  ];
  return (
    <Card extra={"w-full pb-10 p-4 h-full"}>
      <Loader isLoading={isLoading} />
      <header className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Transaction
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
        </div>
      </header>
      <InfiniteScroll
        dataLength={userData.length}
        hasMore={true}
        style={{ overflow: "none" }}
      >
        <div className="mt-8 overflow-x-scroll ">
          <table className="w-full">
            <thead>
              <tr>
                <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    Transaction Hash
                  </div>
                </th>
                <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    User Name
                  </div>
                </th>
                <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    Created at
                  </div>
                </th>
                <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    Amount
                  </div>
                </th>

                <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    Coin
                  </div>
                </th>
                <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    Name
                  </div>
                </th>
                <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    Status
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {activtyData?.length > 0 &&
                activtyData?.map((activity, index) => {
                  let firstTwo = activity.txhash.substring(0, 4);
                  let lastTwo = activity.txhash.substring(
                    activity.txhash.length - 4
                  );
                  let id = firstTwo + "...." + lastTwo;

                  return (
                    <tr key={index}>
                      <td className="pt-[14px] pb-[20px]  sm:text-[14px]">
                        <p className="text-black font-[700 dark:text-white">
                          {" "}
                          <Tooltip
                            title={activity.txhash}
                            sx={{ fontSize: "16px" }}
                          >
                            <p className="mx-4">{id}</p>
                          </Tooltip>
                        </p>
                      </td>
                      <td className="pt-[14px] pb-[20px] sm:text-[14px]">
                        {`${activity?.firstname} ${activity?.lastname}` ||
                          "Anonymous"}
                      </td>
                      <td className="pt-[14px] pb-[20px] sm:text-[14px]">
                        {moment(activity.created_at).format("DD-MM-YYYY")}
                      </td>
                      <td className="pt-[14px] pb-[20px] sm:text-[14px]">
                        {(activity.amount || 0).toFixed(4)}
                      </td>
                      <td className="pr-3 pt-[14px] pb-[20px] sm:text-[14px]">
                        <div className="flex ">
                          <img
                            src={activity.tokenImage}
                            alt="img"
                            className="h-8 w-8"
                          />
                        </div>
                      </td>

                      <td className="pt-[14px] pb-[20px] sm:text-[14px]">
                        {activity.name}
                      </td>

                      <td className="pt-[14px] pb-[20px] sm:text-[14px]">
                        {" "}
                        {activity.transaction_type === "Cr"
                          ? "Credited"
                          : "Debited"}
                      </td>
                    </tr>
                  );
                })}
              {activtyData?.length === 0 && !isLoading && (
                <tr>
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
            pageCount={pagination.totalCount}
            setPageNumber={setPage}
            take={take}
          />
        </div>
      </InfiniteScroll>
    </Card>
  );
};

export default Transection;
