import { createClient } from '@/utils/supabase/server';
import React from "react";
import Calendar from "@/components/calendar";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";

export default async function addEventPage() {
  return (
    <div className="rounded-md border border-gray-200 w-11/12 h-10/12 py-4 shadow">
        <Label>Title:</Label>
        <Input type = "text" placeholder="Event title"></Input>
        <br></br>

        <Label>Start Date:</Label>
        <Input type = "text" placeholder="Month, Day, Year, 00:00 (24h clock)"></Input>
        <br></br>

        <Label>End Date:</Label>
        <Input type = "text" placeholder="Month, Day, Year, 00:00 (24h clock)"></Input>
        <br></br>

        <Label>Location:</Label>
        <Input type = "text" placeholder="Event location"></Input>
        <br></br>

        <Label>Description:</Label>
        <Input type = "text" placeholder="Event description"></Input>
        <br></br>

        <Button>Add Event</Button>
    </div>
  );
  return 
}

