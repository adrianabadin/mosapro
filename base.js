const fs= require("fs")
const dotenv = require ("dotenv")
dotenv.config()
// const data= fs.readFileSync("region.json","utf-8")
// const buff = Buffer.from(data,"utf-8").toString("base64")
// fs.writeFileSync("base.json",buff)

const data= fs.readFileSync("base.json","utf-8")
const buff= Buffer.from(data,"base64").toString("utf-8")
console.log(buff)