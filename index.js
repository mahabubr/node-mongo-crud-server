const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
require('dotenv').config()


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vlhy1ml.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const userCollection = client.db('nodeMongoCrud').collection('users')

        app.get('/users', async (req, res) => {
            const query = {}
            const cursor = userCollection.find(query)
            const users = await cursor.toArray()
            res.send(users)
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }

            const user = await userCollection.findOne(query)
            res.send(user)
        })

        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await userCollection.insertOne(user)
            res.send(result)
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const user = req.body
            const option = { upsert: true }
            const updatedUser = {
                $set: {
                    name: user.name,
                    address: user.address,
                    email: user.email
                }
            }
            const result = await userCollection.updateOne(filter, updatedUser, option)
            res.send(result)
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })

    }
    finally {

    }
}

run().catch(e => console.log(e))

app.get('/', (req, res) => {
    res.send('Hello From Node Mongo Crud Server')
})

app.listen(port, () => {
    console.log(`Listening Port ${port}`);
})