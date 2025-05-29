import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const menus = await prisma.menu.findMany({
    select: {
      id: true,
      menuName: true,
      tableId: true,
    },
  });
  return NextResponse.json(menus);
}

export async function POST(req: Request) {
  try {
    const { menuName, tableName } = await req.json();

    if (!menuName || !tableName) {
      return NextResponse.json({ error: "Missing menuName or tableName" }, { status: 400 });
    }

    // Find max table ID
    const maxTable = await prisma.table.findFirst({
      orderBy: { id: "desc" },
    });

    const newTableId = (maxTable?.id ?? 0) + 1;

    // Create new table
    const newTable = await prisma.table.create({
      data: {
        id: newTableId,
        name: tableName,
      },
    });

    // Create menu linked to new table
    const newMenu = await prisma.menu.create({
      data: {
        menuName,
        tableId: newTable.id,
      },
    });

    return NextResponse.json(newMenu, { status: 201 });
  } catch (error) {
    console.error("Failed to create menu + table", error);
    return NextResponse.json({ error: "Failed to create menu and table" }, { status: 500 });
  }
}
