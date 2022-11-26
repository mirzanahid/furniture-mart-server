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
        // user save to db
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.send(result)
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
