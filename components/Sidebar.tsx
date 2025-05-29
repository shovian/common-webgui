'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react'; // Optional: install lucide-react for icons

type Menu = {
	id: number;
	menuName: string;
	tableId: number;
};

export default function Sidebar() {
	const [menus, setMenus] = useState<Menu[]>([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [menuName, setMenuName] = useState('');
	const [tableName, setTableName] = useState('');

	useEffect(() => {
		fetchMenus();
	}, []);

	async function fetchMenus() {
		setLoading(true);
		const res = await fetch('/api/menus');
		const data = await res.json();
		setMenus(data);
		setLoading(false);
	}

	async function handleAddMenu(e: React.FormEvent) {
		e.preventDefault();
		if (!menuName || !tableName) return alert('Fill in all fields');

		const res = await fetch('/api/menus', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ menuName, tableName }),
		});

		if (res.ok) {
			setMenuName('');
			setTableName('');
			setShowForm(false);
			fetchMenus();
		} else {
			alert('Failed to add menu');
		}
	}

	return (
		<aside className="w-72 h-screen bg-white border-r px-4 py-6 shadow-sm">
			<div className="flex justify-between items-center mb-6">
				<Link
					href={`/`}
					className="block   rounded-lg text-sm font-medium text-gray-700  hover:text-slate-600 transition"
				>
					<h2 className="text-2xl font-semibold text-gray-800">VeoWeb</h2>
				</Link>
			</div>

			{showForm && (
				<form onSubmit={handleAddMenu} className="space-y-3 mb-6">
					<input
						type="text"
						placeholder="Menu Name"
						value={menuName}
						onChange={(e) => setMenuName(e.target.value)}
						className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
					/>
					<input
						type="text"
						placeholder="Table Name"
						value={tableName}
						onChange={(e) => setTableName(e.target.value)}
						className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
					/>
					<button
						type="submit"
						className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-lg transition"
					>
						Add Menu
					</button>
				</form>
			)}

			{loading ? (
				<p className="text-gray-500 text-sm">Loading menus...</p>
			) : menus.length === 0 ? (
				<p className="text-gray-500 text-sm">No menus found.</p>
			) : (
				<ul className="space-y-2">
					{menus.map((menu) => (
						<li key={menu.id}>
							<Link
								href={`/menu/${menu.id}`}
								className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
							>
								{menu.menuName}
							</Link>
						</li>
					))}
					<li key={'add-menu'}>
						<button
							onClick={() => setShowForm(!showForm)}
							className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition w-full"
							aria-label="Add Menu"
						>
							<Plus className="w-5 h-5" />
						</button>
					</li>
				</ul>
			)}
		</aside>
	);
}
