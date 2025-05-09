import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar } from 'lucide-react';
import { Group } from '../types';
import Card, { CardBody } from './ui/Card';

interface GroupCardProps {
  group: Group;
  isLoading?: boolean;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, isLoading = false }) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardBody>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Link to={`/groups/${group.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <CardBody>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>
          
          <div className="flex items-center text-sm text-gray-500 mt-auto">
            <Users className="h-4 w-4 mr-1" />
            <span>{group.members?.length || 0} members</span>
            
            <div className="ml-auto flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(group.createdAt)}</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
};

export default GroupCard;