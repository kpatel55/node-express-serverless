const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");
const uuid = require("uuid")
const app = express();

const PROFILES_TABLE = process.env.PROFILES_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app.use(express.json());

app.get("/profiles/:id", async function (req, res) {
  const params = {
    TableName: PROFILES_TABLE,
    Key: {
      id: req.params.id,
    },
  };

  try {
    const { Item } = await dynamoDbClient.get(params).promise();
    if (Item) {
      const { id, name, title, bio, createdAt, updatedAt } = Item;
      res.json({ id, name, title, bio, createdAt, updatedAt });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find profile with provided "id"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive profile" });
  }
});

app.delete("/profiles/:id", async function (req, res) {
  const id = req.params.id;
  const params = {
    TableName: PROFILES_TABLE,
    Key: {
      id: id,
    },
  };

  try {
    await dynamoDbClient.delete(params).promise();
    res.json({ message: `Successfully deleted profile ${id}` })
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not delete profile" });
  }
});

app.put("/profiles/:id", async function (req, res) {
  const { name, title, bio } = req.body;
  const id = req.params.id;
  const timestamp = new Date().getTime();

  if (typeof name !== "string" || typeof title !== "string" || typeof bio !== "string") {
    res.status(400).json({ error: 'parameters must be strings' });
  }

  const params = {
    TableName: PROFILES_TABLE,
    Key: {
        id: id,
    },
    ExpressionAttributeNames: { "#pn": "name" },
    ExpressionAttributeValues: {
        ":profileName": name,
        ":title": title,
        ":bio": bio,
        ":updatedAt": timestamp,
    },
    UpdateExpression: "SET #pn = :profileName, title = :title, bio = :bio, updatedAt = :updatedAt",
  };

  try {
    await dynamoDbClient.update(params).promise();
    res.json({ id, name, title, bio, timestamp });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not update profile" });
  }
});

app.post("/profiles", async function (req, res) {
  const { name, title, bio } = req.body;
  const id = uuid.v4();
  const timestamp = new Date().getTime();

  if (typeof name !== "string" || typeof title !== "string" || typeof bio !== "string") {
    res.status(400).json({ error: 'parameters must be strings' });
  }

  const params = {
    TableName: PROFILES_TABLE,
    Item: {
      id: id,
      name: name,
      title: title,
      bio: bio,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  try {
    await dynamoDbClient.put(params).promise();
    res.json({ id, name, title, bio, timestamp });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create profile" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
