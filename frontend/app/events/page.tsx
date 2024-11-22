import React from "react";
import Calendar from "@/components/calendar";

export default async function Events() {
  return (
      <div className="rounded-md border border-gray-200 w-11/12 h-10/12 py-4 shadow">
        <Calendar />
      </div>
  );
}
