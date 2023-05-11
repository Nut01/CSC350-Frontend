import React from "react";
import AdHome from "../components/admin/AdHome";
import UserHome from "../components/user/UserHome";

export default function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  return <>{user?.role === 2 ? <AdHome /> : <UserHome />}</>;
}
