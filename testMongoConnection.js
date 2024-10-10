const { MongoClient } = require("mongodb");

const username = encodeURIComponent("avic");
const password = encodeURIComponent("6s");
const uri =
  `mongodb+srv://${username}:${password}@maincluster.vizwe.mongodb.net/?retryWrites=true&w=majority` ||
  "your-fallback-uri-here"; // Add a fallback for testing

if (!uri.startsWith("mongodb")) {
  throw new Error("Invalid MongoDB URI.");
}

async function testConnection() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected successfully to MongoDB");
    await client.close();
  } catch (error) {
    console.error("Connection failed:", error);
  }
}

testConnection();
