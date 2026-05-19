import connectDB from "@/config/db";
import Address from "@/models/address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }

        const { address } = await request.json();  // ✅ get address from frontend

        await connectDB();

        await Address.create({ ...address, userId });  // ✅ save to MongoDB

        return NextResponse.json({ success: true, message: "Address Saved" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}