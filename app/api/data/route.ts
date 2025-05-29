import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// export async function GET(req: Request) {
// 	const url = new URL(req.url);
// 	const tableId = url.searchParams.get('tableId');
// 	if (!tableId) {
// 		return NextResponse.json({ error: 'Missing tableId' }, { status: 400 });
// 	}

// 	const dataRows = await prisma.data.findMany({
// 		where: { tableId: Number(tableId) },
// 		orderBy: { id: 'asc' }, // or any order you want
// 	});

// 	return NextResponse.json(dataRows);
// }
export async function GET(req: Request) {
	const url = new URL(req.url);
	const tableIdStr = url.searchParams.get('tableId');

	if (!tableIdStr) {
		return NextResponse.json({ error: 'Missing tableId' }, { status: 400 });
	}

	const tableId = Number(tableIdStr);

	try {
		const rows = await prisma.data.findMany({
			where: { tableId },
		});

		// Deserialize content JSON string into string[]
		const parsedRows = rows.map((row) => ({
			...row,
			content: JSON.parse(row.content),
		}));

		return NextResponse.json(parsedRows);
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to fetch data' },
			{ status: 500 }
		);
	}
}

export async function POST(req: Request) {
	const { tableId, content } = await req.json();
	const tableIdNumberized = Number(tableId);
	const contentJsosnized = JSON.stringify(content);
	console.log(content.toString(), typeof content);
	if (
		typeof tableIdNumberized !== 'number' ||
		typeof contentJsosnized !== 'string'
	) {
		return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
	}

	try {
		const newRow = await prisma.data.create({
			data: {
				tableId: tableIdNumberized,
				content: contentJsosnized,
			},
		});
		return NextResponse.json(newRow);
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to add data row' },
			{ status: 500 }
		);
	}
}
