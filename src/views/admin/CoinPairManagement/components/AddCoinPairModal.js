import { Dialog, DialogContent } from "@mui/material";
import ToastMsg from "components/toast/ToastMsg";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { postApiReq } from "utils/ApiHandlers";
import { reactIcons } from "utils/icons";

const initialState = {
  exchangeId: "",
  firstCoin: "",
  secondCoin: "",
  symbolRef: "",
  symbol: "",
  type: "Multi",
  status: "Active",
};

function AddCoinPairModal({
  isOpen,
  setIsOpen,
  exchangeCoins,
  tokenData,
  getTokenPairList,
}) {
  const [form, setForm] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [secondCoins, setSecondCoins] = useState([]);
  const [firstSelectedTicker, setFirstSelectedTicker] = useState(false);
  const [secondSelectedTicker, setSecondSelectedTicker] = useState(false);

  useEffect(() => {
    if (exchangeCoins && exchangeCoins.length > 0) {
      setForm((prevForm) => ({
        ...prevForm,
        exchangeId: exchangeCoins[0].exchangeId,
        status: "Active",
      }));
    }
  }, [tokenData, form]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "firstCoin") {
      const selectedIndex = e.target.selectedIndex;
      const selectedOption = e.target.options[selectedIndex];
      const firstSelectedCoin = selectedOption.text;
      findAvailableSecondCoins(exchangeCoins, firstSelectedCoin);
      setFirstSelectedTicker(firstSelectedCoin);
    }
    if (e.target.name === "secondCoin") {
      const selectedIndex = e.target.selectedIndex;
      const selectedOption = e.target.options[selectedIndex];
      const secondSelectedCoin = selectedOption.text;
      setSecondSelectedTicker(secondSelectedCoin);
    }
  };

  function findAvailableSecondCoins(exchangeCoins, selectedFirstCoin) {
    const availableSecondCoins = [];

    exchangeCoins.forEach((obj) => {
      if (
        obj.firstCoin === selectedFirstCoin &&
        obj.hasOwnProperty("secondCoin")
      ) {
        availableSecondCoins.push(obj.secondCoin);
      }
    });

    const eligibleSecondCoin = tokenData.filter((token) => {
      let value = false;
      availableSecondCoins.forEach((tiker) => {
        if (token.tiker === tiker) {
          value = true;
        }
      });
      return value;
    });

    // Sort the array alphabetically
    setSecondCoins(eligibleSecondCoin);
  }

  useEffect(() => {
    function findSymbol() {
      const _obj = exchangeCoins.filter((obj) => {
        if (
          obj.firstCoin === firstSelectedTicker &&
          obj.secondCoin === secondSelectedTicker
        )
          return obj;
        else {
          return false;
        }
      });
      if (_obj.length > 1) {
        alert("Multiple Pair available, Preferring the First");
        setForm((prevForm) => ({
          ...prevForm,
          symbolRef: _obj[0].coinSymbol,
        }));
        setForm((prevForm) => ({
          ...prevForm,
          symbol: `${firstSelectedTicker}${secondSelectedTicker}`,
        }));
      } else if (_obj.length === 0) {
        alert("Invalid Pair");
      } else {
        setForm((prevForm) => ({
          ...prevForm,
          symbolRef: _obj[0].coinSymbol,
        }));
        setForm((prevForm) => ({
          ...prevForm,
          symbol: `${firstSelectedTicker}${secondSelectedTicker}`,
        }));
      }
    }
    if (firstSelectedTicker && secondSelectedTicker) {
      findSymbol();
    }
  }, [firstSelectedTicker, secondSelectedTicker, exchangeCoins]);

  const handleAddToken = () => {
    setIsLoading(true);

    postApiReq("/swap-pairs", {
      currencyOneId: form.firstCoin,
      currencyTwoId: form.secondCoin,
      ...form,
    }).then((res) => {
      setIsLoading(false);
      if (res.status) {
        toast.success(<ToastMsg title={"Token pair added successfully"} />);
        setForm(initialState);
        setIsOpen(false);
        getTokenPairList();
      } else if (res.error.statusCode === 500) {
        toast.error(<ToastMsg title={res.error.message} />);
      } else {
        toast.error(<ToastMsg title={res.error.message} />);
      }
    });
  };

  return (
    <Dialog open={isOpen} aria-labelledby="responsive-dialog-title">
      <div className="w-[500px] rounded-md bg-white ">
        <div className="flex justify-between rounded-full">
          <div className="my-2 flex flex-1 justify-center">
            <h1 className="text-[20px] font-[700]">Add Coin Pair</h1>
          </div>
          <span
            className="text-black cursor-pointer text-[24px]"
            onClick={() => setIsOpen(false)}
          >
            {reactIcons.close}
          </span>
        </div>
        <DialogContent>
          <div>
            <div>
              <div className="flex-2 mr-1">
                <label>Exchange</label>
                <input
                  onChange={handleChange}
                  name="name"
                  type="text"
                  value={form.exchangeId}
                  placeholder="Exchange"
                  className="bg-whtie  border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
                />
              </div>
              <div className="mt-3 flex flex-wrap">
                <div className="mr-1 flex-1">
                  <label>First Coin</label>
                  <select
                    name="firstCoin"
                    onChange={handleChange}
                    value={form.firstCoin}
                    className="bg-whtie  border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
                  >
                    <option value="">Choose First Coin</option>
                    {tokenData &&
                      tokenData.map((value, index) => {
                        return (
                          <option key={index} value={value.id}>
                            {value.name}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="mx-1 flex-1">
                  <label>Second Coin</label>
                  <select
                    name="secondCoin"
                    onChange={handleChange}
                    value={form.secondCoin}
                    className="bg-whtie  border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
                  >
                    <option value="">Choose Second Coin</option>
                    {secondCoins.map((value) => {
                      return <option value={value.id}>{value.name}</option>;
                    })}
                  </select>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap">
                <div className="mx-1 flex-1">
                  <label>Display Pair</label>
                  <input
                    onChange={handleChange}
                    name="symbol"
                    type="text"
                    value={form.symbol}
                    placeholder=""
                    readOnly
                    className="bg-whtie  border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
                  />
                </div>
                <div className="mx-1 flex-1">
                  <label>Exchange Symbol</label>
                  <input
                    onChange={handleChange}
                    name="symbolRef"
                    type="text"
                    value={form.symbolRef}
                    placeholder="Exchange"
                    className="bg-whtie  border-black h-[40px] w-full rounded-md border-[1px] px-2 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="my-2 flex justify-end">
            <button
              onClick={handleAddToken}
              disabled={isLoading}
              className={`w-28 rounded-md border-[1px] ${
                isLoading ? "bg-gray-400" : "bg-blueSecondary text-white"
              } py-1 px-3 text-white`}
            >
              Add
            </button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default AddCoinPairModal;
