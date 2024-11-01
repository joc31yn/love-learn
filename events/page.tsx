import React from "react";
import Calendar from "./cal_components/calendar";
export default async function Home() {
  return (
    <div className="rounded-md border border-gray-200 px-4 py-2 shadow">
      <Calendar />
    </div>
  );
}
