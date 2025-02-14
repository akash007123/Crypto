import Card from "components/card";

import { useState } from "react";
import { reactIcons } from "utils/icons";
import moment from "moment";
import DeleteTokenModal from "./DeleteCoinPairModal";
const CoinPairmanagementTable = (props) => {
  const { tableData, getTokenList } = props;
  const [openOption, setOpenOption] = useState(null);
  const [setOpenEditTokenModal] = useState(false);
  const [tokenData, setTokenData] = useState();
  const [openTokenDeleteModal, setOpenTokenDeleteModal] = useState(false);
  const [viewToken, setViewToken] = useState(null);
  return (
    <Card extra={"w-full h-full p-4"}>
      <div className="mt-8 h-full overflow-x-scroll font-mono xl:overflow-hidden">
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
              <th>First Coin</th>
              <th>Second Coin</th>
              <th>Symbol</th>
              <th>Mapping Symbol</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData?.data?.map((item, index) => {
              return (
                <tr key={index} className="h-10">
                  <td>{index + 1}</td>
                  <td>{item?.currencyOne?.name}</td>
                  <td>{item?.currencyTwo?.name}</td>
                  <td>{item.symbol}</td>
                  <td>{item.symbolRef}</td>

                  {/* <td>Enable</td> */}
                  <td>
                    <div className="">
                      <span
                        className=" cursor-pointer"
                        onClick={() => {
                          setOpenOption(item.id);
                        }}
                      >
                        {reactIcons.dots}
                      </span>
                      {openOption === item.id && (
                        <div
                          className="h-15 absolute right-10  z-50 w-20 rounded-lg border-[1px] bg-white"
                          onMouseLeave={() => setOpenOption(null)}
                        >
                          <div className="text-black p-2 text-left">
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

export default CoinPairmanagementTable;
