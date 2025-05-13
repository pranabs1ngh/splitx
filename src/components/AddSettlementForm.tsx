import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { User, Balance } from '../types';
import { Card, CardHeader, CardContent } from './ui/Card';
import {Button} from './ui/Button';
import Input from './ui/Input';

interface AddSettlementFormProps {
  groupId: string;
  members: User[];
  balances: Record<string, Balance>;
  currentUserId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const AddSettlementForm: React.FC<AddSettlementFormProps> = ({
  groupId,
  members,
  balances,
  currentUserId,
  onSuccess,
  onCancel
}) => {
  const { addSettlement, error } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fromUser, setFromUser] = useState('');
  const [toUser, setToUser] = useState('');
  const [amount, setAmount] = useState('');
  
  // Get users who owe money (negative balance)
  const debtors = members.filter(member => {
    const balance = balances[member.id];
    return balance && balance.amount < 0;
  });
  
  // Get users who are owed money (positive balance)
  const creditors = members.filter(member => {
    const balance = balances[member.id];
    return balance && balance.amount > 0;
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fromUser || !toUser || !amount) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addSettlement(
        groupId,
        fromUser,
        toUser,
        parseFloat(amount)
      );
      
      // Reset form
      setFromUser('');
      setToUser('');
      setAmount('');
      
      // Notify parent
      onSuccess();
    } catch (err) {
      console.error('Failed to add settlement:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };
  
  // Get the suggested amount for settlement
  const getSuggestedAmount = () => {
    if (!fromUser || !toUser) return '';
    
    const fromUserBalance = balances[fromUser];
    const toUserBalance = balances[toUser];
    
    if (!fromUserBalance || !toUserBalance) return '';
    
    // The amount should be the minimum of what the debtor owes and what the creditor is owed
    const debtAmount = Math.abs(fromUserBalance.amount);
    const creditAmount = Math.abs(toUserBalance.amount);
    
    return Math.min(debtAmount, creditAmount).toFixed(2);
  };
  
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-medium text-white">Record a Settlement</h3>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Who paid?
            </label>
            <select
              value={fromUser}
              onChange={(e) => {
                setFromUser(e.target.value);
                // Auto-suggest amount when both users are selected
                if (toUser) {
                  const suggestedAmount = getSuggestedAmount();
                  if (suggestedAmount) setAmount(suggestedAmount);
                }
              }}
              className="w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-black-500"
            >
              <option value="">Select who paid</option>
              {debtors.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.id === currentUserId ? 'You' : member.name} 
                  {balances[member.id] && ` (owes ${formatCurrency(balances[member.id].amount)})`}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Who received the payment?
            </label>
            <select
              value={toUser}
              onChange={(e) => {
                setToUser(e.target.value);
                // Auto-suggest amount when both users are selected
                if (fromUser) {
                  const suggestedAmount = getSuggestedAmount();
                  if (suggestedAmount) setAmount(suggestedAmount);
                }
              }}
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-black-500"
            >
              <option value="">Select who received</option>
              {creditors.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.id === currentUserId ? 'You' : member.name}
                  {balances[member.id] && ` (is owed ${formatCurrency(balances[member.id].amount)})`}
                </option>
              ))}
            </select>
          </div>
          
          <Input
            label="Amount"
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          
          <div className="mt-4">
            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
              disabled={!fromUser || !toUser || !amount}
            >
              Record Settlement
            </Button>
            <Button onClick={onCancel} variant="outline" className='ml-2'>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddSettlementForm;