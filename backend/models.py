from sqlalchemy import Column, Integer, String, Date
from database import Base

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Integer)  # Stored in Paise (100.50 -> 10050)
    category = Column(String)
    description = Column(String)
    date = Column(Date)