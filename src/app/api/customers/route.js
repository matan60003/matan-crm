import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const customersRaw = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
    });

    const customers = customersRaw.map((c) => ({
      ...c,
      amount: c.amount?.includes("₪")
        ? c.amount
        : `₪${Number(c.amount || 0).toLocaleString()}`,
    }));

    const urgentTasks = await prisma.task.findMany({
      where: { status: "פתוח", priority: "דחוף" },
      include: { lead: true },
      take: 3,
      orderBy: { createdAt: "asc" },
    });

    const totalCustomers = customers.length;
    const totalAmountRaw = customersRaw.reduce((sum, c) => {
      const val = parseInt(c.amount?.replace(/[^0-9]/g, "")) || 0;
      return sum + val;
    }, 0);

    const activeLeadsCount = await prisma.lead.count({
      where: { NOT: { status: "הושלם" } },
    });

    return NextResponse.json({
      customers,
      urgentTasks,
      activeLeadsCount,
      stats: {
        totalCustomers,
        totalAmount: `₪${totalAmountRaw.toLocaleString()}`,
        activeLeads: activeLeadsCount,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const newCustomer = await prisma.customer.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || "",
        company: body.company || "",
        status: "פעיל",
        amount: body.amount ? `₪${body.amount}` : "₪0",
      },
    });
    return NextResponse.json(newCustomer);
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
