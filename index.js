const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//Using middleware

app.use(cors({
    origin: ['http://localhost:5173',
        'https://cardoc-a8b6b.web.app',
        'https://cardoc-a8b6b.firebaseapp.com'],
    credentials: true
}));
app.use(express.json())
app.use(cookieParser());

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

// using own middlewares
const logger = async (req, res, next) => {
    // console.log('called: ', req.host, req.originalUrl)
    console.log('Log info called: ', req.method, req.url)
    next();
}
const verifytoken = async (req, res, next) => {
    const token = req?.cookies?.token;
    console.log("value of the token: ", token);
    if (!token) {
        return res.status(401).send({ message: 'not authorized' });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log(err)
            return res.status(401).send({ message: 'unauthorized' })
        }
        console.log('decoded token is : ', decoded);
        req.user = decoded;
        next();
    })
}
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const cardocCollection = client.db("cardoc").collection("services");
        const cardocCollection2 = client.db("cardoc").collection("prodects");
        const cardocCollection3 = client.db("cardoc").collection("emp");
        const cardocCollection4 = client.db("cardoc").collection("customer");


        // auth related api
        app.post('/jwt', logger, async (req, res) => {
            const user = req.body;
            console.log(user);
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res
                .cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none'
                })
                .send({ success: true })
            // .cookie('token', token, {
            //     httpOnly: true,
            //     secure: false,
            //     sameSite: none
            // })
            // .send({success: true});

        })
        app.post('/logout', async (req, res) => {
            const user = req.body;
            console.log('logged out: ', user);
            res.clearCookie('token', { maxAge: 0 }).send({ success: true })
        })
        // service related api
        app.get('/services', async (req, res) => {
            const cursor = cardocCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = {
                projection: { title: 1, price: 1, img: 1, description: 1 },
            };
            const result = await cardocCollection.findOne(query, options)
            res.send(result);
        })
        app.get('/prodects', async (req, res) => {
            const cursor = cardocCollection2.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/emp', async (req, res) => {
            const cursor = cardocCollection3.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        //POST NEW DATA
        app.post('/customer', async (req, res) => {
            const customer = req.body;
            console.log(customer);
            const result = await cardocCollection4.insertOne(customer);
            res.send(result);
        })
        app.get('/customer', logger, verifytoken, async (req, res) => {
            console.log(req.query.email)
            console.log('tok tok token ', req.cookies?.token);
            console.log('user token from verifytoken/token woner: ', req.user);
            if (req.query.email !== req.user.email) {
                return res.status(403).send({ message: 'unauthourized access' });
            }
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const cursor = cardocCollection4.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        app.patch('/customer/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updatedData = req.body;
            console.log(updatedData);
            const updateDoc = {
                $set: { status: updatedData.status }
            };
            const result = await cardocCollection4.updateOne(query, updateDoc);
            res.send(result);
        })
        app.delete('/customer/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cardocCollection4.deleteOne(query);
            res.send(result);
        })
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('mycardocserver is running')
})
app.listen(port, () => {
    console.log(`mycardocserver is runnon on ${port} port`)
})