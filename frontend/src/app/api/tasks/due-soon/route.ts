import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    
    if (!token?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(req.url);
    const viewMyTasksOnly = url.searchParams.get('viewMyTasksOnly') === 'true';
    const userEmail = url.searchParams.get('userEmail');

    // Calculate today and 7 days from now in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const sevenDaysDate = sevenDaysFromNow.toISOString().split('T')[0];

    let whereClause = `
      Stage__c != 'Completed' 
      AND Stage__c != 'Cancelled' 
      AND Deadline__c <= ${sevenDaysDate} 
      AND Deadline__c >= ${today}
    `;

    // Add user filter if requested
    if (viewMyTasksOnly && userEmail) {
      whereClause += ` AND Delegate__r.Email = '${userEmail}'`;
    }

    const query = `
      SELECT 
        Id, 
        Name, 
        Type__c, 
        Description__c,
        Priority__c,
        Project__c,
        Completed_Date__c,
        Log_Note_Long__c,
        Log__c,
        Delegate__r.Name, 
        Delegate__r.Email,
        Deadline__c, 
        Assigned_By__r.Name 
      FROM Marketing_Task__c 
      WHERE ${whereClause}
      ORDER BY Deadline__c ASC
    `;

    console.log('Debug - Query:', query);
    console.log('Debug - Backend URL:', process.env.BACKEND_URL);
    console.log('Debug - View My Tasks Only:', viewMyTasksOnly);
    console.log('Debug - User Email:', userEmail);

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