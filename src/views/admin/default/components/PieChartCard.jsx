import React, { useEffect, useRef, useState } from "react";
// import { pieChartData, pieChartOptions } from "variables/charts";
import Card from "components/card";

import { getApiReq } from "utils/ApiHandlers";
import Chart from "chart.js/auto";

const themeColors = ["#6AD2Fa", "#4318FF", "#1b3bbb"];
const generateShades = (color, shadesCount) => {
  const shades = [];
  for (let i = 0; i < shadesCount; i++) {
    const shade = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
      color.slice(3, 5),
      16
    )}, ${parseInt(color.slice(5, 7), 16)}, ${1 - i * 0.1})`;
    shades.push(shade);
  }
  return shades;
};
const PieChartCard = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [totalAmount, setTotalAmount] = useState();
  const [tokenValues, setTokenValues] = useState([
    {
      token_name: "USDT",
      token_id: 6,
      percentage: 9.393747337445589,
      calculated_amount: 1.3830769090400001,
    },
    {
      token_name: "MATIC",
      token_id: 10,
      percentage: 0.09713042893353925,
      calculated_amount: 0.014300879999999998,
    },
    {
      token_name: "SOL",
      token_id: 13,
      percentage: 32.256864342198384,
      calculated_amount: 4.7493,
    },
    {
      token_name: "XRP",
      token_id: 14,
      percentage: 58.25225789142249,
      calculated_amount: 8.576699999999999,
    },
  ]);

  useEffect(() => {
    pieChartData();
  }, []);
  const pieChartData = async () => {
    const responce = await getApiReq("/admin/user-piechart");

    if (responce.status) {
      // setTokenValues(responce?.data?.tokenValues);
      setTotalAmount(responce?.data?.totalCalculatedAmount);
    }
  };
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (tokenValues?.length > 0) {
      const myChartRef = chartRef.current.getContext("2d");
      const colors = themeColors
        .slice(0, tokenValues.length)
        .flatMap((color) =>
          generateShades(color, tokenValues.length / themeColors.length)
        );
      chartInstance.current = new Chart(myChartRef, {
        type: "pie",
        data: {
          labels: tokenValues.map((token) => token.token_name),
          datasets: [
            {
              data: tokenValues.map((token) => token.percentage),
              backgroundColor: colors,

              borderColor: colors.map((color) =>
                color.replace(/, \d+\.\d+\)$/, ", 1)")
              ),
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: "bottom", // Position the legend on the right side
              labels: {
                usePointStyle: true,
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [tokenValues]);
  return (
    <Card extra="rounded-[20px] p-3">
      <div className="flex flex-row justify-between px-3 pt-2">
        <div>
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
            Your Pie Chart
          </h4>
        </div>

        {/* <div className="mb-6 flex items-center justify-center">
          <select className="mb-3 mr-2 flex items-center justify-center text-sm font-bold text-gray-600 hover:cursor-pointer dark:!bg-navy-800 dark:text-white">
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div> */}
      </div>

      <div className="mb-auto flex h-[300px] items-center justify-center">
        {tokenValues?.length > 0 ? (
          <canvas
            ref={chartRef}
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        ) : (
          <p style={{ textAlign: "center", color: "#666" }}>
            No data available
          </p>
        )}
      </div>
      <div className="flex justify-center rounded-2xl px-3 py-3 shadow-2xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-brand-500" />
            <p className="ml-1 text-sm font-normal text-gray-600">
              Total Calculated Amount
            </p>
          </div>
          <p className="mt-px text-xl font-bold text-navy-700  dark:text-white">
            {(totalAmount || 0).toFixed(4)}
          </p>
        </div>
        {/* 
        <div className="h-11 w-px bg-gray-300 dark:bg-white/10" />

        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-[#6AD2FF]" />
            <p className="ml-1 text-sm font-normal text-gray-600">System</p>
          </div>
          <p className="mt-px text-xl font-bold text-navy-700 dark:text-white">
            25%
          </p>
        </div> */}
      </div>
    </Card>
  );
};

export default PieChartCard;
