import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { useData } from '../context/DataContext';
import Header from '../components/Header';
import {Card, CardHeader, CardContent } from '../components/ui/Card';
import {Button} from '../components/ui/Button';
import Input from '../components/ui/Input';

const CreateGroup: React.FC = () => {
  const navigate = useNavigate();
  const { createGroup, isLoading, error } = useData();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) return;
    
    try {
      const newGroup = await createGroup(name, description);
      navigate(`/groups/${newGroup.id}`);
    } catch (err) {
      console.error('Failed to create group:', err);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Create a New Group</h1>
            <p className="text-gray-600">Start tracking expenses with friends, roommates, or anyone</p>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-black-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-black-600" />
                </div>
                <h2 className="ml-3 text-lg font-medium text-white">Group Details</h2>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                    {error}
                  </div>
                )}
                
                <Input
                  label="Group Name"
                  id="name"
                  placeholder="e.g., Trip to Paris, Roommates, Lunch Group"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mb-6"
                />
                
                <div className="mb-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Add some details about this group..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-black-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/groups')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    disabled={!name}
                  >
                    Create Group
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateGroup;