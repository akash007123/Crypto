import React, { useEffect, useState } from "react";
import Checkbox from "components/checkbox";
import { MdDragIndicator, MdCheckCircle } from "react-icons/md";
import Card from "components/card";
import { postApiReq } from "utils/ApiHandlers";
import { toast } from "react-toastify";
import ToastMsg from "components/toast/ToastMsg";

const TaskCard = () => {
  const [visibleItems, setVisibleItems] = useState(8);
  const [assetsData, setAssetsData] = useState([]);
  const handleAddToken = () => {
    postApiReq("/fire-block-transactions/get-admin-vault-data").then((res) => {
      if (res.status) {
        setAssetsData(res?.data?.assets);
      } else if (res?.error?.statusCode === 500) {
        console.log(res?.error?.message);
      } else {
        console.log(res?.error?.message);
      }
    });
  };
  useEffect(() => {
    handleAddToken();
  }, []);

  const handleViewMore = () => {
    setVisibleItems(assetsData?.length); // Show all items
  };

  return (
    <Card extra="pb-7 p-[20px]">
      {/* task header */}
      <div className="relative flex flex-row justify-between">
        <div className="flex items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-100 dark:bg-white/5">
            <MdCheckCircle className="h-6 w-6 text-brand-500 dark:text-white" />
          </div>
          <h4 className="ml-4 text-xl font-bold text-navy-700 dark:text-white">
            Avaliable Assets
          </h4>
        </div>
      </div>

      {/* task content */}
      <div className="mt-8 h-full max-h-96 overflow-x-scroll overflow-y-scroll ">
        <table className="w-full">
          <thead className="text-left">
            <tr>
              <th>Assets Name</th>
              <th>Total Balance</th>
              <th>Locked Amount</th>
            </tr>
          </thead>
          <tbody>
            {assetsData?.slice(0, visibleItems).map((item, index) => {
              return (
                <tr className=" h-10 " key={index}>
                  <td>{item?.id}</td>
                  <td>{Number(item.total || 0).toFixed(4)}</td>
                  <td>{Number(item.lockedAmount || 0).toFixed(4)}</td>
                </tr>
              );
            })}
            {assetsData?.length < 1 && (
              <tr className="h-20">
                <td></td>
                <td>No Data Available</td>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex flex-row-reverse">
          {visibleItems < assetsData.length && (
            <button
              onClick={handleViewMore}
              className="m-4 rounded bg-blue-500 px-4 py-2 text-white"
            >
              View More
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
