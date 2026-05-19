import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }

        const { cartItems } = await request.json();  // ✅ get cart from frontend

        await connectDB();

        await User.findByIdAndUpdate(userId, { cartItems });  // ✅ save to MongoDB

        return NextResponse.json({ success: true, message: "Cart Updated" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}