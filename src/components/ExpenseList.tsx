import React from 'react';
import { CreditCard, User } from 'lucide-react';
import { Expense } from '../types';
import Card, { CardBody } from './ui/Card';

interface ExpenseListProps {
  expenses: Expense[];
  isLoading?: boolean;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, isLoading = false }) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center animate-pulse">
              <div className="mb-4 sm:mb-0">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
              </div>
              <div className="sm:ml-4 flex-1">
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6">
                <div className="h-6 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8">
        <CreditCard className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No expenses yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Add your first expense to start tracking.
        </p>
      </div>
    );
  }

  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedExpenses.map((expense) => (
        <Card key={expense.id} className="overflow-hidden">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center">
            <div className="mb-4 sm:mb-0">
              <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-teal-600" />
              </div>
            </div>
            
            <div className="sm:ml-4 flex-1">
              <h4 className="text-lg font-medium text-gray-900">{expense.description}</h4>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <User className="h-4 w-4 mr-1" />
                <span>
                  Paid by <span className="font-medium">{expense.profiles.name}</span>
                </span>
                <span className="mx-2">•</span>
                <span>{formatDate(expense.date)}</span>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                Split between {expense.expense_splits.length} people
              </div>
            </div>
            
            <div className="mt-4 sm:mt-0 sm:ml-6">
              <span className="text-xl font-semibold text-gray-900">
                {formatCurrency(expense.amount)}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ExpenseList;