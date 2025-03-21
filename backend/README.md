# Duo Marketing Backend

Backend server for the Duo Marketing application that provides an API proxy to the Salesforce Middleman API.

## Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=3001
SALESFORCE_API_KEY=your_api_key_here
```

3. Start the development server:
```
npm run dev
```

## Available Scripts

- `npm run dev`: Start the development server with hot reload
- `npm run build`: Build the TypeScript code for production
- `npm start`: Run the production build

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status information.

### Salesforce Query
```
POST /api/salesforce/query
```
Body:
```json
{
  "query": "SELECT Id, Name FROM Account LIMIT 10"
}
```
Proxies the query to the Salesforce API with proper authentication.

## Deployment

The backend is designed to be deployed on Render. 