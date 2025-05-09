import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Users, BarChart, Layers, Check, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/ui/Button';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero section */}
        <div className="relative bg-gradient-to-r from-teal-500 to-teal-700 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="md:flex md:items-center md:space-x-8">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                  Split expenses with friends without the awkwardness
                </h1>
                <p className="mt-4 text-xl text-teal-50">
                  Track who owes what, settle up, and move on. AppSplitting makes it easy to share expenses with friends, roommates, or anyone.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4">
                  <Link to="/auth?register=true">
                    <Button size="lg" className="mb-4 sm:mb-0">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button variant="outline" size="lg" className="bg-white">
                      Log In
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="bg-white rounded-lg shadow-xl p-6 transform rotate-2 transition-transform hover:rotate-0">
                  <div className="text-2xl font-semibold text-gray-900 mb-4">Trip to Paris</div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-600">JD</span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">John paid for dinner</div>
                          <div className="text-xs text-gray-500">April 15</div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">$120.00</div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-teal-600">JS</span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">Jane paid for taxi</div>
                          <div className="text-xs text-gray-500">April 16</div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">$45.00</div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-teal-50 rounded-md">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">Mike settled up with John</div>
                          <div className="text-xs text-gray-500">April 17</div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">$40.00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Features that make expense splitting easy</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                AppSplitting simplifies the process of tracking expenses and settling debts within groups.
              </p>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="relative p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="h-12 w-12 rounded-md bg-teal-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Groups</h3>
                <p className="text-gray-600">
                  Organize expenses by creating groups for trips, roommates, events, or any shared experience.
                </p>
              </div>
              
              <div className="relative p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="h-12 w-12 rounded-md bg-purple-100 flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Expenses</h3>
                <p className="text-gray-600">
                  Add expenses, specify who paid, and split costs equally among group members.
                </p>
              </div>
              
              <div className="relative p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="h-12 w-12 rounded-md bg-orange-100 flex items-center justify-center mb-4">
                  <BarChart className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Balance Calculation</h3>
                <p className="text-gray-600">
                  See who owes what to whom with automatic balance calculations that update in real-time.
                </p>
              </div>
              
              <div className="relative p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="h-12 w-12 rounded-md bg-green-100 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Record Settlements</h3>
                <p className="text-gray-600">
                  Keep track of payments between members and see your balance update automatically.
                </p>
              </div>
              
              <div className="relative p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center mb-4">
                  <Layers className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Expense History</h3>
                <p className="text-gray-600">
                  View a chronological history of all expenses and settlements within your groups.
                </p>
              </div>
              
              <div className="relative p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-gray-600">
                    <path d="M3 3v18h18"></path>
                    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Simplified Interface</h3>
                <p className="text-gray-600">
                  A clean, intuitive interface that makes expense splitting easy for everyone in your group.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Ready to start splitting expenses?</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands of users who have simplified their shared expenses with AppSplitting.
              </p>
              <div className="mt-8">
                <Link to="/auth?register=true">
                  <Button size="lg">
                    Get Started for Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-teal-400" />
                <span className="ml-2 text-xl font-bold text-white">AppSplitting</span>
              </div>
              <p className="mt-4 text-gray-300">
                Simplifying the way friends, roommates, and travelers split expenses.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">How it works</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-teal-400 transition-colors">About us</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-300">&copy; {new Date().getFullYear()} AppSplitting. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;