"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Menu = {
  id: number;
  menuName: string;
  tableId: number;
};

export default function Sidebar() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [menuName, setMenuName] = useState("");
  const [tableName, setTableName] = useState("");

  async function fetchMenus() {
    setLoading(true);
    const res = await fetch("/api/menus");
    const data = await res.json();
    setMenus(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchMenus();
  }, []);

  async function handleAddMenu(e: React.FormEvent) {
    e.preventDefault();
    if (!menuName || !tableName) return alert("Fill in all fields");

    const res = await fetch("/api/menus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuName, tableName }),
    });

    if (res.ok) {
      setMenuName("");
      setTableName("");
      setShowForm(false);
      fetchMenus();
    } else {
      alert("Failed to add menu");
    }
  }

  return (
    <aside className="w-64 bg-gray-100 p-4 border-r">
      <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
        Menu
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-green-600 text-2xl font-bold leading-none"
          aria-label="Add Menu"
        >
          +
        </button>
      </h2>

      {showForm && (
        <form onSubmit={handleAddMenu} className="mb-4 space-y-2">
          <input
            type="text"
            placeholder="Menu Name"
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
            className="w-full p-1 border rounded"
          />
          <input
            type="text"
            placeholder="Table Name"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className="w-full p-1 border rounded"
          />
          <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">
            Add
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading menus...</p>
      ) : (
        <ul className="space-y-2">
          {menus.map((menu) => (
            <li key={menu.id}>
              <Link href={`/menu/${menu.id}`} className="text-blue-600 hover:underline">
                {menu.menuName}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
