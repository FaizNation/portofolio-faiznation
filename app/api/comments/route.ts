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
                        image: true,
                        email: true
                    }
                },
                parent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        const ownerEmail = process.env.EMAIL_USER || "novaatalagrab@gmail.com";
        const processedComments = comments.map(comment => {
            const isVerified = comment.user.email === ownerEmail;
            let parentIsVerified = false;
            if (comment.parent && comment.parent.user.email) {
                parentIsVerified = comment.parent.user.email === ownerEmail;
            }

            return {
                ...comment,
                user: {
                    name: comment.user.name,
                    image: comment.user.image,
                    isVerified
                },
                parent: comment.parent ? {
                    ...comment.parent,
                    user: {
                        name: comment.parent.user.name,
                        isVerified: parentIsVerified
                    }
                } : null
            };
        });

        return NextResponse.json(processedComments);
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
                        image: true,
                        email: true
                    }
                },
                parent: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        const ownerEmail = process.env.EMAIL_USER || "[EMAIL_ADDRESS]";
        const isVerified = newComment.user.email === ownerEmail;
        let parentIsVerified = false;
        if (newComment.parent && newComment.parent.user.email) {
            parentIsVerified = newComment.parent.user.email === ownerEmail;
        }

        const processedNewComment = {
            ...newComment,
            user: {
                name: newComment.user.name,
                image: newComment.user.image,
                isVerified
            },
            parent: newComment.parent ? {
                ...newComment.parent,
                user: {
                    name: newComment.parent.user.name,
                    isVerified: parentIsVerified
                }
            } : null
        };

        return NextResponse.json(processedNewComment);
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
    }
}
