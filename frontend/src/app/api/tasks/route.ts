import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      console.error('No access token found in session');
      return NextResponse.json({ error: 'Unauthorized - No access token' }, { status: 401 });
    }

    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      console.error('BACKEND_URL environment variable is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    console.log('Making request to backend with token:', session.accessToken.slice(0, 10) + '...');
    
    const response = await fetch(`${backendUrl}/api/salesforce/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        query: "SELECT Id, Name, Type__c FROM Marketing_Task__c WHERE Stage__c != 'Completed' AND Stage__c != 'Cancelled'"
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API error:', {
        status: response.status,
        statusText: response.statusText,
        errorText,
      });
      throw new Error(`Backend error: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error in tasks API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 