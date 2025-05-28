import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017/StorageApp");

export const connectDB = async () => {
    await client.connect();
    console.log("DB Connected")
    return client.db();
}

process.on('SIGINT', async() => {
    await client.close();
    console.log("Client Disconnected");
    process.exit(0);
})