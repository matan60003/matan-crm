import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (body.status === "הושלם") {
      const lead = await prisma.lead.findUnique({
        where: { id: parseInt(id) },
      });
      if (!lead)
        return NextResponse.json({ error: "Lead not found" }, { status: 404 });

      const result = await prisma.$transaction([
        prisma.customer.create({
          data: {
            name: body.name || lead.name,
            email: body.email || lead.email,
            notes: body.notes || lead.notes,
            status: "פעיל",
            amount: body.amount
              ? `₪${Number(body.amount).toLocaleString()}`
              : "₪0",
            phone: body.phone || lead.phone || "",
            company: body.company || "",
          },
        }),
        prisma.lead.delete({ where: { id: parseInt(id) } }),
      ]);
      return NextResponse.json({ message: "Converted successfully", result });
    }

    const updatedLead = await prisma.lead.update({
      where: { id: parseInt(id) },
      data: {
        status: body.status,
        notes: body.notes,
        phone: body.phone,
      },
    });
    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error("Conversion error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
