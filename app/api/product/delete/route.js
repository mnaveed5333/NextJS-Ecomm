import connectDB from "@/config/db";
import Product from "@/models/product";   // ← adjust path to your Product model
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }

        const { productId } = await request.json();

        if (!productId) {
            return NextResponse.json({ success: false, message: "Product ID is required" });
        }

        await connectDB();

        // Make sure the product belongs to this seller before deleting
        const product = await Product.findOne({ _id: productId, userId });

        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found or unauthorized" });
        }

        await Product.findByIdAndDelete(productId);

        return NextResponse.json({ success: true, message: "Product deleted successfully" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}