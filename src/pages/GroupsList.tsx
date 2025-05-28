import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, CreditCard } from 'lucide-react';
import { useData } from '../context/DataContext';
import Header from '../components/Header';
import GroupCard from '../components/GroupCard';
import {Button} from '../components/ui/Button';
import {Card, CardContent } from '../components/ui/Card';

const GroupsList: React.FC = () => {
  const { groups } = useData();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Your Groups</h1>
            <Link to="/groups/new">
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                New Group
              </Button>
            </Link>
          </div>
          
          {groups.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="text-center py-12">
                <CreditCard className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-white">No groups yet</h3>
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
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GroupsList;