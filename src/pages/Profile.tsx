import React, { useState } from 'react';
import { User, Mail, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import {Card, CardHeader, CardContent } from '../components/ui/Card';
import {Button} from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, would save changes to the backend
    setIsEditing(false);
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Your Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>
          
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-white">Profile Information</h2>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
                  <div className="relative">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="h-32 w-32 rounded-full object-cover border-2 border-white shadow-md"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    {isEditing && (
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 bg-black-600 p-2 rounded-full text-white shadow-md hover:bg-black-700 transition-colors"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  {isEditing ? (
                    <form onSubmit={handleSaveProfile}>
                      <Input
                        label="Full Name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                      <Input
                        label="Email Address"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <div className="mt-6 flex space-x-3">
                        <Button type="submit">
                          Save Changes
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setName(user.name);
                            setEmail(user.email);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-500">Name</span>
                        </div>
                        <p className="mt-1 text-white">{user.name}</p>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-500">Email</span>
                        </div>
                        <p className="mt-1 text-white">{user.email}</p>
                      </div>
                      <div className="pt-4">
                        <Button onClick={() => setIsEditing(true)}>
                          Edit Profile
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-white">Account Settings</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-medium text-white">Password</h3>
                    <p className="text-sm text-gray-500 mt-1">Update your password to keep your account secure.</p>
                    <Button 
                      variant="outline" 
                      className="mt-3"
                      onClick={() => navigate('/reset-password')}
                    >
                      Change Password
                    </Button>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-base font-medium text-white">Notifications</h3>
                    <p className="text-sm text-gray-500 mt-1">Manage how we contact you about account activity.</p>
                    <div className="mt-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-black-600 focus:ring-black-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <span className="ml-2 text-sm text-gray-400">Email notifications for new expenses</span>
                      </label>
                    </div>
                    <div className="mt-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-black-600 focus:ring-black-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <span className="ml-2 text-sm text-gray-400">Email notifications for settlements</span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardContent>
                <h3 className="text-base font-medium text-red-700">Danger Zone</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="danger" className="mt-3">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;