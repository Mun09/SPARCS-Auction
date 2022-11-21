let express = require('express');
let cors = require('cors');
let path = require('path');
let mongoose = require('mongoose');
require('dotenv').config();

const feedRouter = require('./routes/feed');
const auctionRouter = require('./routes/auction');
const userRouter = require('./routes/auctionuser');

const app = express();
const port = process.env.PORT;

app.use(express.json());

const whitelist = ['http://localhost:3000'];
const corsOptions = {
    origin: (origin, callback) => {
        console.log('[REQUEST-CORS] Request from origin: ', origin);
        if (!origin || whitelist.indexOf(origin) !== -1) callback(null, true)
        else callback(new Error('Not Allowed by CORS'));
    },
    credentials: true,
}

app.use(cors(corsOptions));

app.use('/feed', feedRouter);
app.use('/auction', auctionRouter);
app.use('/user', userRouter);

// app.use('/public', express.static(path.join(__dirname,'public')));
app.use('/public', express.static('public'));

const OMongooseOption = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(process.env.MONGO_URI, OMongooseOption).then(
    
    () => { console.log("[Mongoose] Connection Complete!") },
    (err) => { console.log(`[Mongoose] Connection Error: ${ err }`) }
);

app.listen(port, () => {
   console.log(`Example App Listening @ http://localhost:${ port }`);
});