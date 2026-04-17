import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
    try {
        const comments = await prisma.comment.findMany({
            orderBy: {
                createdAt: 'asc'
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true
                    }
                },
                parent: {
                    include: {
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });
        return NextResponse.json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { content, parentId } = await req.json();

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const newComment = await prisma.comment.create({
            data: {
                content: content.trim(),
                userId: user.id,
                parentId: parentId || null,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true
                    }
                },
                parent: {
                    include: {
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json(newComment);
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
    }
}
