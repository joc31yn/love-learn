"use client";

import { useEffect } from "react";
import { createBrowserClient } from '@supabase/ssr'

export default function TodosListener() {
  useEffect(() => {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );
    console.log(supabase);
    // Define an async function inside useEffect
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error (most likely user does not exist)", error.message);
      } else {
        console.log("User data:", data);
      }
    };

    // Call the async function
    fetchUser();
  }, []);

  // Render nothing (or optional status message) as the component doesn't display content
  return null;
}
