import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import ComplexTable from "../tables/components/ComplexTable";
import ChainManagementTable from "./components/ChainManagementTable";
import AddChainModal from "./components/AddChainModal";
import { getApiReq } from "utils/ApiHandlers";

export const columnsDataDevelopment = [
  {
    Header: "S.No",
    accessor: "s",
  },
  {
    Header: "Chain Name",
    accessor: "chainname",
  },
  {
    Header: "DATE",
    accessor: "date",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

export const tableDataColumns = [
  {
    s: "1",
    chainname: "BTC",
    status: "Disable",
    action: "disable",
    date: "24.Jan.2021",
  },
];

function ChainManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [chainData, setChainData] = useState();

  useEffect(() => {
    getChain();
  }, []);

  const getChain = () => {
    getApiReq("/chains").then((res) => {
      setChainData(res.data);
    });
  };

  const handleSearch = (e) => {
    const searchQuery = e.target.value.trim();
    getApiReq(`/chains?name=${searchQuery}`).then((res) => {
      setChainData(res.data);
    });
  };

  return (
    <div className="mt-5">
      <div className="flex justify-end">
        <AddChainModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          getChain={getChain}
        />
        <div className="mx-3 flex h-12 items-center rounded-full bg-white text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
          <p className="pl-3 pr-2 text-xl">
            <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
          </p>
          <input
            type="text"
            onChange={(e) => handleSearch(e)}
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
          Add Chain
        </button>
      </div>
      <div className="my-5">
        <ChainManagementTable
          columnsData={columnsDataDevelopment}
          tableData={chainData}
          getChain={getChain}
        />
      </div>
    </div>
  );
}

export default ChainManagement;
