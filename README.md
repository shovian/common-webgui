
# **VeoWeb**

**VeoWeb** is a web-based GUI for managing customizable tables and menus. It is built using **Next.js**, **React**, **Prisma (with SQLite)**, and **Tailwind CSS**.

The application allows users to create menus, define table schemas (with typed columns), and add or view data rows—all through a user-friendly interface.

---

## 🚀 Features

* 📁 Create and list menus, each linked to its own dynamic table.
* 📊 Add columns to tables with configurable type, order, and required flags.
* 📝 Add and view data rows using clean, schema-aware forms.
* 🔌 RESTful API for all data operations.
* ⚙️ Built with modern web technologies: Next.js App Router, Prisma, Tailwind, and React.

---

## 🛠 Getting Started

### Prerequisites

* **Node.js** v18 or higher
* **npm**

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/veoweb.git
cd veoweb

# Install dependencies
npm install

# Setup environment
echo 'DATABASE_URL="file:./dev.db"' > .env

# Deploy database
npx prisma migrate deploy

# Start the development server
npm run dev
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**

---

## 🧩 Usage

1. Use the sidebar to **add new menus**.
2. On a menu’s page, **add columns** to define the table schema.
3. Enter data rows using the form at the bottom of each table.
4. All table structures and data are stored dynamically in SQLite via Prisma.

---

## 🧱 Project Structure

```
app/        → Next.js App Router pages, layouts, API routes
components/ → Reusable React UI components
prisma/     → Prisma schema and database migrations
public/     → Static assets
```

---

## 📡 API Endpoints

| Endpoint                   | Method | Description                            |
| -------------------------- | ------ | -------------------------------------- |
| `/api/menus`               | GET    | List all menus                         |
| `/api/menus`               | POST   | Create a new menu and associated table |
| `/api/columns?tableId=...` | GET    | List columns for a table               |
| `/api/columns`             | POST   | Add a column to a table                |
| `/api/data?tableId=...`    | GET    | List data rows for a table             |
| `/api/data`                | POST   | Add a data row to a table              |

---

## 🧪 Development Commands

```bash
npm run lint     # Lint the codebase
npm run build    # Build for production
npm run start    # Start the production server
```

---

## 📄 License

This project is not yet licensed under the [MIT License](LICENSE).
