import connectDB from "@/config/db";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }

        const { address, items, amount } = await request.json();

        await connectDB();

        await Order.create({
            userId,
            items,
            amount,
            address,
            date: Date.now()
        });

        return NextResponse.json({ success: true, message: "Order Placed" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}