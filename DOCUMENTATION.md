# Duo Marketing Documentation

## Project Overview
A web app for managing marketing tasks and projects, built with Next.js and Tailwind CSS.

## Project Setup
- **Next.js Setup:**
  - Created with `create-next-app` using TypeScript, Tailwind CSS, and App Router
  - Using src directory structure (`/src/app` and `/src/components`)
  - Import alias configured as `@/*` for clean imports
  - Currently displays basic "Duo Marketing" homepage

- **Backend Setup:**
  - Node.js Express server with TypeScript
  - Runs on port 3001 (configured in .env)
  - Environment variables stored in .env file (not committed to Git)
  - API proxy for Salesforce integration

## Backend API Endpoints
- **Health Check:**
  - `GET /api/health`
  - Returns server status

- **Salesforce Query Proxy:**
  - `POST /api/salesforce/query`
  - Requires JSON body with `query` parameter
  - Proxies requests to Salesforce Middleman API with proper authentication

## API Integration
- **Salesforce/Middleman API:**  
  Details on authentication, endpoints, and data models.

  Salesforce API details:
Salesforce Query API - Simple Guide
Endpoint
POST /api/Salesforce/query
Authentication
Include API key in request header:

X-API-KEY: your_api_key
Request Format
Send a JSON object with a query property:

{
  "query": "SELECT Id, Name FROM Account LIMIT 10"
}
Example Request
// JavaScript/Fetch example
fetch("https://api-middle-man.duo.tax/api/Salesforce/query", {
  method: "POST",
  headers: {
    "X-API-KEY": "your_api_key",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: "SELECT Id, Name FROM Account LIMIT 10",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
Response Format
The API returns an array of objects matching your query:

{
  "totalSize": 10,
  "done": true,
  "records": [
    {
      "id": "001xx000003DGb2AAG",
      "name": "Acme Corp"
    }
  ]
}
Common Queries
Get Accounts:

SELECT Id, Name FROM Account LIMIT 10
Get Contacts:

SELECT Id, FirstName, LastName, Email FROM Contact LIMIT 10
Get Accounts with filter:

SELECT Id, Name FROM Account WHERE Industry = 'Technology' LIMIT 10
Rate Limiting
This API implements rate limiting to ensure fair usage:

Limit: 100 requests per minute per API key
When exceeded: Returns 429 Too Many Requests with a JSON response: json { "message": "Rate limit exceeded. Please try again later.", "retryAfter": 60 }
IMPORTANT: Always implement manual retry let user click to not exceed the api call limit, never loop the api call

## SSO with Microsoft
- Endpoints and flow details for authentication.

## UI Components
- Navbar, Sidebar, etc. (Detailed responsibilities and props)

## New Features (Add deatils about new features here)