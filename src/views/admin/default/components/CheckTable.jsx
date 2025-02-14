import React from "react";
import Card from "components/card";
import { useEffect, useState } from "react";
import { getApiReq } from "utils/ApiHandlers";
import moment from "moment";
import { Tooltip } from "@mui/material";
import Pagination from "components/Pagination/Pagination";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
const CheckTable = ({ columnsData }) => {
  const currentDate = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(currentDate.getMonth() - 1);
  const [activtyData, setActivityData] = useState([]);

  const [selectedToDate, setSelectedToDate] = useState(dayjs());
  const [selectedFromDate, setSelectedFromDate] = useState(
    dayjs().subtract(1, "month")
  );

  const [page, setPage] = useState(1);
  const take = 5;
  const [pagination, setPagination] = useState({
    totalCount: 0,
  });

  const skip = (page - 1) * take;
  const getTodayActivity = async () => {
    await getApiReq(
      `/admin/users-recent-transaction?startDate=${dayjs(
        selectedFromDate
      ).format("YYYY-MM-DD")}&endDate=${dayjs(selectedToDate).format(
        "YYYY-MM-DD"
      )}&take=${take}&skip=${skip}`
    )
      .then((res) => {
        setActivityData(res.data.data);
        setPagination({
          totalCount: res.data.count,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getTodayActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, take, selectedFromDate, selectedToDate]);

  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Check
        </div>
        <div className=" flex items-center gap-4">
          <div className="date-picker-container">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={selectedFromDate}
                onChange={(newDate) => {
                  setSelectedFromDate(newDate);
                }}
                className="mt-2"
                sx={{
                  "& .MuiInputBase-input": {
                    height: "5px",
                    fontSize: "15px",
                    width: "6rem",
                    color: "grey.600",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "grey.800",
                    },
                    "&:hover fieldset": {
                      borderColor: "grey.600",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "grey.600",
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <div>-</div>
          <div className="date-picker-container">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={selectedToDate}
                onChange={(newDate) => {
                  setSelectedToDate(newDate);
                }}
                className="mt-2"
                sx={{
                  "& .MuiInputBase-input": {
                    height: "5px",
                    fontSize: "15px",
                    width: "6rem",
                    color: "grey.600",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "grey.800",
                    },
                    "&:hover fieldset": {
                      borderColor: "grey.600",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "grey.600",
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
        {/* <CardMenu /> */}
      </header>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full" variant="simple" color="gray-500" mb="24px">
          <thead>
            {columnsData.map((headerGroup, index) => (
              <th
                className="border-b border-gray-200 pr-16 pb-[10px] text-start dark:!border-navy-700"
                key={index}
              >
                <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">
                  {headerGroup.Header}
                </div>
              </th>
            ))}
          </thead>
          <tbody>
            {activtyData.map((activity, index) => {
              let firstTwo = activity.txhash.substring(0, 4);
              let lastTwo = activity.txhash.substring(
                activity.txhash.length - 4
              );
              let id = firstTwo + "...." + lastTwo;

              let firstTwoadd = activity.address.substring(0, 4);
              let lastTwoadd = activity.address.substring(
                activity.address.length - 4
              );
              let address = firstTwoadd + "...." + lastTwoadd;
              return (
                <tr key={index} className="font-ntr h-12 hover:bg-[#137b961f]">
                  <td className="pt-[14px] pb-[16px] sm:text-[14px]">
                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                      {" "}
                      <Tooltip
                        title={activity.txhash}
                        sx={{ fontSize: "16px" }}
                      >
                        <p className="mx-4">{id}</p>
                      </Tooltip>
                    </p>
                  </td>
                  <td>
                    {" "}
                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                      {moment(activity.created_at).format("YYYY-MM-DD")}{" "}
                    </p>
                  </td>
                  <td>
                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                      {`${activity?.firstname} ${activity?.lastname}` ||
                        "Anonymous"}
                    </p>
                  </td>
                  <td>
                    {" "}
                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                      {(activity.amount || 0).toFixed(4)}{" "}
                    </p>
                  </td>
                  <td>
                    <div className="flex ">
                      <img
                        src={activity.tokenImage}
                        alt="img"
                        className="h-8 w-8"
                      />
                    </div>
                  </td>
                  <td>
                    {" "}
                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                      {activity.name}
                    </p>
                  </td>

                  <td className="pt-[14px] pb-[16px] sm:text-[14px]">
                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                      {activity.transaction_type == "Cr"
                        ? "Credited"
                        : "Debited"}
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <Pagination
          pageCount={pagination?.totalCount}
          setPageNumber={setPage}
          take={take}
        />
      </div>
    </Card>
  );
};

export default CheckTable;
