import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { id } = await params;
  const body = await req.json();

  const newComment = await prisma.comment.create({
    data: {
      content: body.content,
      taskId: parseInt(id),
    },
  });

  return NextResponse.json(newComment);
}
