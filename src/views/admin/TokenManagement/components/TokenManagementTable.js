import Card from "components/card";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { useMemo, useState } from "react";
import { reactIcons } from "utils/icons";
import moment from "moment";
import EditTokenModal from "./EditTokenModal";
import DeleteTokenModal from "./DeleteTokenModal";
import { ListItemSecondaryAction } from "@mui/material";
const TokenManagementTable = (props) => {
  const { columnsData, tableData, getTokenList } = props;
  const [openOption, setOpenOption] = useState(null);
  const [openEditTokenModal, setOpenEditTokenModal] = useState(false);
  const [tokenData, setTokenData] = useState();
  const [openTokenDeleteModal, setOpenTokenDeleteModal] = useState(false);
  const [viewToken, setViewToken] = useState(null);
  // sm:overflow-x-auto
  return (
    <Card extra={"w-full h-full p-4"}>
      <div className="mt-8 h-full overflow-x-scroll font-mono xl:overflow-hidden">
        <EditTokenModal
          tokenData={tokenData}
          openEditTokenModal={openEditTokenModal}
          setOpenEditTokenModal={setOpenEditTokenModal}
          getTokenList={getTokenList}
        />
        <DeleteTokenModal
          tokenData={tokenData}
          openTokenDeleteModal={openTokenDeleteModal}
          setOpenTokenDeleteModal={setOpenTokenDeleteModal}
          getTokenList={getTokenList}
        />
        <table className="h-full w-full">
          <thead className="text-left">
            <tr>
              <th>S.No</th>
              <th>Token Name</th>
              <th>Created Date</th>
              <th>View</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData?.map((item, index) => {
              return (
                <tr key={index} className="h-10">
                  <td>{index + 1}</td>
                  <td>
                    <div className="flex items-center">
                      <img
                        src={item.imagePath}
                        alt="icon"
                        className="mr-1 h-4 w-4"
                      />
                      <span> {item.name}</span>
                    </div>
                  </td>
                  <td>{moment(item.createdAt).format("DD-MM-YYYY")}</td>
                  <td>
                    <div className="">
                      <span
                        className="text-16 cursor-pointer text-blueSecondary"
                        onClick={() => {
                          if (!viewToken) {
                            setViewToken(item.id);
                          } else {
                            setViewToken(null);
                          }
                        }}
                      >
                        {reactIcons.eyeVisible}
                      </span>
                      {viewToken === item.id && (
                        <div
                          className="top-50 absolute right-0  z-[1000]  h-32 w-full  rounded-lg border-[1px] bg-white dark:bg-navy-900"
                          onMouseLeave={() => setOpenOption(null)}
                        >
                          <div className="text-black p-2 text-left">
                            <table className="w-full">
                              <thead>
                                <th>S.No</th>
                                <th>Chain Name</th>
                                <th>Address</th>
                                <th></th>
                              </thead>
                              <tbody>
                                {item?.platforms?.map((items, index) => {
                                  return (
                                    <tr>
                                      <td>{index + 1}</td>
                                      <td className="flex items-center">
                                        <img
                                          src={items?.chain?.imagePath}
                                          alt="icon"
                                          className="mr-1 h-[16px] w-[16px]"
                                        />
                                        {items?.chain?.name.replaceAll(
                                          "_",
                                          " "
                                        )}
                                      </td>
                                      <td>{items.address}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  {/* <td>Enable</td> */}
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
                          className="h-25 absolute right-10  z-[1000] w-40 rounded-lg border-[1px] bg-white"
                          onMouseLeave={() => setOpenOption(null)}
                        >
                          <div className="text-black p-2 text-left">
                            <p
                              className="cursor-pointer py-1 hover:text-blueSecondary dark:text-gray-800"
                              onClick={() => {
                                setTokenData(item);
                                setOpenEditTokenModal(true);
                              }}
                            >
                              Edit
                            </p>
                            <p
                              onClick={() => {
                                setTokenData(item);
                                setOpenTokenDeleteModal(true);
                              }}
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
                <td>No Any Token Available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TokenManagementTable;
