import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Users, BarChart, Layers, Check, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import { Button } from '../components/ui/button';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-grow">
        {/* Hero section */}
        <div className="relative bg-background overflow-hidden border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="md:flex md:items-center md:space-x-8">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  Split expenses with friends without the awkwardness
                </h1>
                <p className="mt-4 text-xl text-muted-foreground">
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
                    <Button variant="outline" size="lg">
                      Log In
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="bg-card rounded-lg shadow-xl p-6 transform rotate-2 transition-transform hover:rotate-0">
                  <div className="text-2xl font-semibold text-card-foreground mb-4">Trip to Paris</div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">JD</span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-card-foreground">John paid for dinner</div>
                          <div className="text-xs text-muted-foreground">April 15</div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-card-foreground">$120.00</div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">JS</span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-card-foreground">Jane paid for taxi</div>
                          <div className="text-xs text-muted-foreground">April 16</div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-card-foreground">$45.00</div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-accent rounded-md">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-card-foreground">Mike settled up with John</div>
                          <div className="text-xs text-muted-foreground">April 17</div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-card-foreground">$40.00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features section */}
        <div className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground">Features that make expense splitting easy</h2>
              <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
                AppSplitting simplifies the process of tracking expenses and settling debts within groups.
              </p>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Users className="h-6 w-6" />,
                  title: "Create Groups",
                  description: "Organize expenses by creating groups for trips, roommates, events, or any shared experience."
                },
                {
                  icon: <CreditCard className="h-6 w-6" />,
                  title: "Track Expenses",
                  description: "Add expenses, specify who paid, and split costs equally among group members."
                },
                {
                  icon: <BarChart className="h-6 w-6" />,
                  title: "Balance Calculation",
                  description: "See who owes what to whom with automatic balance calculations that update in real-time."
                },
                {
                  icon: <Check className="h-6 w-6" />,
                  title: "Record Settlements",
                  description: "Keep track of payments between members and see your balance update automatically."
                },
                {
                  icon: <Layers className="h-6 w-6" />,
                  title: "Expense History",
                  description: "View a chronological history of all expenses and settlements within your groups."
                }
              ].map((feature, index) => (
                <div key={index} className="relative p-6 bg-card rounded-lg border border-border shadow-sm">
                  <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* CTA section */}
        <div className="bg-muted py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground">Ready to start splitting expenses?</h2>
              <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
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
      
      <footer className="bg-background py-12 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-bold text-foreground">AppSplitting</span>
              </div>
              <p className="mt-4 text-muted-foreground">
                Simplifying the way friends, roommates, and travelers split expenses.
              </p>
            </div>
            
            {[
              {
                title: "Product",
                links: ["Features", "How it works", "Pricing", "FAQ"]
              },
              {
                title: "Company",
                links: ["About us", "Contact", "Careers", "Blog"]
              },
              {
                title: "Legal",
                links: ["Privacy Policy", "Terms of Service", "Cookie Policy"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h3 className="text-foreground font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-muted-foreground">&copy; {new Date().getFullYear()} AppSplitting. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;