import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Balance } from '../types';
import { Card, CardContent } from './ui/Card';

interface BalanceSummaryProps {
  balances: Record<string, Balance>;
  currentUserId: string;
  isLoading?: boolean;
}

const BalanceSummary: React.FC<BalanceSummaryProps> = ({
  balances,
  currentUserId,
  isLoading = false,
}) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  // Calculate total owed to the current user
  const totalOwed = Object.values(balances).reduce((total, balance) => {
    if (balance.userId === currentUserId && balance.amount > 0) {
      return total + balance.amount;
    }
    return total;
  }, 0);

  // Calculate total the current user owes
  const totalOwes = Object.values(balances).reduce((total, balance) => {
    if (balance.userId === currentUserId && balance.amount < 0) {
      return total + Math.abs(balance.amount);
    }
    return total;
  }, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-7 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent>
              <div className="flex items-center animate-pulse">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div className="ml-4">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center animate-pulse">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div className="ml-4">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl mt-4 font-semibold text-white">Balance Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className='pt-6'>
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <ArrowUpRight className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total owed to you</p>
                <h3 className="text-xl font-semibold text-white">{formatCurrency(totalOwed)}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className='pt-6'>
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <ArrowDownRight className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total you owe</p>
                <h3 className="text-xl font-semibold text-white">{formatCurrency(totalOwes)}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BalanceSummary;