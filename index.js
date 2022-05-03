const express = require('express')
const app = express()
cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000


// middelware
app.use(cors());
app.use(express.json())
require('dotenv').config();




const uri = `mongodb+srv://${process.env.SECRET_USER}:${process.env.SECRET_PASSWORD}@cluster0.qsmyb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect()
        const collection = client.db("assignment-11").collection("items");
        app.post('/add',async(req,res)=>{
          const items = req.body;
          const additems =await collection.insertOne(items)
          res.send(additems)
        })
       
    }finally{

    }
}
run().catch(console.dir)


















app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(` listening on port ${port}`)
})