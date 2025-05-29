import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
	req: NextRequest,
	context: { params: Promise<{ id: string }> } // Make params a Promise
) {
	const { id } = await context.params; // Await params before accessing id
	const tableId = parseInt(id);

	if (!tableId || isNaN(tableId)) {
		return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
	}

	const table = await prisma.table.findUnique({
		where: { id: tableId },
		include: {
			columns: { orderBy: { orderIndex: 'asc' } },
			dataRows: true,
		},
	});

	if (!table) {
		return NextResponse.json({ error: 'Table not found' }, { status: 404 });
	}

	const rows = table.dataRows.map((row) => {
		const values = JSON.parse(row.content);
		return table.columns.reduce((acc, col, idx) => {
			acc[col.title] = values[idx];
			return acc;
		}, {} as Record<string, string>);
	});

	return NextResponse.json({
		columns: table.columns.map((c) => ({ title: c.title, type: c.type })),
		rows,
	});
}
