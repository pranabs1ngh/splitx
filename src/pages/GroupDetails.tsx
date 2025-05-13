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
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';

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
  }, [id, user?.id]);

  const refreshGroupDetails = async () => {
    if (!id || !user) return;
    
    try {
      const details = await getGroupDetails(id);
      setGroupDetails(details);
    } catch (err) {
      console.error('Error refreshing group details:', err);
    }
  };

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
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-muted-foreground">Please log in to view group details.</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-grow py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Group header */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-foreground">{groupDetails?.name}</h1>
                    <p className="mt-1 text-muted-foreground">{groupDetails?.description}</p>
                    <div className="mt-2 flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{groupDetails?.members.length} members</span>
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
              )}
            </CardContent>
          </Card>
          
          {/* Tabs and content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Tabs defaultValue="expenses" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="expenses" className="flex-1">Expenses</TabsTrigger>
                  <TabsTrigger value="balances" className="flex-1">Balances</TabsTrigger>
                  <TabsTrigger value="members" className="flex-1">Members</TabsTrigger>
                </TabsList>
                
                <TabsContent value="expenses">
                  {isLoading ? (
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center space-x-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-3 w-1/2" />
                            </div>
                            <Skeleton className="h-6 w-24" />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ) : (
                    <ExpenseList
                      expenses={groupDetails?.expenses || []}
                      isLoading={isLoading}
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="balances">
                  {isLoading ? (
                    <Card>
                      <CardContent className="pt-6 space-y-6">
                        <Skeleton className="h-8 w-48" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[1, 2].map((i) => (
                            <div key={i} className="p-4 border rounded-lg space-y-2">
                              <Skeleton className="h-6 w-32" />
                              <Skeleton className="h-8 w-24" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <BalanceSummary
                      balances={groupDetails?.balances || {}}
                      currentUserId={user.id}
                      isLoading={isLoading}
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="members">
                  {isLoading ? (
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center space-x-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="pt-6">
                        <ul className="divide-y divide-border">
                          {groupDetails?.members.map((member) => (
                            <li key={member.id} className="py-4 first:pt-0 last:pb-0">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <UserIcon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-foreground">
                                    {member.id === user.id ? `${member.name} (You)` : member.name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">{member.email}</p>
                                </div>
                                {groupDetails.createdBy === member.id && (
                                  <span className="ml-2 px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
                                    Creator
                                  </span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right column - Forms */}
            <div>
              {isAddingExpense && groupDetails && (
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
              
              {isAddingSettlement && groupDetails && (
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
                  <CardHeader>
                    <h3 className="text-lg font-medium">Add Member to Group</h3>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleInvite}>
                      {inviteError && (
                        <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md">
                          {inviteError}
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="inviteName" className="text-sm font-medium">
                            Full Name
                          </label>
                          <Input
                            id="inviteName"
                            placeholder="John Doe"
                            value={inviteName}
                            onChange={(e) => setInviteName(e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="inviteEmail" className="text-sm font-medium">
                            Email Address (Optional)
                          </label>
                          <Input
                            id="inviteEmail"
                            type="email"
                            placeholder="friend@example.com"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                          />
                        </div>
                        
                        <div className="flex space-x-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsInviting(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={!inviteName || isSubmittingInvite}
                          >
                            {isSubmittingInvite ? 'Adding...' : 'Add Member'}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
              
              {!isAddingExpense && !isAddingSettlement && !isInviting && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Button
                        className="w-full"
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
                        className="w-full"
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
                        className="w-full"
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
                  </CardContent>
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