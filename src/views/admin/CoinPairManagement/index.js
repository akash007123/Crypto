import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

import { getApiReq } from "utils/ApiHandlers";
import CoinPairmanagementTable from "./components/CoinPairmanagementTable";
import AddCoinPairModal from "./components/AddCoinPairModal";
export const columnsDataDevelopment = [
  {
    Header: "S.No",
    accessor: "sno",
  },
  {
    Header: "Exchange",
    accessor: "exchangeName",
  },
  {
    Header: "First Coin",
    accessor: "firstCoin",
  },
  {
    Header: "Second Coin",
    accessor: "secondCoin",
  },
  {
    Header: "Symbol",
    accessor: "symbol",
  },
  {
    Header: "Mapping Symbol",
    accessor: "mappingSymbol",
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

function CoinPairManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [tokenData, setTokenData] = useState([]);
  const [exchangeCoins, setExchangeCoins] = useState([]);
  const [tokenPairs, setTokenPairs] = useState([]);
  // const [search, setSearch] = useState();
  useEffect(() => {
    getAllExchangeCoin();
    getTokenList();
    getTokenPairList();
  }, []);

  const getTokenList = () => {
    getApiReq("/tokens").then((res) => {
      setTokenData(res.data);
    });
  };

  const getTokenPairList = () => {
    getApiReq("/swap-pairs").then((res) => {
      setTokenPairs(res.data);
    });
  };

  const getAllExchangeCoin = () => {
    getApiReq("/coin-api/exchange-coin-stored-list")
      .then((res) => {
        setExchangeCoins(res.data);
      })
      .catch((e) => console.log(e));
  };

  const handleSearch = (e) => {
    const serach = e.target.value;
    getApiReq(`/swap-pairs?search=${serach}`).then((res) => {
      setTokenPairs(res.data);
    });
  };
  return (
    <div className="mt-5">
      <AddCoinPairModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        exchangeCoins={exchangeCoins}
        tokenData={tokenData}
        getTokenPairList={getTokenPairList}
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
          Add Coin Pair
        </button>
      </div>
      <div className="my-5">
        <CoinPairmanagementTable
          columnsData={columnsDataDevelopment}
          tableData={tokenPairs}
          getTokenList={getTokenList}
        />
      </div>
    </div>
  );
}

export default CoinPairManagement;
