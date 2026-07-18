import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                email: true,
                joinedAt: true,
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ 
            email: user.email,
            joinedAt: user.joinedAt,
        });
    } catch (error) {
        console.error("Error fetching user email:", error);
        return NextResponse.json({ error: "Failed to fetch user email" }, { status: 500 });
    }
}
