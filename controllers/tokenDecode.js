/* 
    using to decode the token and get the user role
*/
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicXVhbmx5Iiwicm9sZSI6Im1hbmFnZXIiLCJpYXQiOjE3MTEzNTc3MTksImV4cCI6MTcxMTM2NDkxOX0.oZDxnguUdLu3RW-0c_Qlmae8nxRLPU46qv41TnCCDdg";

const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
const userRole = decodedToken;
console.log(userRole)
