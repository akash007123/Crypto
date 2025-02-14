import React from "react";
import MainDashboard from "views/admin/default";
import Profile from "views/admin/profile";
import Users from "views/admin/users";
import SignIn from "views/auth/SignIn";
import {
  MdHome,
  MdPerson,
  MdLock,
  MdGeneratingTokens,
  MdPolymer,
} from "react-icons/md";
import { GiChaingun } from "react-icons/gi";
import { AiOutlineTransaction } from "react-icons/ai";
import UserProfile from "views/admin/users/components/userProfile";
import ChainManagement from "views/admin/ChainManagement";
import TokenManagement from "views/admin/TokenManagement";
import CoinPairManagement from "views/admin/CoinPairManagement";
import UserList from "views/admin/users/components/UserList";
import Transection from "views/admin/Transection";
// "Main Dashboard",
const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },

  {
    name: "Users",
    layout: "/admin",
    path: "user-list",
    icon: <MdPerson className="h-6 w-6" />,
    component: <UserList />,
    secondary: true,
  },

  {
    name: "Kyc Verification",
    layout: "/admin",
    path: "users",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Users />,
    secondary: false,
  },
  {
    name: "Transaction",
    layout: "/admin",
    path: "transaction",
    icon: <AiOutlineTransaction className="h-6 w-6" />,
    component: <Transection />,
    secondary: true,
  },
  {
    name: "Chain Management",
    layout: "/admin",
    path: "chain-management",
    icon: <GiChaingun className="h-6 w-6" />,
    component: <ChainManagement />,
    secondary: false,
  },
  {
    name: "Token Manangement",
    layout: "/admin",
    path: "token-management",
    icon: <MdGeneratingTokens className="h-6 w-6" />,
    component: <TokenManagement />,
    secondary: false,
  },
  {
    name: "Coin Pair Manangement",
    layout: "/admin",
    path: "coin-pair-management",
    icon: <MdPolymer className="h-6 w-6" />,
    component: <CoinPairManagement />,
    secondary: false,
  },
  {
    layout: "/admin",
    path: "users/:id",
    innerRoute: true,
    component: <UserProfile />,
  },

  // {
  //   name: "Data Tables",
  //   layout: "/admin",
  //   icon: <MdBarChart className="h-6 w-6" />,
  //   path: "data-tables",
  //   component: <DataTables />,
  // },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
  // {
  //   name: "RTL Admin",
  //   layout: "/rtl",
  //   path: "rtl",
  //   icon: <MdHome className="h-6 w-6" />,
  //   component: <RTLDefault />,
  // },
];
export default routes;
