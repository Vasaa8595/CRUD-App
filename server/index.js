const express = require("express");
const cors = require("cors"); // 🔥 Add this
const users = require("./sample.json");
const fs = require("fs");

const app = express();
app.use(express.json());

const port = 8000;

app.use(cors()); // 🔥 Enable CORS for all origins

app.get("/users", (req, res) => {
  return res.json(users);
});

//Delete user 
app.delete("/users/:id",(req,res)=>{
  let id = Number(req.params.id);
  let filterUsers = users.filter((user)=>user.id!==id);
  fs.writeFile("./sample.json",JSON.stringify(filterUsers),(err,data)=>{
    return res.json(filterUsers);
  });
});

//Add user

app.post("/users",(req,res)=>{
  let {name,age,city} = req.body;
  if(!name || !age || !city){
    res.status(400).send({"message":"All field requied"}); 
  }
  let id = Date.now();
  users.push({id,name,age,city});
  fs.writeFile("./sample.json",JSON.stringify(users),(err,data)=>{
    return res.json({"message":"User detail added successfuly!!"});
  });
});

//Update User

app.patch("/users/:id",(req,res)=>{
  let id = Number(req.params.id);
  let {name,age,city} = req.body;
  if(!name || !age || !city){
    res.status(400).send({"message":"All field requied"}); 
  }
  let index = users.findIndex((user)=>user.id == id);
  users.splice(index,1,{...req.body});

  fs.writeFile("./sample.json",JSON.stringify(users),(err,data)=>{
    return res.json({"message":"User detail updated successfuly!!"});
  });
});


app.listen(port, (err) => {
  if (err) {
    console.error("Error starting server:", err);
  } else {
    console.log(`🚀 App is running on http://localhost:${port}`);
  }
});
