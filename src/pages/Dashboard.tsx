import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Plus, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Header from '../components/Header';
import GroupCard from '../components/GroupCard';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { GroupWithDetails } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { groups, getGroupDetails } = useData();
  const [recentActivity, setRecentActivity] = useState<{
    type: 'expense' | 'settlement';
    description: string;
    amount: number;
    date: string;
    groupId: string;
    groupName: string;
  }[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  // Calculate total balance
  const calculateTotalBalance = (groupDetails: GroupWithDetails) => {
    if (!user) return 0;
    
    const userBalance = groupDetails.balances[user.id];
    return userBalance ? userBalance.amount : 0;
  };
  
  useEffect(() => {
    const fetchRecentActivity = async () => {
      if (!user) return;
      
      try {
        setIsLoadingActivity(true);
        const activities: typeof recentActivity = [];
        
        // Only fetch details for the most recent groups
        const groupsToFetch = groups.slice(0, 3);
        
        for (const group of groupsToFetch) {
          const details = await getGroupDetails(group.id);
          if (!details) continue;
          
          // Combine expenses and settlements
          const groupActivities = [
            ...details.expenses.map(expense => ({
              type: 'expense' as const,
              description: expense.description,
              amount: expense.amount,
              date: expense.date,
              groupId: group.id,
              groupName: group.name,
            })),
            ...details.settlements.map(settlement => ({
              type: 'settlement' as const,
              description: `Settlement between members`,
              amount: settlement.amount,
              date: settlement.date,
              groupId: group.id,
              groupName: group.name,
            })),
          ];
          
          activities.push(...groupActivities);
        }
        
        // Sort by date (newest first) and update state
        const sortedActivities = activities.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setRecentActivity(sortedActivities);
      } catch (err) {
        console.error('Error fetching activity:', err);
      } finally {
        setIsLoadingActivity(false);
      }
    };
    
    fetchRecentActivity();
  }, [groups, user?.id]); // Only re-run when groups or user ID changes
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-gray-600">Please log in to view the dashboard.</div>
        </main>
      </div>
    );
  }
  
  // Sort and limit recent activity
  const sortedActivity = recentActivity.slice(0, 5);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name.split(' ')[0]}!</h1>
            <p className="text-gray-600">Here's what's happening with your expenses</p>
          </div>
          
          {/* Quick actions */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
              <CardBody>
                <h2 className="text-lg font-semibold mb-2">Create a New Group</h2>
                <p className="text-teal-50 mb-4">Start tracking expenses with friends or roommates</p>
                <Link to="/groups/new">
                  <Button variant="outline" className="bg-white text-teal-600 hover:bg-teal-50">
                    <Plus className="h-4 w-4 mr-1" />
                    New Group
                  </Button>
                </Link>
              </CardBody>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardBody>
                <h2 className="text-lg font-semibold mb-2">Add an Expense</h2>
                <p className="text-purple-50 mb-4">Record a new expense in any of your groups</p>
                <Link to="/groups">
                  <Button variant="outline" className="bg-white text-purple-600 hover:bg-purple-50">
                    <CreditCard className="h-4 w-4 mr-1" />
                    Add Expense
                  </Button>
                </Link>
              </CardBody>
            </Card>
            
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardBody>
                <h2 className="text-lg font-semibold mb-2">View Activity</h2>
                <p className="text-orange-50 mb-4">See all recent expenses and settlements</p>
                <Link to="/activity">
                  <Button variant="outline" className="bg-white text-orange-600 hover:bg-orange-50">
                    <ArrowRight className="h-4 w-4 mr-1" />
                    View All
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </div>
          
          {/* Recent groups */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Groups</h2>
              <Link to="/groups" className="text-teal-600 font-medium hover:text-teal-500">
                View all
              </Link>
            </div>
            
            {groups.length === 0 ? (
              <Card className="bg-white">
                <CardBody className="text-center py-12">
                  <CreditCard className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No groups yet</h3>
                  <p className="mt-1 text-gray-500">
                    Create your first group to start tracking expenses.
                  </p>
                  <div className="mt-6">
                    <Link to="/groups/new">
                      <Button>
                        <Plus className="h-4 w-4 mr-1" />
                        Create Group
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.slice(0, 3).map((group) => (
                  <GroupCard key={group.id} group={group} />
                ))}
                
                {groups.length > 3 && (
                  <Link
                    to="/groups"
                    className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors"
                  >
                    <span className="text-gray-600 font-medium">View all groups</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                )}
              </div>
            )}
          </div>
          
          {/* Recent activity */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <Link to="/activity" className="text-teal-600 font-medium hover:text-teal-500">
                View all
              </Link>
            </div>
            
            {isLoadingActivity ? (
              <Card className="bg-white">
                <div className="divide-y divide-gray-200">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="p-4">
                      <div className="animate-pulse flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                        <div className="ml-4 flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="h-5 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ) : sortedActivity.length === 0 ? (
              <Card className="bg-white">
                <CardBody className="text-center py-10">
                  <p className="text-gray-500">No recent activity</p>
                </CardBody>
              </Card>
            ) : (
              <Card className="bg-white divide-y divide-gray-200">
                {sortedActivity.map((activity, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        activity.type === 'expense' ? 'bg-purple-100' : 'bg-green-100'
                      }`}>
                        <CreditCard className={`h-5 w-5 ${
                          activity.type === 'expense' ? 'text-purple-600' : 'text-green-600'
                        }`} />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                            <p className="text-xs text-gray-500">
                              {activity.groupName} • {formatDate(activity.date)}
                            </p>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(activity.amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;