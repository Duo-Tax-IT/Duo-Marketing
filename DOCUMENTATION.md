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

## Authentication
- **Microsoft SSO Integration:**
  - Uses NextAuth.js with Azure AD provider
  - Includes login page with Microsoft sign-in button
  - Protected routes with session checking
  - Authentication state maintained across the application
  - Configuration in .env.local file:
    ```
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=[secret key]
    AZURE_AD_CLIENT_ID=[Azure app client ID]
    AZURE_AD_CLIENT_SECRET=[Azure app client secret]
    AZURE_AD_TENANT_ID=[Azure tenant ID]
    ```
  - Implemented components:
    - `AuthProvider`: Wraps app with NextAuth session provider
    - `SessionCheck`: Protects routes requiring authentication
    - `QueryProvider`: Provides React Query caching capabilities
    - API route for NextAuth at `/api/auth/[...nextauth]`
    - Login page at `/login` with Microsoft sign-in button

## Data Fetching and Caching
- **React Query Implementation:**
  - Global configuration in `QueryProvider`:
    - `staleTime: Infinity` - Data never becomes stale automatically
    - `gcTime: 30 minutes` - Cache is kept for 30 minutes
    - `refetchOnWindowFocus: false` - Prevents unnecessary refetches
  - Query keys include session token for proper cache invalidation
  - Optimized for performance with minimal API calls

## Frontend Routes and Features
- **Projects Page (`/projects`):**
  - Displays active projects from Salesforce
  - Query: `SELECT Id, Name FROM Marketing_Project__c WHERE Open_Tasks__c > 0`
  - Cached data with React Query
  - Simple card layout with project name and menu

- **Tasks Page (`/tasks`):**
  - Shows non-completed and non-cancelled tasks
  - Query: `SELECT Id, Name FROM Marketing_Task__c WHERE Stage__c != 'Completed' AND Stage__c != 'Cancelled'`
  - Cached data with React Query
  - Card layout matching projects page

- **Website Content Page (`/content`):**
  - Lists content items not yet uploaded
  - Query: `SELECT Id, Name FROM Marketing_Content__c WHERE Status__c != 'Uploaded'`
  - Cached data with React Query
  - Consistent card layout with other pages

## Backend API Endpoints
- **Health Check:**
  - `GET /api/health`
  - Returns server status

- **Projects API:**
  - `GET /api/projects`
  - Requires authentication token
  - Returns active projects with open tasks

- **Tasks API:**
  - `GET /api/tasks`
  - Requires authentication token
  - Returns non-completed and non-cancelled tasks

- **Content API:**
  - `GET /api/content`
  - Requires authentication token
  - Returns content items not yet uploaded

- **Salesforce Query Proxy:**
  - `POST /api/salesforce/query`
  - Requires JSON body with `query` parameter
  - Proxies requests to Salesforce Middleman API with proper authentication

- **Tasks Due Soon API:**
  - `GET /api/tasks/due-soon`
  - Requires authentication token
  - Query params: 
    - `start`: YYYY-MM-DD (today's date)
    - `end`: YYYY-MM-DD (7 days from today)
  - Returns tasks due within the next 7 days, grouped by type
  - Used by the DonutChart component for analytics

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
- **Layout Components:**
  - `Navbar`: Top navigation bar
  - `Sidebar`: Navigation menu with links to all pages
  - `SessionCheck`: Authentication wrapper component
  - `Card`: Reusable card component for displaying items
  - All components use Tailwind CSS for styling

- **Analytics Components:**
  - `DonutChart`: Interactive component showing tasks due in 7 days
    - Features:
      - Displays tasks categorized by type in a donut chart
      - Shows total task count in the center
      - Custom legend with task type counts
      - 3D flip animation to detailed table view
      - Rotate button in top-right corner for view toggle
    - Props:
      - `title`: string - Chart title
      - `data`: Array<{ name: string, value: number }> - Task type counts
      - `totalCount`: number - Total number of tasks

## Performance Optimizations
- React Query for efficient data fetching and caching
- Session token included in query keys for proper cache invalidation
- Optimized re-renders with proper React hooks usage
- Early returns for loading states to prevent unnecessary renders

## New Features (Add deatils about new features here)