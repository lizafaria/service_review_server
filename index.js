const express = require('express')
const app = express()
cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        // home page inventory item
        app.get('/homebooks',async(req,res)=>{
          const query = {}
          const productitems = await collection.find(query).sort({_id:-1}) ;
          const result =await productitems.limit(6).toArray();
          res.send(result)

        })
        // manage page all item api
        app.get('/all',async(req,res)=>{
          const query = {}
          const cursol = await collection.find(query);
          const result =await cursol.toArray();
          res.send(result)

        })
        // add item to db api
        app.post('/add',async(req,res)=>{
          const items = req.body;
          const additems =await collection.insertOne(items)
          res.send(additems)
        })
        // single item details api
        app.get('/inventory/:id', async(req,res)=>{
          const id = req.params.id
         
          const query = {_id:ObjectId(id)}
          const inventoryitem = await collection.findOne(query)
          res.send(inventoryitem)
        })
        // updata quantity api
        app.put('/delivered/:id',async(req,res)=>{
          const id = req.params.id;
          const updataquantity= req.body.quantity
          const filter = {_id:ObjectId(id)}
          const options = { upsert: true };
          const updateDoc = {
            $set: {
              quantity: updataquantity
            },
          };
          const result = await collection.updateOne(filter, updateDoc, options);
          res.send(result)
        })
        // delete item api
        app.delete('/remove/:id',async(req,res)=>{
          const id = req.params.id
         
          const query = {_id:ObjectId(id)}
          const result = await collection.deleteOne(query)
          res.send(result)
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