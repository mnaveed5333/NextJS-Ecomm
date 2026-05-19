import connectDB from "@/config/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        // 1. connect to database
        await connectDB();

        // 2. fetch all products
        const products = await Product.find({});

        // 3. return response
        return NextResponse.json({ success: true, products });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}