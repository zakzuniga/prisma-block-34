const path = require("path");
const express = require("express");
const morgan = require("morgan");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config()
const axios = require("axios")
const session = require("express-session")

// Logging middleware
app.use(morgan("dev"));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file-serving middleware
app.use(express.static(path.join(__dirname, "..", "client/dist")));

// Check requests for a token and attach the decoded id to the request
app.use((req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  try {
    req.user = jwt.verify(token, process.env.JWT);
  } catch {
    req.user = null;
  }

  next();
});

//oauth 
const client_id = process.env.CLIENT_ID 
const client_secret = process.env.SECRET_KEY
const url = process.env.DATABASE_URL



app.get("/login" ,  (req,res)=>{
    try {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=user`
    res.redirect(githubAuthUrl)
    console.log(githubAuthUrl)
    } catch (error) {
        console.error(error)
        res.status(500).send("error redirecting to github oauth")
}
})
let accessToken = 

app.get("/callback" , async (req,res)=>{
    const code = req.query.code 
    console.log(`recieved code ${code}`)
    if(!code){
      res.status(400).send("code not found")
    }
    try {
      const config = {
        method: "POST",
        url : `https://github.com/login/oauth/access_token` ,
        headers : {
          'Accept' : "application/json"
        },
        params : {
          client_id : client_id ,
          client_secret : client_secret ,
          code : code 
        }
      }
      const tokenResponse = await axios.request(config)
      console.log("tokenResponse:" , tokenResponse.data)
      accessToken = tokenResponse.data.access_token
      res.json({accessToken : 'accessToken'})

     const userProfileResponse = await axios.get(`https://api.github.com/user`, {
      headers :{
        Authorization : `Bearer ${accessToken}`
      },
    })
    const userProfileData = userProfileResponse.data
    

    const userToken = jwt.sign(userProfileData , process.env.SECRET_KEY, {
      expiresIn : "1h"
    } )

   
console.log("User data:" , userProfileData)
res.send(userProfileData)



} catch (error) {
  console.error(error)
}
 })



// Backend routes
app.use("/auth", require("./auth"));
app.use("/api", require("./api"));

// Serves the HTML file that Vite builds
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client/dist/index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error.");
});

// Default to 404 if no other route matched
app.use((req, res) => {
  res.status(404).send("Not found.");
});





module.exports = app;