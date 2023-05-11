import React from "react";
import { Route, Routes } from "react-router-dom";
import Appbar from "./components/Appbar";
import Home from "./pages/Home";
import LogReg from "./pages/LogReg";
import Receipt from "./pages/user/Receipt";
import History from "./pages/user/History";
import ApproveMember from "./pages/admin/AprMember";
import ApproveOrder from "./pages/admin/AprOrder";

export default function App() {
  return (
    <>
      <Appbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logreg" element={<LogReg />} />
        <Route path="/receipt" element={<Receipt />} />
        <Route path="/history" element={<History />} />
        <Route path="/aprmember" element={<ApproveMember />} />
        <Route path="/aprorder" element={<ApproveOrder />} />
      </Routes>
    </>
  );
}
