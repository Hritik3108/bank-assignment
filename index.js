const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const dotenv = require('dotenv').config({path:'./process.env'});
const path = require('path');
const {fileURLToPath} = require('url');

const app = express()

app.use(express.json())
app.use(cors({
    origin:'http://localhost:5173'
}))
// app.use(express.static('images'))
// app.use(express.static('client'))

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname,'./client/dist')))
app.use(express.static(path.join(__dirname,'./images')))

app.listen(5100,()=>{
    console.log('server started')
})

mongoose.connect(process.env.DATABASE);

const db=mongoose.connection;
db.on('open',()=>{
    console.log('Connection to database successful');
});
db.on('error',()=>{
    console.log('Connection with database failed');
});

const authRoute = require('./routes/auth.routes') 
app.use(authRoute)

const customerRoute = require('./routes/user.routes') 
app.use(customerRoute)

const bankerRoute = require('./routes/banker.routes') 
app.use(bankerRoute)

app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'./client/dist/index.html')))
