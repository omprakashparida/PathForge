import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoutes);
app.listen(PORT,()=> {
    console.log(`Server is running on port ${PORT}`);
});


//Database connection
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('Connected to MongoDB');
})
.catch((err)=>{
    console.log(err);
});









app.get('/',(req,res)=>{
    // console.log('Server is running');
    res.send('Server is running');
});

