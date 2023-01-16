import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();
const app: express.Application = express();
const PORT = process.env.PORT;
const address: string = `127.0.0.1:${PORT}`;

app.use(bodyParser.json());

app.get('/', function (_req: Request, res: Response) {
  res.send('Hello Store Front Customers!');
});

app.use('/api/v1', routes);

app.listen(PORT, function () {
  console.log(`starting app on: ${address}`);
});
