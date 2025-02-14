import PieChartCard from "views/admin/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";
import { columnsDataCheck } from "./variables/columnsData";
import Widget from "components/widget/Widget";
import CheckTable from "views/admin/default/components/CheckTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import tableDataCheck from "./variables/tableDataCheck.json";
import { useEffect, useState } from "react";
import { getApiReq } from "utils/ApiHandlers";
import TaskCard from "./components/TaskCard";

const Dashboard = () => {
  const [adminData, setAdminData] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await getApiReq("/admin/dashboard");
      if (response.status) {
        setAdminData(response.data);
      } else {
        console.error("Error fetching dashboard data:", response.error);
      }
    } catch (error) {
      console.error("API request failed:", error);
    }
  };

  return (
    <div>
      {/* Card widget 
      {
    "totalUser": 13,
    "totalActiveUser": 11,
    "totalVerifiedUser": 6,
    "platformBalance": 12.30660412484,
    "AdminBalance": 0,
    "TotalTransaction": 0,
    "TransactionAmount": 0
}

{
            "txhash": "7B85552DCC66D0F5250FA277B6F100A7E1FF0BC5E3E2F9253640EED6E9A8075F",
            "source_address": "r3rgMcRutkQZah3V3YBKx1X4gzRCUDkovw",
            "destination_address": "rLpy4KnVakAuY7YxrXAvtzY244wvp7FCQy",
            "amount": 15,
            "created_at": "2024-06-29T12:00:01.602Z",
            "chain_name": "XRP",
            "firstname": "Sachin",
            "lastname": "Patidar",
            "id": "c3146bc5-5ac9-4bcb-84be-6635f06f8a41",
            "email": "sachin@mailinator.com",
            "transaction_type": "Cr",
            "fireblock_created_at": "1719645197616",
            "name": "XRP",
            "icon": "6b7fa3f8c8bd2c92effc24b0c54368f4.jpeg",
            "address": "rLpy4KnVakAuY7YxrXAvtzY244wvp7FCQy",
            "tokenImage": "https://api.payfirewallcrypto.com/storage/6b7fa3f8c8bd2c92effc24b0c54368f4.jpeg"
        },
      */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Total Users"}
          subtitle={adminData.totalUser}
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"Total Active User"}
          subtitle={adminData.totalActiveUser}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Total Verified User"}
          subtitle={adminData.totalVerifiedUser}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Platform Balance"}
          subtitle={(adminData.platformBalance || 0).toFixed(2)}
        />
        {/* <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Admin Balance"}
          subtitle={adminData.AdminBalance}
        />
        <Widget
          icon={<IoMdHome className="h-6 w-6" />}
          title={"Total Transaction"}
          subtitle={(adminData.TotalTransaction || 0).toFixed(2)}
        />
        <Widget
          icon={<IoMdHome className="h-6 w-6" />}
          title={"Transaction Amount"}
          subtitle={(adminData.TransactionAmount || 0).toFixed(2)}
        /> */}
      </div>
      {/* Charts */}

      <div className="md:grid-col mt-5 grid grid-cols-1 gap-5">
        {/* <TotalSpent />
        <WeeklyRevenue /> */}
        <CheckTable columnsData={columnsDataCheck} />
      </div>

      {/* Tables & Charts */}
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Check Table */}
        {/* <div>
          <CheckTable
            columnsData={columnsDataCheck}
            tableData={tableDataCheck}
          />
        </div> */}

        {/* Traffic chart & Pie Chart */}

        <div className="md:grid-cols grid grid-cols-1 gap-5 rounded-[20px]">
          {/* <DailyTraffic /> */}
          <PieChartCard />
        </div>

        {/* Complex Table , Task & Calendar */}

        {/* <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        /> */}

        {/* Task chart & Calendar */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] ">
          <TaskCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
