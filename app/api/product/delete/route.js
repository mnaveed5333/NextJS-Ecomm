import connectDB from "@/config/db";
import Product from "@/models/product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function DELETE(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }

        const body = await request.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ success: false, message: "Product ID is required" });
        }

        await connectDB();

        const product = await Product.findOneAndDelete({
            _id: productId,
            userId: userId
        });

        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found or unauthorized" });
        }

        return NextResponse.json({ success: true, message: "Product deleted successfully" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}