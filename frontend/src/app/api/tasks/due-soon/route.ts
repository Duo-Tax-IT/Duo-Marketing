import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    
    if (!token?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Calculate today and 7 days from now in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const sevenDaysDate = sevenDaysFromNow.toISOString().split('T')[0];

    const query = `
      SELECT Id, Name, Type__c 
      FROM Marketing_Task__c 
      WHERE Stage__c != 'Completed' 
      AND Stage__c != 'Cancelled' 
      AND Deadline__c <= ${sevenDaysDate} 
      AND Deadline__c >= ${today}
    `;

    console.log('Debug - Query:', query);
    console.log('Debug - Backend URL:', process.env.BACKEND_URL);

    const response = await fetch(`${process.env.BACKEND_URL}/api/salesforce/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.accessToken}`
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    return NextResponse.json(await response.json());

  } catch (error) {
    console.error('Error fetching due tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch due tasks' },
      { status: 500 }
    );
  }
} 