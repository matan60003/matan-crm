import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 1. עדכון פרטי לקוח (PATCH)
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updatedCustomer = await prisma.customer.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.company,
        notes: body.notes,
        // אם שלחתי סכום חדש, נוודא שהוא נשמר עם סימן שקל
        amount: body.amount?.includes("₪") ? body.amount : `₪${body.amount}`,
      },
    });

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("Update Customer Error:", error);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 },
    );
  }
}

// 2. מחיקת לקוח לצמיתות (DELETE)
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await prisma.customer.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Delete Customer Error:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 },
    );
  }
}
