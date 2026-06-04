# expense-tracker-fullstack
# 💸 Expense Tracker

A full-stack expense tracking application built as part of the Studio Graphene Associate Software Engineer take-home assignment.

The application allows users to track daily expenses, analyze spending habits through dashboards and charts, filter and search expenses, manage category budgets, export data as CSV, and view spending summaries in real time.

---

# 🚀 Live Demo

Frontend: https://your-frontend-url.vercel.app

Backend API: https://your-backend-url.onrender.com

---

# ✨ Features

## Expense Management

* Add new expenses
* Edit existing expenses
* Delete expenses with confirmation
* View expenses sorted by newest first
* Search expenses by note
* Pagination support

## Filtering & Sorting

* Filter by category
* Filter by date range
* Sort by:

  * Newest First
  * Oldest First
  * Amount High → Low
  * Amount Low → High

## Analytics Dashboard

* Total spending this month
* Highest expense
* Top spending category
* Category-wise spending summary
* Interactive charts

## Budget Tracking

* Set category budgets
* Track spending against budgets
* Visual indicators for budget overruns

## Export

* Export filtered expenses as CSV

## User Experience

* Responsive design
* Dark mode support
* Loading skeletons
* Empty states
* Error states
* Toast notifications

## Bonus Features

* Drag-and-drop expense reordering
* CSV export
* Budget management
* Dark mode

---

# 🛠 Tech Stack

## Frontend

* React
* Vite
* React Router DOM
* Tailwind CSS
* React Hook Form
* Zod
* Recharts
* Axios
* dnd-kit

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* Zod

## Deployment

* Vercel (Frontend)
* Render (Backend)

---

# 📁 Project Structure

```text
expense-tracker-fullstack/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── routes/
│   │   └── utils/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middlewares/
│   │   ├── validation/
│   │   └── config/
│   └── package.json
│
└── README.md
```

---

# ⚙️ Running Locally

## Clone Repository

```bash
git clone <repository-url>
cd expense-tracker-fullstack
```

---

## Backend Setup

```bash
cd server
npm install
```

Create:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

Run:

```bash
npm run dev
```

Backend will start on:

```text
http://localhost:5000
```

---

## Frontend Setup

```bash
cd client
npm install
```

Create:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Run:

```bash
npm run dev
```

Frontend will start on:

```text
http://localhost:5173
```

---

# 📡 API Documentation

Detailed backend API documentation is available in:

```text
server/README.md
```

Endpoints include:

* POST /api/expenses
* GET /api/expenses
* GET /api/expenses/:id
* PUT /api/expenses/:id
* DELETE /api/expenses/:id
* GET /api/expenses/summary
* GET /api/expenses/export/csv

---

# 🏗 Architecture

The application follows a layered architecture:

* React UI Layer
* Service Layer (API Calls)
* Express REST API
* Service Layer (Business Logic)
* MongoDB Data Layer

Backend uses:

* MVC pattern
* Service layer architecture
* Zod validation
* Centralized error handling

Frontend uses:

* Component-based architecture
* Custom hooks
* Context API
* Service abstraction for API communication

---

# 📷 Screenshots

## Dashboard

(Add screenshot here)

## Expense List

(Add screenshot here)

## Budget Tracking

(Add screenshot here)

## Analytics

(Add screenshot here)

---

# 🔮 Future Improvements

If given more time, I would add:

* User authentication and authorization
* Recurring expenses
* Expense categories management
* Budget notifications
* Automated monthly reports
* Unit and integration testing
* Expense import from CSV
* Multi-user support

---

# 🙏 Notes

This project was built as part of the Studio Graphene Full Stack Developer assessment.

The assignment suggested using in-memory storage, JSON files, or SQLite. I chose MongoDB because it is a technology I am comfortable with and it simplified aggregation-based analytics and reporting features.
