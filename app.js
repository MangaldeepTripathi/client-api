require('dotenv').config()
const express = require("express")
const app = express();
const bodyParser = require("body-parser")
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')

app.use(helmet())// API security
app.use(cors())// handle cors error
//Mongoose connection
const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

mongoose.connect(
    "mongodb://127.0.0.1:27017/crm_ticket_system",
    //"mongodb+srv://mangaldeep:lLHEr4VpqqXWpBUY@cluster0.y4lt0oo.mongodb.net/crm_ticket_system",
    {
      dbName: "crm_ticket_system", 
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) =>
      err ? console.log(err) : console.log(
        "Connected to crm_ticket_system database")
  );
//mongoose.connect(process.env.MONGO_URL);

/* if(process.env.MODE_ENV!=="production"){
const mDb = mongoose.connection;
mDb.on("open", () => {
    console.log("MongoDB is connected");
});
mDb.on("error", (error) => {
    console.log("MongoDB is not connected");
    //console.log(error);
});

app.use(morgan('tiny'))
} */

// Set Body Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const port = process.env.PORT || 8001;

//Load the router
const userRouter = require('./src/routers/user.router')
const tickRouter = require('./src/routers/ticket.router')
//User routers
app.use("/v1/user", userRouter)
app.use("/v1/ticket", tickRouter)

const handleError = require('./src/utils/errorHandler');
//If any route is not found then put the *
app.use((req, res, next) => {
    const error = new Error("Resource is not found");
    error.status = 404
    next(error);
})
app.use((error, req, res, next) => {
    handleError(error, res)
})

app.listen(port, () => {
    console.log(`App is ready and running on http://localhost:${port}`);
})