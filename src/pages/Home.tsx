
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, Vote, Clock, Shield, Home as HomeIcon } from "lucide-react";
import Layout from "@/components/Layout";

const Home: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-vote-blue text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Vote Securely From The Comfort of Your Home
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Our online voting platform makes it easy to participate in democracy while ensuring your vote is secure and counted.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {currentUser ? (
              <>
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-vote-gold text-vote-darkGray hover:bg-yellow-400"
                >
                  <Link to="/vote">Cast Your Vote</Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white hover:text-vote-blue"
                >
                  <Link to="/results">View Results</Link>
                </Button>
              </>
            ) : (
              <>
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-vote-gold text-vote-darkGray hover:bg-yellow-400"
                >
                  <Link to="/login">Login to Vote</Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white hover:text-vote-blue"
                >
                  <Link to="/elections">View Elections</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-vote-lightGray">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Online Voting Platform?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-vote-blue text-white w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <HomeIcon size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Vote From Home</h3>
              <p className="text-gray-600">
                No need to travel to polling stations. Vote securely from the comfort of your home.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-vote-blue text-white w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Advanced encryption ensures your vote remains private and secure.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-vote-blue text-white w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Verification</h3>
              <p className="text-gray-600">
                Confirm your vote was counted correctly with our transparent system.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-vote-blue text-white w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Results</h3>
              <p className="text-gray-600">
                View election results as they come in with our real-time dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to Make Your Voice Heard?</h2>
            <p className="text-xl mb-8">
              Democracy works best when everyone participates. Register now to vote in upcoming elections.
            </p>
            <Button 
              asChild 
              size="lg" 
              className="bg-vote-blue hover:bg-blue-800"
            >
              <Link to={currentUser ? "/vote" : "/login"}>
                {currentUser ? "Cast Your Vote" : "Login Now"}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
