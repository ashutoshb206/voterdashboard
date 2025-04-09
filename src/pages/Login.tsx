
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Vote, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { createTestUser } from "@/lib/create-test-data";

const Login: React.FC = () => {
  const [voterId, setVoterId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Create test users on page load
  useEffect(() => {
    createTestUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!voterId.trim()) {
      setError("Voter ID is required");
      setIsLoading(false);
      return;
    }

    console.log(`Attempting to log in with voter ID: ${voterId}`);
    
    try {
      const user = await login(voterId);
      console.log("Login response:", user);
      
      if (user) {
        console.log("Login successful, navigating to home");
        navigate("/");
      } else {
        console.error("Login failed: user is null");
        setError("Invalid Voter ID. Please try again. Make sure to use one of the test IDs listed below.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(`Login failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-vote-lightGray flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-vote-blue rounded-full flex items-center justify-center">
              <Vote className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Sign in to cast your vote
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your Voter ID to access the voting system
            </p>
          </div>

          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Voter Login</CardTitle>
                <CardDescription>
                  You can find your Voter ID on your voter registration card
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="voterId" className="block text-sm font-medium text-gray-700">
                      Voter ID
                    </label>
                    <Input
                      id="voterId"
                      name="voterId"
                      type="text"
                      required
                      value={voterId}
                      onChange={(e) => setVoterId(e.target.value)}
                      placeholder="Enter your Voter ID"
                      className="w-full"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 p-3 rounded-md text-red-700 text-sm flex items-start">
                      <Info size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="bg-blue-50 p-3 rounded-md text-sm">
                    <p className="font-medium text-vote-blue mb-1 flex items-center">
                      <Info size={16} className="mr-2" /> Test Login Details
                    </p>
                    <p className="mb-1">Available Voter IDs for testing:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>VOT12345</strong> - John Doe</li>
                      <li><strong>VOT67890</strong> - Jane Smith</li>
                      <li><strong>VOT54321</strong> - Bob Johnson</li>
                      <li><strong>VOT09876</strong> - Alice Williams</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-vote-blue hover:bg-blue-800"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Having trouble logging in? Contact the voter support helpline at 
              <a href="tel:1-800-555-VOTE" className="ml-1 text-vote-blue hover:text-blue-800">
                1-800-555-VOTE
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
