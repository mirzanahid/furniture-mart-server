const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000

const app = express();

//middle ware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vsmf7bv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {
        const categoriesCollection = client.db("furnitureMart").collection("category");
        const categoriesItemCollection = client.db("furnitureMart").collection("categories");
        const usersCollection = client.db("furnitureMart").collection("users");

        // categories api 
        app.get('/categories', async (req, res) => {
            const query = {};
            const category = await categoriesCollection.find(query).toArray();
            res.send(category)
        });
        // categories api
        app.get('/categories/:id', async (req, res) => {
            const id = req.params.id;
            let query = {
                "category_id": id
            };
            const cursor = categoriesItemCollection.find(query);
            const categoryItem = await cursor.toArray();
            res.send(categoryItem);
        });
        // jwt access token
        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
                return res.send({ accessToken: token });
            }
            res.status(403).send({ accessToken: 'token' })
        });

        // user save to db
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })
        // verify user role
        app.get('/users/role/:email', async (req, res) => {
           const email = req.params.email;
           const query={email};
           const user = await usersCollection.findOne(query);
           res.send({isAdmin: user?.role === 'admin',isBuyer: user?.role === 'buy',isSeller: user?.role === 'sell'});
        });


        // all sellers api
        app.get('/allSellers', async (req, res) => {
            const query = {
                "role": "sell"
            };
            const category = await usersCollection.find(query).toArray();
            res.send(category)
        });
        // all buyers api
        app.get('/allBuyers', async (req, res) => {
            const query = {
                "role": "buy"
            };
            const category = await usersCollection.find(query).toArray();
            res.send(category)
        });
        // user delete by admin
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = usersCollection.deleteOne(query);
            res.send(result);

        })
    }
    finally {

    }

}
run().catch(error => console.error(error))




app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})
