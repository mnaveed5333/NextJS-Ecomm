import mongoose from "mongoose";
import "@/models/product";  // ← add this
import "@/models/order";    // ← add this

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        console.log("MongoDB already connected ✅");
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            ssl: true,
            tls: true,
        };

        cached.promise = mongoose
            .connect(process.env.MONGO_URI, opts)
            .then((mongoose) => {
                const dbName = mongoose.connection.db.databaseName;
                console.log(`MongoDB connected successfully ✅ DB: ${dbName}`);
                return mongoose;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectDB;