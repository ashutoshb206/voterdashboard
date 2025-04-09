
import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-vote-darkGray text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">eVote Portal</h3>
            <p className="text-gray-300">
              Secure and accessible online voting platform for modern elections.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-vote-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/elections" className="text-gray-300 hover:text-vote-gold transition-colors">
                  Elections
                </Link>
              </li>
              <li>
                <Link to="/vote" className="text-gray-300 hover:text-vote-gold transition-colors">
                  Cast Vote
                </Link>
              </li>
              <li>
                <Link to="/results" className="text-gray-300 hover:text-vote-gold transition-colors">
                  Results
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <address className="not-italic text-gray-300">
              <p>123 Democracy Street</p>
              <p>Washington, DC 20001</p>
              <p>Email: info@evoteportal.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
          <p>© {new Date().getFullYear()} eVote Portal. All rights reserved.</p>
          <div className="mt-2">
            <Link to="/privacy" className="text-gray-400 hover:text-vote-gold transition-colors mx-2">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-vote-gold transition-colors mx-2">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
