import express, { Request, Response, Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;
const SALESFORCE_API_KEY = process.env.SALESFORCE_API_KEY;

// Middleware
app.use(express.json());
app.use(cors());

// Validate API key exists
if (!SALESFORCE_API_KEY) {
  console.error('SALESFORCE_API_KEY is not defined in the environment variables');
  process.exit(1);
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Salesforce API proxy endpoint
app.post('/api/salesforce/query', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      res.status(400).json({ error: 'Query parameter is required' });
      return;
    }

    const response = await fetch('https://api-middle-man.duo.tax/api/Salesforce/query', {
      method: 'POST',
      headers: {
        'X-API-KEY': SALESFORCE_API_KEY as string,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      res.status(response.status).json(errorData);
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error querying Salesforce:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
