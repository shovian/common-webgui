import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tableId = url.searchParams.get("tableId");
  if (!tableId) {
    return NextResponse.json({ error: "Missing tableId" }, { status: 400 });
  }

  const columns = await prisma.column.findMany({
    where: { tableId: Number(tableId) },
    orderBy: { orderIndex: "asc" },
  });

  return NextResponse.json(columns);
}

export async function POST(req: Request) {
  try {
    const { tableId, title, type, required, orderIndex } = await req.json();

    if (!tableId || !title || !type || orderIndex === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newColumn = await prisma.column.create({
      data: {
        tableId: Number(tableId),
        title,
        type,
        required,
        orderIndex: Number(orderIndex),
      },
    });

    return NextResponse.json(newColumn, { status: 201 });
  } catch (error) {
    console.error("Failed to create column", error);
    return NextResponse.json({ error: "Failed to create column" }, { status: 500 });
  }
}
