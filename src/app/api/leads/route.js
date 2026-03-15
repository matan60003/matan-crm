import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const newLead = await prisma.lead.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || "",
        source: body.source || "גוגל",
        status: "חדש",
        notes: body.notes || "",
      },
    });

    return NextResponse.json(newLead);
  } catch (error) {
    console.error("Lead creation error:", error);
    // החזרת הודעת שגיאה מפורטת
    return NextResponse.json(
      {
        error: "שגיאת שרת ביצירת ליד",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
