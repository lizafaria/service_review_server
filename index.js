const express = require('express')
const app = express()
cors = require('cors')
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000


// middelware
app.use(cors());
app.use(express.json())
require('dotenv').config();


function verifyJwt(req,res,next){
  const authHearder = req.headers.authorization;
  if(!authHearder){
    return res.status(401).send({massage:'unauthorized access'})
  }
  const token = authHearder.split(' ')[1]
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
    if(err){
      return res.status(403).send({massage:'forbidden daccess'});
    }
    
    req.decoded = decoded;
    next();
  });
         
         
}



const uri = `mongodb+srv://${process.env.SECRET_USER}:${process.env.SECRET_PASSWORD}@cluster0.qsmyb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect()
        const collection = client.db("assignment-11").collection("items");
        const blogscollection = client.db("assignment-11").collection("blogs");



        //auth
        app.post('/login',(req,res)=>{
          const user = req.body;
          const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:'1d'
          });
          res.send(accessToken)
        })
        // home page inventory item
        app.get('/homebooks',async(req,res)=>{
          const query = {}
          const productitems = await collection.find(query) ;
          const result =await productitems.limit(6).toArray();
          res.send(result)

        })
        // manage page all item api
        app.get('/all',async(req,res)=>{
          const query = {}
          const cursol = collection.find(query).sort({_id:-1});
          const result =await cursol.toArray();
          res.send(result)

        })
        app.get('/blogs',async(req,res)=>{
          const query = {}
          const cursol = blogscollection.find(query);
          const result =await cursol.toArray();
          res.send(result)

        })
        //top sell book api
        app.get('/top',async(req,res)=>{
          const query = {}
          const cursol = collection.find(query).sort({sell:-1});
          const result =await cursol.limit(3).toArray();
          res.send(result)

        })
        // send items by 
        app.get('/myitem',verifyJwt, async(req,res)=>{
          const decodedEmail = req.decoded.email
          const email = req.query.email
          if(email === decodedEmail){
            const query = {email:email}
          const cursol =  collection.find(query).sort({_id:-1});
          const result =await cursol.toArray();
          res.send(result)
          }else{
            res.status(403).send({massage:'forbidden access'})
          }

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
          const updateSell= req.body.sell
          // console.log(req.body);
          const filter = {_id:ObjectId(id)}
          const options = { upsert: true };
          const updateDoc = {
            $set: {
              quantity: updataquantity,
              sell : updateSell
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
  res.send('server is running')
})

app.listen(port, () => {
  console.log(` listening on port ${port}`)
})