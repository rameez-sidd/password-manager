import express from 'express'
import 'dotenv/config'
import { MongoClient } from 'mongodb'
import bodyParser from 'body-parser'
import cors from 'cors'

//  Connection URL
const url = process.env.MONGO_URI;
const client = new MongoClient(url);

// Database Name
const dbName = 'passWiz';


const app = express()

app.use(bodyParser.json())
app.use(cors())
const port = 3000

let db
let collection

const connectDB = async ()=> {
    await client.connect();
    db = client.db(dbName);
    collection = db.collection('passwords');
    console.log("Connected to Database")
}


// Fetch all the passwords
app.get('/',async (req, res) => {
    const findResult = await collection.find({}).toArray();
    res.send(findResult);    
})

// Save a password
app.post('/',async (req, res) => {
    const password = req.body
    const insertResult = await collection.insertOne(password);
    res.send({success: true, insertResult});
})

// Delete a password
app.delete('/',async (req, res) => {
    const password = req.body
    const deleteResult = await collection.deleteOne(password);
    res.send({success: true, deleteResult});
})

// Update a password
app.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { site, username, password } = req.body;
    const updateResult = await collection.updateOne({ id }, { $set: { site, username, password } });
    res.send({ success: true, updateResult });
});


app.listen(port,async () => {
  await connectDB()  // Initialize the database connection once
  console.log(`Example app listening on port ${port}`)
})