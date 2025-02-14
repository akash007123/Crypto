import Card from "components/card";
import ToastMsg from "components/toast/ToastMsg";
import moment from "moment";

import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { deleteApiReq } from "utils/ApiHandlers";
import { postApiReq } from "utils/ApiHandlers";
import { reactIcons } from "utils/icons";
import EditChainModal from "./EditChainModal";
import { getApiReq } from "utils/ApiHandlers";
const ChainManagementTable = (props) => {
  const [openOption, setOpenOption] = useState(null);
  const { columnsData, tableData, getChain } = props;
  const [openEditChainModal, setOpenEditChainModal] = useState(false);
  const [chainData, setChainData] = useState();

  const handleEnableDisable = (id) => {
    postApiReq(`/chains/${id}`).then((res) => {
      if (res.status) {
        toast.success(<ToastMsg title={"Chain status updated successfully"} />);
        getChain();
      } else {
        toast.error(<ToastMsg title={res.error} />);
      }
    });
  };

  const handleRemove = (id) => {
    deleteApiReq(`/chains/${id}`).then((res) => {
      if (res.status) {
        toast.success(<ToastMsg title={"Chain deleted successfully"} />);
        getChain();
        // setIsLoading(false);
        // setChainData(res.data);
      } else {
        toast.error(<ToastMsg title={res.error} />);
        // setIsLoading(false);
      }
      // window.location.reload();
    });
  };

  return (
    <Card extra={"w-full h-full p-4"}>
      <div className="mt-8 h-full overflow-x-scroll font-mono xl:overflow-hidden">
        <EditChainModal
          openEditChainModal={openEditChainModal}
          setOpenEditChainModal={setOpenEditChainModal}
          chainData={chainData}
          getChain={getChain}
        />
        <table className="w-full">
          <thead className="text-left">
            <tr>
              <th>S.No</th>
              <th>Chain Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData?.map((item, index) => {
              return (
                <tr className=" h-10 " key={index}>
                  <td className="">{index + 1}</td>
                  <td className="mt-2 flex items-center">
                    <img
                      src={item.iconPath}
                      alt="icon"
                      className="mr-2 h-[16px] w-[16px]"
                    />
                    {item.name.replaceAll("_", " ")}{" "}
                    {item.isEVM ? " (EVM)" : ""}
                  </td>
                  <td>{moment(item.createdAt).format("DD-MM-YYYY")}</td>
                  <td>{item.status === "Active" ? "Enable" : "Disable"}</td>
                  <td>
                    <div className="">
                      <span
                        className="text-16 cursor-pointer"
                        onClick={() => {
                          setOpenOption(item.id);
                        }}
                      >
                        {reactIcons.dots}
                      </span>
                      {openOption === item.id && (
                        <div
                          className="absolute right-10 z-[1000]  h-32 w-40 rounded-lg border-[1px]  bg-gray-50 "
                          onMouseLeave={() => setOpenOption(false)}
                        >
                          <div className=" p-2 text-left">
                            {item.status === "Active" ? (
                              <p
                                onClick={() => handleEnableDisable(item.id)}
                                className="cursor-pointer py-1 hover:text-blueSecondary dark:text-gray-800"
                              >
                                Disable
                              </p>
                            ) : (
                              <p
                                onClick={() => handleEnableDisable(item.id)}
                                className="cursor-pointer py-1 hover:text-blueSecondary dark:text-gray-800"
                              >
                                Enable
                              </p>
                            )}
                            <p
                              onClick={() => {
                                setChainData(item);
                                setOpenEditChainModal(true);
                              }}
                              className="cursor-pointer py-1 hover:text-blueSecondary dark:text-gray-800"
                            >
                              Edit
                            </p>
                            <p
                              onClick={() => handleRemove(item.id)}
                              className="cursor-pointer py-1 hover:text-blueSecondary dark:text-gray-800"
                            >
                              Remove
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {tableData?.length < 1 && (
              <tr className="h-20">
                <td></td>
                <td></td>
                <td>No Any Chain Available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ChainManagementTable;
