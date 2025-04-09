
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Info } from "lucide-react";
import { db } from "@/lib/db";
import { format } from "date-fns";
import Layout from "@/components/Layout";

const Elections: React.FC = () => {
  const elections = db.getElections();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Current & Upcoming Elections</h1>
          <p className="text-gray-600 mb-8">
            View information about active and upcoming elections you can participate in.
          </p>

          <div className="space-y-6">
            {elections.length > 0 ? (
              elections.map((election) => (
                <Card key={election.id} className={election.isActive ? "border-vote-blue" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{election.title}</CardTitle>
                      <Badge 
                        variant={election.isActive ? "default" : "secondary"}
                        className={election.isActive ? "bg-green-500" : ""}
                      >
                        {election.isActive ? "Active" : "Ended"}
                      </Badge>
                    </div>
                    <CardDescription>{election.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Calendar size={20} className="mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Election Date</p>
                          <p className="font-medium">
                            {format(election.startDate, "MMMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock size={20} className="mr-2 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Voting Hours</p>
                          <p className="font-medium">
                            {format(election.startDate, "h:mm a")} - {format(election.endDate, "h:mm a")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {election.isActive && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-md flex items-start">
                        <Info size={18} className="text-vote-blue mr-2 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium text-vote-blue">This election is currently active</p>
                          <p className="text-gray-700">
                            Log in with your Voter ID to cast your vote before the election ends.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter>
                    {election.isActive ? (
                      <Button asChild className="bg-vote-blue hover:bg-blue-800 w-full">
                        <Link to="/login">Log In to Vote</Link>
                      </Button>
                    ) : (
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/results">View Results</Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <p className="text-gray-500">No elections are currently scheduled.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Elections;
