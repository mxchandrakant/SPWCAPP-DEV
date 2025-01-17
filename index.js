require('dotenv').config()
const express = require("express")
const cors = require("cors")
const app = express()
const port = process.env.PORT || 3000
global.conn = require("./src/customer/config/dbconnection");
global._ = require('underscore');
global.ecode = require('./src/customer/config/error_codes.json')
global.basepath='/customer'
app.use(cors())
app.use(express.json());

const auth = require("./src/customer/route/auth.route")
const profile = require('./src/customer/route/profile.route')

// customer
app.use(auth)
app.use(profile)

app.get('*', function(req, res){
    return res.status(400).send("Authentication failed.")
});

app.listen(port, () => console.log(`server run on Port :${port}!`))
