'use client';

import { use, useEffect, useState } from 'react';

type Column = {
	id: number;
	tableId: number;
	title: string;
	type: string;
	required: boolean;
	orderIndex: number;
};

type DataRow = {
	id: number;
	tableId: number;
	content: string[];
};
type Menu = {
	id: number;
	menuName: string;
	tableId: number;
};
export default function TableColumnsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const tableId = Number(id);

	const [columns, setColumns] = useState<Column[]>([]);
	const [dataRows, setDataRows] = useState<DataRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [showAddColumnForm, setShowAddColumnForm] = useState(false);

	// Add column form states
	const [colTitle, setColTitle] = useState('');
	const [colType, setColType] = useState('string');
	const [colRequired, setColRequired] = useState(false);

	// Add data row inputs
	const [newRowContent, setNewRowContent] = useState<string[]>([]);
	const [menus, setMenus] = useState<Menu[]>([]);


	async function fetchMenus() {
		setLoading(true);
		const res = await fetch('/api/menus');
		const data = await res.json();
		setMenus(data);
		setLoading(false);
	}
	// Fetch columns & data
	async function fetchColumns() {
		const res = await fetch(`/api/columns?tableId=${tableId}`);
		if (!res.ok) throw new Error('Failed to fetch columns');
		const cols = await res.json();
		setColumns(cols);
	}

	async function fetchDataRows() {
		const res = await fetch(`/api/data?tableId=${tableId}`);
		if (!res.ok) throw new Error('Failed to fetch data rows');
		const rows = await res.json();
		setDataRows(rows);
	}

	async function fetchAll() {
		setLoading(true);
		try {
			await Promise.all([fetchMenus(), fetchColumns(), fetchDataRows()]);
		} catch (e) {
			console.error(e);
		}
		setLoading(false);
	}

	useEffect(() => {
		fetchAll();
	}, [tableId]);

	// Add Column
	async function handleAddColumn(e: React.FormEvent) {
		e.preventDefault();
		if (!colTitle || !colType) return alert('Fill all column fields');

		const res = await fetch('/api/columns', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				tableId,
				title: colTitle,
				type: colType,
				required: colRequired,
				orderIndex: columns.length,
			}),
		});

		if (res.ok) {
			setColTitle('');
			setColType('string');
			setColRequired(false);
			setShowAddColumnForm(false);
			fetchAll();
		} else {
			alert('Failed to add column');
		}
	}

	// Handle input change for add data row form
	function handleNewRowChange(idx: number, val: string) {
		setNewRowContent((prev) => {
			const copy = [...prev];
			copy[idx] = val;
			return copy;
		});
	}

	// Add Data Row
	async function handleAddDataRow(e: React.FormEvent) {
		e.preventDefault();

		// // Fill missing content with empty string if needed
		const rowContent = columns
			.sort((a, b) => a.orderIndex - b.orderIndex)
			.map((_, idx) => newRowContent[idx] ?? '');
		// console.log(JSON.stringify(rowContent));

		const res = await fetch('/api/data', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				tableId,
				content: rowContent,
			}),
		});

		if (res.ok) {
			setNewRowContent([]);
			fetchDataRows();
		} else {
			alert('Failed to add data row');
		}
	}

	const sortedColumns = columns.sort((a, b) => a.orderIndex - b.orderIndex);

	return (
		<div className='p-6 '>
			{!!menus && (
				<h1 className="text-2xl font-bold mb-4">
					{menus.filter((menu) => menu.tableId == tableId)[0]?.menuName}
				</h1>
			)}

			<button
				onClick={() => setShowAddColumnForm(!showAddColumnForm)}
				className="mb-4 px-3 py-1 bg-green-600 text-white rounded"
			>
				+ Add Column
			</button>

			{showAddColumnForm && (
				<form onSubmit={handleAddColumn} className="mb-6 space-y-2 max-w-sm">
					<input
						type="text"
						placeholder="Title"
						value={colTitle}
						onChange={(e) => setColTitle(e.target.value)}
						className="w-full p-2 border rounded"
						required
					/>

					<select
						value={colType}
						onChange={(e) => setColType(e.target.value)}
						className="w-full p-2 border rounded"
						required
					>
						<option value="string">string</option>
						<option value="int">int</option>
						<option value="float">float</option>
						<option value="bool">bool</option>
						<option value="date">date</option>
					</select>

					<label className="inline-flex items-center space-x-2">
						<input
							type="checkbox"
							checked={colRequired}
							onChange={(e) => setColRequired(e.target.checked)}
						/>
						<span>Required</span>
					</label>

					<button
						type="submit"
						className="bg-blue-600 text-white px-3 py-1 rounded"
					>
						Add Column
					</button>
				</form>
			)}

			{loading ? (
				<p>Loading data...</p>
			) : sortedColumns.length === 0 ? (
				<p>No columns defined for this table.</p>
			) : (
				<form onSubmit={handleAddDataRow}>
					<table className="border-collapse border border-gray-300 w-full max-w-4xl">
						<thead>
							<tr>
								{sortedColumns.map((col) => (
									<th
										key={col.id}
										className="border border-gray-300 px-3 py-1 text-left"
									>
										{col.title}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{dataRows.length === 0 ? (
								<tr>
									<td
										colSpan={sortedColumns.length}
										className="p-3 text-center text-gray-500"
									>
										No data rows yet.
									</td>
								</tr>
							) : (
								dataRows.map((row) => (
									<tr key={row.id}>
										{sortedColumns.map((col, idx) => (
											<td
												key={col.id}
												className="border border-gray-300 px-3 py-1"
											>
												{row.content[idx] ?? ''}
											</td>
										))}
									</tr>
								))
							)}

							{/* Add new data row inputs */}
							<tr className="bg-gray-50">
								{sortedColumns.map((col, idx) => (
									<td key={col.id} className="border border-gray-300 px-2 py-1">
										<input
											type="text"
											value={newRowContent[idx] ?? ''}
											onChange={(e) => handleNewRowChange(idx, e.target.value)}
											placeholder={`Add ${col.title}`}
											className="w-full p-1 border rounded"
											required={col.required}
										/>
									</td>
								))}
							</tr>
							<tr>
								<td colSpan={sortedColumns.length} className="text-right p-2">
									<button
										type="submit"
										className="bg-blue-600 text-white px-3 py-1 rounded"
									>
										+ Add Data Row
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</form>
			)}
		</div>
	);
}
