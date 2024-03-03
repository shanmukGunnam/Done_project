// // connecting to MongoDB
// const express = require('express');
// const bodyParser = require('body-parser');
// const { MongoClient } = require('mongodb');

// const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));

// const mongoURI = process.env.MONGO_URI || 'mongodb://mongo:27017/ecommerce1'; // Default to local MongoDB if not provided
// const dbName = 'ecommerce1';

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

// app.post('/register', async (req, res) => {
//     const { firstName, lastName, email, phoneNumber } = req.body;

//     try {
//         const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }); // Specify options here
//         await client.connect();

//         const db = client.db(dbName);
//         const usersCollection = db.collection('users1');
//         await usersCollection.insertOne({ firstName, lastName, email, phoneNumber });

//         client.close();
//         res.send('User registered successfully!');
//     } catch (err) {
//         console.error('Error connecting to MongoDB:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });

// const PORT = 4000;
// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}/`);
// });
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce1'; // Default to local MongoDB if not provided
const dbName = 'ecommerce1';

let client; // Declare client outside to reuse it

async function connectToMongoDB() {
    try {
        client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('Connected to MongoDB successfully!');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err; // Re-throw error to handle it elsewhere
    }
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/register', async (req, res) => {
    const { firstName, lastName, email, phoneNumber } = req.body;

    try {
        if (!client) {
            await connectToMongoDB();
        }

        const db = client.db(dbName);
        const usersCollection = db.collection('users1');
        await usersCollection.insertOne({ firstName, lastName, email, phoneNumber });
        console.log(`User registered: ${firstName} ${lastName}, ${email}, ${phoneNumber}`);
        res.send('User registered successfully!');
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).send('Internal Server Error');
    }
});

const PORT = process.env.PORT || 4000; // Allow configuration of port through environment variable
app.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    await connectToMongoDB(); // Connect to MongoDB when the server starts
});

process.on('SIGINT', () => {
    if (client) {
        client.close();
    }
    process.exit();
});
