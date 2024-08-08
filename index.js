const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//Using middleware

app.use(cors());
app.use(express.json())

// mongodb+srv://benjirbhuyan:<password>@cluster0.mym2gsq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

// user:mycardoc
// pass:daNO6L61qlNJkcTF

// const uri = "mongodb+srv://benjirbhuyan:<password>@cluster0.mym2gsq.mongodb.net/?appName=Cluster0";
// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mym2gsq.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('mycardocserver is running')
})
app.listen(port, () => {
    console.log(`mycardocserver is runnon on ${port} port`)
})