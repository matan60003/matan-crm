import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        lead: true,
        comments: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET Tasks Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const newTask = await prisma.task.create({
      data: {
        title: body.title,
        priority: body.priority || "רגיל",
        status: "פתוח",
        leadId: body.leadId ? parseInt(body.leadId) : null,
      },
      include: {
        lead: true,
        comments: true,
      },
    });

    return NextResponse.json(newTask);
  } catch (error) {
    console.error("POST Task Error:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 },
    );
  }
}
