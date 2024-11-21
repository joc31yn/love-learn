import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const { type: requestType, detail: requestDetail } = await req.json();

    console.log(requestType);

    // Initialize Supabase client using the server configuration
    const supabase = await createClient();

    // Get the current session
    const { data, error } = await supabase.auth.getSession();
    
    const accessToken = data.session?.access_token;
    const refreshToken = data.session?.refresh_token;

    var backendUrl = "";
    // Make the request to the backend API
    if (requestType === "devpost") {
      backendUrl = `https://backend.everythingcalendar.org/scrape_events?type=${requestType}&jwt=${accessToken}&refresh=${refreshToken}`;
    }
    else {
      backendUrl = `https://backend.everythingcalendar.org/scrape_events?type=${requestType}&username=${requestDetail}type=devpost&jwt=${accessToken}&refresh=${refreshToken}`;
    }
    console.log(backendUrl);
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await backendResponse.json();
    console.log(response);
    if (backendResponse.status === 200) {
      console.log('Backend Response:', response);
      return NextResponse.json({ message: 'completed' });
    } 
    else {
      console.error('Error from backend:', response);
      return NextResponse.json({ message: 'error occurred' }, { status: backendResponse.status });
    }
  } 
  catch (error) {
    console.error('Error in /api/sync:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
