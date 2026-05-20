import authSeller from "@/lib/authSeller";
import connectDB from "@/config/db";
import Product from "@/models/product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }

        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Not Authorized" });
        }

        await connectDB();

        const products = await Product.find({
            userId,
            name: { $exists: true, $ne: null },
            image: { $exists: true, $ne: null, $not: { $size: 0 } }
        }).lean();

        const validProducts = products.filter(
            p => p && p._id && p.name && Array.isArray(p.image) && p.image.length > 0
        );

        return NextResponse.json({ success: true, products: validProducts });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}