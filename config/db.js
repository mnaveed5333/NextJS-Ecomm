import mongoose from "mongoose";

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
            ssl: true,        // 👈 added
            tls: true,        // 👈 added
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