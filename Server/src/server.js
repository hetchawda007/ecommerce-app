import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './Db/connectDB.js';
import Userroutes from './routes/Userauth.js';
import Adminroutes from './routes/Adminauth.js';
import Useritems from './routes/Useritems.js';
import Adminitems from './routes/Adminitems.js';
import Authroute from './routes/Authroute.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
dotenv.config();
await connectDB()
app.use(cors(
    {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    },
));

app.use('/api/v1', Authroute);
app.use('/api/v1/user', Userroutes);
app.use('/api/v1/admin', Adminroutes);
app.use('/api/v1/useritems', Useritems);
app.use('/api/v1/adminitems', Adminitems);

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});