import React from "react";
import { IoIosCloseCircle, IoMdClose } from "react-icons/io";
import {
  FaArrowAltCircleLeft,
  FaGift,
  FaRegCopy,
  FaUser,
} from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import {
  BiLogOutCircle,
  BiDollarCircle,
  BiChevronLeft,
  BiChevronRight,
  BiChevronDown,
  BiChevronUp,
} from "react-icons/bi";
import { VscTriangleDown } from "react-icons/vsc";
import {
  AiOutlineUnorderedList,
  AiFillSetting,
  AiOutlineStar,
  AiFillStar,
} from "react-icons/ai";
import {
  MdDashboard,
  MdDelete,
  MdEdit,
  MdOutlineManageAccounts,
} from "react-icons/md";
import { TbCameraPlus } from "react-icons/tb";
import { HiDotsVertical } from "react-icons/hi";
import { BsChevronDown } from "react-icons/bs";

export const reactIcons = {
  dots: <HiDotsVertical />,
  user: <FaUser />,
  camera: <TbCameraPlus />,
  arrowcirclefilled: <FaArrowAltCircleLeft />,
  circleclose: <IoIosCloseCircle />,
  logout: <BiLogOutCircle />,
  dollar: <BiDollarCircle />,
  list: <AiOutlineUnorderedList />,
  arrowleft: <BiChevronLeft />,
  arrowright: <BiChevronRight />,
  arrowDown: <BiChevronDown />,
  arrowUp: <BiChevronUp />,
  dashboard: <MdDashboard />,
  setting: <AiFillSetting />,
  edit: <MdEdit />,
  delete: <MdDelete />,
  manage: <MdOutlineManageAccounts />,
  gift: <FaGift />,
  star: <AiOutlineStar />,
  fillstar: <AiFillStar />,
  eyeVisible: <AiFillEye />,
  arrowdown: <BsChevronDown />,
  eyeInVisible: <AiFillEyeInvisible />,
  close: <IoMdClose />,
  triangleDown: <VscTriangleDown />,
  copy: <FaRegCopy />,
};
