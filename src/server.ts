import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv';

dotenv.config();
const app: express.Application = express()
const address: string = "0.0.0.0:3000"
const PORT = process.env.PORT;

app.use(bodyParser.json())

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
})

app.listen(PORT, function () {
    console.log(`starting app on: ${address}`)
})
