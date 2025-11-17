import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="pt-4 pb-12 px-4">
        <Outlet />
      </main>
    </div>
  );
}
