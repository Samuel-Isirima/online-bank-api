require('dotenv').config();

import express, { Application, Request, Response } from 'express'
import routes from './routes';
import { database_init } from './database/DatabaseInit';

const app: Application = express()
const port = process.env.APP_PORT

app.use('/api/v1', routes)
// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get('/', async(req: Request, res: Response): Promise<Response> => 
// {
//     return res.status(200).send({ message: `Welcome to the bank API! \n Endpoints available at http://localhost:${port}/api/v1` })
// })
database_init()
try 
{
    app.listen(port, () => 
    {
        console.log(`Server running on http://localhost:${port}`)
    })
} 
catch (error : any) 
{
    console.log(`Error occurred: ${error.message}`)
}