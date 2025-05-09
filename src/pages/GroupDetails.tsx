import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, Mail, User as UserIcon, Plus, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { GroupWithDetails } from '../types';
import Header from '../components/Header';
import ExpenseList from '../components/ExpenseList';
import BalanceSummary from '../components/BalanceSummary';
import AddExpenseForm from '../components/AddExpenseForm';
import AddSettlementForm from '../components/AddSettlementForm';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const GroupDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getGroupDetails, inviteToGroup, error } = useData();
  const [groupDetails, setGroupDetails] = useState<GroupWithDetails | null>(null);
  const [activeTab, setActiveTab] = useState<'expenses' | 'balances' | 'members'>('expenses');
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isAddingSettlement, setIsAddingSettlement] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load group details
  useEffect(() => {
    let isMounted = true;
    
    const fetchGroupDetails = async () => {
      if (!id || !user) return;
      
      try {
        setIsLoading(true);
        const details = await getGroupDetails(id);
        if (isMounted) {
          setGroupDetails(details);
        }
      } catch (err) {
        console.error('Error fetching group details:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchGroupDetails();
    
    return () => {
      isMounted = false;
    };
  }, [id, user?.id]); // Only re-fetch when group ID or user ID changes
  
  // Refresh group details
  const refreshGroupDetails = async () => {
    if (!id || !user) return;
    
    try {
      const details = await getGroupDetails(id);
      setGroupDetails(details);
    } catch (err) {
      console.error('Error refreshing group details:', err);
    }
  };
  
  // Handle invite
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    
    if (!id || !inviteName) {
      setInviteError('Name is required');
      return;
    }
    
    setIsSubmittingInvite(true);
    try {
      const success = await inviteToGroup(id, inviteEmail || undefined, inviteName);
      if (success) {
        setInviteName('');
        setInviteEmail('');
        setIsInviting(false);
        refreshGroupDetails();
      } else {
        setInviteError('Failed to add user to group.');
      }
    } catch (err) {
      setInviteError((err as Error).message);
    } finally {
      setIsSubmittingInvite(false);
    }
  };
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-gray-600">Please log in to view group details.</div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-10">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!groupDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-gray-600">Group not found.</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Group header */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:items-center">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{groupDetails.name}</h1>
                <p className="mt-1 text-gray-600">{groupDetails.description}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{groupDetails.members.length} members</span>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    setIsAddingExpense(true);
                    setIsAddingSettlement(false);
                    setIsInviting(false);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Expense
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingSettlement(true);
                    setIsAddingExpense(false);
                    setIsInviting(false);
                  }}
                >
                  Record Settlement
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsInviting(true);
                    setIsAddingExpense(false);
                    setIsAddingSettlement(false);
                  }}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Add Member
                </Button>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="border-t border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('expenses')}
                  className={`py-4 px-6 text-sm font-medium transition-colors ${
                    activeTab === 'expenses'
                      ? 'border-b-2 border-teal-500 text-teal-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Expenses
                </button>
                <button
                  onClick={() => setActiveTab('balances')}
                  className={`py-4 px-6 text-sm font-medium transition-colors ${
                    activeTab === 'balances'
                      ? 'border-b-2 border-teal-500 text-teal-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Balances
                </button>
                <button
                  onClick={() => setActiveTab('members')}
                  className={`py-4 px-6 text-sm font-medium transition-colors ${
                    activeTab === 'members'
                      ? 'border-b-2 border-teal-500 text-teal-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Members
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Expenses/Balances/Members */}
            <div className="md:col-span-2">
              {activeTab === 'expenses' && (
                <div>
                  <ExpenseList
                    expenses={groupDetails.expenses}
                    isLoading={isLoading}
                  />
                </div>
              )}
              
              {activeTab === 'balances' && (
                <div>
                  <BalanceSummary
                    balances={groupDetails.balances}
                    currentUserId={user.id}
                    isLoading={isLoading}
                  />
                </div>
              )}
              
              {activeTab === 'members' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Group Members</h2>
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    {isLoading ? (
                      <div className="animate-pulse">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-4 border-b border-gray-200">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                              <div className="ml-3">
                                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-24"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {groupDetails.members.map((member) => (
                          <li key={member.id} className="p-4 hover:bg-gray-50">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <UserIcon className="h-5 w-5 text-gray-600" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">
                                  {member.id === user.id ? `${member.name} (You)` : member.name}
                                </p>
                                <p className="text-sm text-gray-500">{member.email}</p>
                              </div>
                              {groupDetails.createdBy === member.id && (
                                <span className="ml-2 px-2 py-1 text-xs font-medium text-teal-800 bg-teal-100 rounded-full">
                                  Creator
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Right column - Forms */}
            <div>
              {isAddingExpense && (
                <AddExpenseForm
                  groupId={groupDetails.id}
                  members={groupDetails.members}
                  currentUserId={user.id}
                  onSuccess={() => {
                    setIsAddingExpense(false);
                    refreshGroupDetails();
                  }}
                />
              )}
              
              {isAddingSettlement && (
                <AddSettlementForm
                  groupId={groupDetails.id}
                  members={groupDetails.members}
                  balances={groupDetails.balances}
                  currentUserId={user.id}
                  onSuccess={() => {
                    setIsAddingSettlement(false);
                    refreshGroupDetails();
                  }}
                />
              )}
              
              {isInviting && (
                <Card>
                  <CardBody>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add Member to Group</h3>
                    <form onSubmit={handleInvite}>
                      {inviteError && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                          {inviteError}
                        </div>
                      )}
                      
                      <Input
                        label="Full Name"
                        id="inviteName"
                        placeholder="John Doe"
                        value={inviteName}
                        onChange={(e) => setInviteName(e.target.value)}
                        required
                      />

                      <Input
                        label="Email Address (Optional)"
                        id="inviteEmail"
                        type="email"
                        placeholder="friend@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                      
                      <div className="mt-4 flex space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsInviting(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          isLoading={isSubmittingInvite}
                          disabled={!inviteName}
                        >
                          Add Member
                        </Button>
                      </div>
                    </form>
                  </CardBody>
                </Card>
              )}
              
              {!isAddingExpense && !isAddingSettlement && !isInviting && (
                <Card>
                  <CardBody>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Quick Actions</h3>
                    <div className="space-y-3">
                      <Button
                        fullWidth
                        onClick={() => {
                          setIsAddingExpense(true);
                          setIsAddingSettlement(false);
                          setIsInviting(false);
                        }}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Add an Expense
                      </Button>
                      <Button
                        variant="outline"
                        fullWidth
                        onClick={() => {
                          setIsAddingSettlement(true);
                          setIsAddingExpense(false);
                          setIsInviting(false);
                        }}
                      >
                        Record a Settlement
                      </Button>
                      <Button
                        variant="outline"
                        fullWidth
                        onClick={() => {
                          setIsInviting(true);
                          setIsAddingExpense(false);
                          setIsAddingSettlement(false);
                        }}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Add Member
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GroupDetails;