import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Plus, ArrowRight, Users, BarChart, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Header from '../components/Header';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';

const CACHE_KEY = 'recent_activity_cache';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds

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
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  
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

  // Load cached activity
  const loadCachedActivity = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          return data;
        }
      }
    } catch (err) {
      console.error('Error loading cached activity:', err);
    }
    return null;
  };

  // Save activity to cache
  const saveActivityToCache = (activity: typeof recentActivity) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: activity,
        timestamp: Date.now()
      }));
    } catch (err) {
      console.error('Error saving activity to cache:', err);
    }
  };
  
  useEffect(() => {
    const fetchRecentActivity = async () => {
      if (!user) return;
      
      try {
        setIsLoadingActivity(true);
        
        // Try to load from cache first
        const cachedActivity = loadCachedActivity();
        if (cachedActivity) {
          setRecentActivity(cachedActivity);
          setIsLoadingActivity(false);
          return;
        }
        
        const activities: typeof recentActivity = [];
        
        const groupsToFetch = groups.slice(0, 3);
        
        for (const group of groupsToFetch) {
          const details = await getGroupDetails(group.id);
          if (!details) continue;
          
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
        
        const sortedActivities = activities.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setRecentActivity(sortedActivities);
        saveActivityToCache(sortedActivities);
      } catch (err) {
        console.error('Error fetching activity:', err);
      } finally {
        setIsLoadingActivity(false);
      }
    };
    
    fetchRecentActivity();
  }, [groups, user?.id]);

  // Set loading state for groups
  useEffect(() => {
    if (groups) {
      setIsLoadingGroups(false);
    }
  }, [groups]);
  
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-muted-foreground">Please log in to view the dashboard.</div>
        </main>
      </div>
    );
  }
  
  const sortedActivity = recentActivity.slice(0, 5);
  
  return (
    <div className="min-h-screen bg-background flex flex-col dark">
      <Header dark />
      
      <main className="flex-grow py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome section */}
          <div className="mb-8">
            <h1 className="text-2xl text-white font-bold">Welcome back, {user.name.split(' ')[0]}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your expenses</p>
          </div>
          
          {/* Quick actions */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Create a New Group</CardTitle>
                <CardDescription>Start tracking expenses with friends or roommates</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link to="/groups/new" className="w-full">
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    New Group
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Add an Expense</CardTitle>
                <CardDescription>Record a new expense in any of your groups</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link to="/groups" className="w-full">
                  <Button variant="outline" className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Expense
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>View Activity</CardTitle>
                <CardDescription>See all recent expenses and settlements</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link to="/activity" className="w-full">
                  <Button variant="outline" className="w-full">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
          
          {/* Recent groups */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Your Groups</h2>
              <Link to="/groups" className="text-primary hover:underline">
                View all
              </Link>
            </div>
            
            {isLoadingGroups ? (
              <Card>
                <CardContent className="py-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="py-4 animate-pulse">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-muted"></div>
                        <div className="ml-4 flex-1">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : groups.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-2 text-lg text-white font-medium">No groups yet</h3>
                  <p className="mt-1 text-muted-foreground">
                    Create your first group to start tracking expenses.
                  </p>
                  <div className="mt-6">
                    <Link to="/groups/new">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Group
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.slice(0, 3).map((group) => (
                  <Link key={group.id} to={`/groups/${group.id}`}>
                    <Card className="h-full hover:bg-muted/50 transition-colors">
                      <CardHeader>
                        <CardTitle>{group.name}</CardTitle>
                        <CardDescription className="line-clamp-2">{group.description}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{group.members?.length || 0} members</span>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          {/* Recent activity */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-white font-semibold">Recent Activity</h2>
              <Link to="/activity" className="text-primary hover:underline">
                View all
              </Link>
            </div>
            
            <Card>
              {isLoadingActivity ? (
                <CardContent className="py-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="py-4 animate-pulse">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-muted"></div>
                        <div className="ml-4 flex-1">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                        <div className="h-5 bg-muted rounded w-20"></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              ) : sortedActivity.length === 0 ? (
                <CardContent className="text-center py-10">
                  <p className="text-muted-foreground">No recent activity</p>
                </CardContent>
              ) : (
                <CardContent className="p-0">
                  {sortedActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="p-4 hover:bg-muted/50 transition-colors border-b last:border-0"
                    >
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-primary/10`}>
                          {activity.type === 'expense' ? (
                            <CreditCard className="h-5 w-5 text-primary" />
                          ) : (
                            <Check className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.groupName} • {formatDate(activity.date)}
                          </p>
                        </div>
                        <span className="font-medium">
                          {formatCurrency(activity.amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;