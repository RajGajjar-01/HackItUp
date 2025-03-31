// components/Layout.jsx
import React from "react";
import Sidebar from "@/components/Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 lg:ml-20">
        {children}
      </main>
    </div>
  );
}