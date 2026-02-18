import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, PlusCircle, Filter, Wallet } from 'lucide-react';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Others'];

  const fetchExpenses = async () => {
    try {
      const url = filter === 'All' 
        ? 'http://127.0.0.1:8000/expenses' 
        : `http://127.0.0.1:8000/expenses?category=${filter}`;
      const res = await axios.get(url);
      setExpenses(res.data);
    } catch (err) { console.error("Sync Error", err); }
  };

  useEffect(() => { fetchExpenses(); }, [filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const amountInPaise = Math.round(parseFloat(amount) * 100);
    const today = new Date().toISOString().split('T')[0];

    try {
      await axios.post(`http://127.0.0.1:8000/expenses?amount=${amountInPaise}&category=${category}&description=UserEntry&expense_date=${today}`);
      setAmount('');
      fetchExpenses();
    } catch (error) { alert("Network Error: Could not save."); }
    setLoading(false);
  };

  const deleteExpense = async (id) => {
    if (window.confirm("Delete this entry?")) {
      await axios.delete(`http://127.0.0.1:8000/expenses/${id}`);
      fetchExpenses();
    }
  };

  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0) / 100;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
              <Wallet size={32} /> SplitMint Tracker
            </h1>
            <p className="text-gray-500">Manage your personal finance with precision.</p>
          </div>
          <div className="bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-lg">
            <p className="text-indigo-100 text-sm uppercase font-semibold">Total Spent</p>
            <p className="text-3xl font-mono font-bold">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>
        </header>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
              <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0.00" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button type="submit" disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50">
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <><PlusCircle size={20}/> Add Expense</>}
            </button>
          </form>
        </div>

        {/* Filters and List */}
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-gray-400" />
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Filter By:</span>
          {['All', ...categories].map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${filter === cat ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-200'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Amount</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses.map(exp => (
                <tr key={exp.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{exp.date}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold uppercase tracking-tight">{exp.category}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">₹{(exp.amount / 100).toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteExpense(exp.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {expenses.length === 0 && <div className="p-12 text-center text-gray-400 font-medium">No expenses found for this category.</div>}
        </div>
      </div>
    </div>
  );
}

export default App;