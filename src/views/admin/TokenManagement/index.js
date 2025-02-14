import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import TokenManagementTable from "./components/TokenManagementTable";
import AddTokenModal from "./components/AddTokenModal";
import { getApiReq } from "utils/ApiHandlers";
export const columnsDataDevelopment = [
  {
    Header: "S.No",
    accessor: "sno",
  },
  {
    Header: "Token Name",
    accessor: "tokenname",
  },
  {
    Header: "Created Date",
    accessor: "date",
  },
  // {
  //   Header: "Status",
  //   accessor: "status",
  // },
  {
    Header: "Action",
    accessor: "action",
  },
];

export const tableDataColumns = [
  {
    sno: 1,
    tokenname: "BitCoin",
    status: "Approved",
    action: "disable",
    date: "24.Jan.2021",
  },
];

function TokenManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [tokenData, setTokenData] = useState();

  useEffect(() => {
    getTokenList();
  }, []);

  const getTokenList = () => {
    getApiReq("/tokens").then((res) => {
      setTokenData(res.data);
    });
  };

  const handleSearch = (e) => {
    const searchQuery = e.target.value.trim();
    getApiReq(`/tokens?name=${searchQuery}`).then((res) => {
      setTokenData(res.data);
    });
  };

  return (
    <div className="mt-5">
      <AddTokenModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        getTokenList={getTokenList}
      />
      <div className="flex justify-end">
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
          onClick={() => setIsOpen(true)}
          className="text-black linear rounded-xl bg-white px-4 py-2 text-center text-base font-medium transition duration-200 hover:!bg-white/80 active:!bg-white/70"
        >
          Add Token
        </button>
      </div>
      <div className="my-5">
        <TokenManagementTable
          columnsData={columnsDataDevelopment}
          tableData={tokenData}
          getTokenList={getTokenList}
        />
      </div>
    </div>
  );
}

export default TokenManagement;
