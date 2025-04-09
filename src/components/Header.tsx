
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Check, LogOut, Vote } from "lucide-react";

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-vote-blue text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <Vote size={24} />
          <span>eVote Portal</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-vote-gold transition-colors">
            Home
          </Link>
          <Link to="/elections" className="hover:text-vote-gold transition-colors">
            Elections
          </Link>
          {currentUser && (
            <>
              <Link to="/vote" className="hover:text-vote-gold transition-colors">
                Cast Vote
              </Link>
              <Link to="/results" className="hover:text-vote-gold transition-colors">
                Results
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <span>
                  Hello, {currentUser.name}
                </span>
                {currentUser.has_voted && (
                  <span className="bg-green-500 text-white p-1 rounded-full">
                    <Check size={16} />
                  </span>
                )}
              </div>
              <Button 
                variant="ghost" 
                className="text-white hover:text-vote-gold"
                onClick={logout}
              >
                <LogOut size={20} className="mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Button asChild variant="outline" className="bg-white text-vote-blue hover:bg-vote-gold hover:text-vote-blue">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
