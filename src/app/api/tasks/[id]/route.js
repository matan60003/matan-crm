import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        status: body.status,
        priority: body.priority,
      },
      include: {
        lead: true,
        comments: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Update Task Error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await prisma.task.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 },
    );
  }
}
