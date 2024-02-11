const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
console.log(ObjectId);

const app = express();
app.use(express());
app.use(express.json());
app.use(cors());

//AIzaSyAACG3mLEXEUEDqPCvh6ZFteaLQDnH0YbI

const uri =
  "mongodb+srv://purna:2470purna@cluster0.z2een.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
     client.connect();
    const database = client.db("Seminar-Library");
    const bookCollcetion = database.collection("books");
    const usersCollcetion = database.collection("users");

    app.post("/bookissue", async (req, res) => {
      const user = req.body;
      console.log(req.body);
      const result = await bookCollcetion.insertOne(user);
      console.log(result);
      res.json(result);
    });

    //post user data

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollcetion.insertOne(user);
      console.log(result);
      res.json(result);
    });

    console.log("database connected");

    //get book data
    app.get("/bookissue", async (req, res) => {
      const cursor = bookCollcetion.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    //get user data
    app.get("/user", async (req, res) => {
      const cursor = usersCollcetion.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    //recive single book student data

    app.get("/bookdata/:id", async (req, res) => {
      console.log(req.params.id);

      const result = await bookCollcetion.findOne({
       // _id: ObjectId(req.params.id),
      });
      res.send(result);
    });

    app.get("/book/:roll", async (req, res) => {
      const result = await bookCollcetion.findOne({
        student_id: req.params.roll,
      });
      res.send(result);
      console.log(result);
    });
    //recived book info
    app.put("/bookdata/:id", async (req, res) => {
      const user = req.body;
      //console.log(req.body);
      console.log(req.params.id);
      const filter = { _id:ObjectId (req.params.id) };
      //console.log(filter);
      const updateDoc = { $set: { recieve: req.body.currentDate } };
      //console.log(updateDoc);
      const result = await bookCollcetion.updateOne(filter, updateDoc);
      //console.log(result);
      res.json(result);
    });

    const saveUser = (email, displayName, method) => {
      const user = { email, displayName };
      fetch("http://localhost:5000/users", {
        method: method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(user),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    };
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to dept seminer library");
});

app.listen(5000, () => {
  console.log("server is listenning");
});
