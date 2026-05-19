import connectDB from "@/config/db";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function DELETE(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }

        const { productId } = await request.json();

        await connectDB();

        // ✅ only delete if product belongs to this seller
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