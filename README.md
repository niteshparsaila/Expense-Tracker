#  Expense-Tracker

A high-resilience, full-stack application for managing personal finances.

**Live Demo:** [https://expense-tracker-76jg.vercel.app/]

## Tech Stack
- **Frontend:** React.js, Tailwind CSS v4, Lucide Icons.
- **Backend:** FastAPI (Python), SQLAlchemy ORM.
- **Database:** SQLite (local persistent storage).
- **Deployment:** Vercel (Frontend), Render (Backend).

##  Key Design Decisions
- **Financial Precision:** Used **Integers (Paise)** for all amount fields to prevent floating-point arithmetic errors common in banking applications.
- **Decoupled Deployment:** Implemented a multi-cloud strategy by hosting the frontend on Vercel and the backend on Render to ensure scalability and better performance.
- **Resilience:** Built-in loading states and error handling for "realistic" network conditions, preventing duplicate data entry from multiple user clicks.

##  Setup & Installation
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/niteshparsaila/Expense-Tracker.git](https://github.com/niteshparsaila/Expense-Tracker.git)
