from fastapi import FastAPI, Depends, Query
from sqlalchemy.orm import Session
import models, database
from datetime import date
from fastapi.middleware.cors import CORSMiddleware 
from fastapi import HTTPException, status

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=database.engine)

@app.get("/expenses")
def get_expenses(category: str = None, sort: str = "date_desc", db: Session = Depends(database.get_db)):
    query = db.query(models.Expense)
    
    # Requirement: Filter by category
    if category:
        query = query.filter(models.Expense.category == category)
    
    # Requirement: Sort by date (newest first)
    if sort == "date_desc":
        query = query.order_by(models.Expense.date.desc())
    
    return query.all()

@app.post("/expenses")
def create_expense(amount: int, category: str, description: str, expense_date: date, db: Session = Depends(database.get_db)):
    # Note: 'amount' is an integer for money correctness
    new_expense = models.Expense(
        amount=amount, 
        category=category, 
        description=description, 
        date=expense_date
    )
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense) # Refreshes to get the ID from the database
    return {"message": "Expense recorded successfully", "id": new_expense.id}

@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(database.get_db)):
    db_expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    db.delete(db_expense)
    db.commit()
    return {"message": "Deleted successfully"}