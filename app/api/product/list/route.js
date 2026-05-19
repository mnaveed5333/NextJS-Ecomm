import authSeller from "@/lib/authSeller";
import connectDB from "@/config/db";
import Product from "@/models/product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        const isSeller = await authSeller(userId);  // ✅ added await
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Not Authorized" });  // ✅ fixed
        }

        await connectDB();  // ✅ added

        const products = await Product.find({ userId });  // ✅ added

        return NextResponse.json({ success: true, products });  // ✅ added

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });  // ✅ added
    }
}