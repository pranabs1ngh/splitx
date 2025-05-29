import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { User } from '../types';
import {Card, CardHeader, CardContent } from './ui/Card';
import {Button} from './ui/Button';
import Input from './ui/Input';
import { Loader2 } from 'lucide-react';

interface AddExpenseFormProps {
  groupId: string;
  members: User[];
  currentUserId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({
  groupId,
  members,
  currentUserId,
  onSuccess,
  onCancel
}) => {
  const { addExpense, error } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(currentUserId);
  const [splitBetween, setSplitBetween] = useState<string[]>(members.map(member => member.id));
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !paidBy || splitBetween.length === 0) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addExpense(
        groupId,
        description,
        parseFloat(amount),
        paidBy,
        splitBetween
      );
      
      // Reset form
      setDescription('');
      setAmount('');
      setPaidBy(currentUserId);
      setSplitBetween(members.map(member => member.id));
      
      // Notify parent
      onSuccess();
    } catch (err) {
      console.error('Failed to add expense:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleMemberToggle = (memberId: string) => {
    if (splitBetween.includes(memberId)) {
      // If only one member is left, don't remove
      if (splitBetween.length > 1) {
        setSplitBetween(splitBetween.filter(id => id !== memberId));
      }
    } else {
      setSplitBetween([...splitBetween, memberId]);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-medium text-white">Add New Expense</h3>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <Input
            label="Description"
            id="description"
            placeholder="e.g., Dinner, Groceries, Rent"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          
          <Input
            label="Amount"
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Paid by
            </label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-black-500"
            >
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.id === currentUserId ? 'You' : member.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Split between
            </label>
            <div className="space-y-2 py-1 grid grid-cols-2 gap-2">
              {members.map((member) => (
                <div key={member.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`member-${member.id}`}
                    checked={splitBetween.includes(member.id)}
                    onChange={() => handleMemberToggle(member.id)}
                    className="h-4 w-4 text-black-600 focus:ring-black-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`member-${member.id}`}
                    className="ml-2 block text-sm text-gray-400"
                  >
                    {member.id === currentUserId ? 'You' : member.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4">
            <Button type="submit" fullWidth  disabled={isSubmitting} isLoading={isSubmitting}>
              Add Expense
              {isSubmitting && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
            </Button>
            <Button onClick={onCancel} variant="outline" disabled={isSubmitting} className='ml-2' fullWidth>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddExpenseForm;