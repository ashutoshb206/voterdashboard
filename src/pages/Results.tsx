
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { voteService } from "@/lib/vote-service";
import Layout from "@/components/Layout";
import { useQuery } from '@tanstack/react-query';

const Results: React.FC = () => {
  const [totalVotes, setTotalVotes] = useState(0);
  
  // Use React Query to fetch results data
  const { data: results = [], isLoading, error } = useQuery({
    queryKey: ['voteResults'],
    queryFn: voteService.getResults,
  });

  // Use React Query to fetch active election
  const { data: activeElection } = useQuery({
    queryKey: ['activeElection'],
    queryFn: voteService.getCurrentElection,
  });
  
  useEffect(() => {
    const total = results.reduce((sum, result) => sum + result.count, 0);
    setTotalVotes(total);
  }, [results]);

  // Format data for recharts
  const chartData = results.map(result => ({
    name: result.party.name,
    votes: result.count
  }));

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6">Loading results...</h1>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-2">Error Loading Results</h1>
            <p className="text-gray-600 mb-8">
              There was a problem loading the election results.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Election Results</h1>
          
          {activeElection ? (
            <p className="text-gray-600 mb-8">
              Current results for {activeElection.title}
            </p>
          ) : (
            <p className="text-gray-600 mb-8">
              No active election data available.
            </p>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Vote Distribution</CardTitle>
              <CardDescription>
                Total votes: {totalVotes}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="votes" fill="#0047AB" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Results</CardTitle>
              <CardDescription>
                Breakdown of votes by party
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results.length > 0 ? (
                <div className="space-y-6">
                  {results.map((result) => {
                    const percentage = totalVotes > 0 
                      ? Math.round((result.count / totalVotes) * 100) 
                      : 0;
                    
                    return (
                      <div key={result.party.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-vote-lightGray rounded-full flex items-center justify-center mr-2">
                              {result.party.logo_url ? (
                                <img 
                                  src={result.party.logo_url} 
                                  alt={`${result.party.name} logo`} 
                                  className="w-6 h-6 object-contain" 
                                />
                              ) : (
                                <span className="text-xs font-bold">{result.party.name.charAt(0)}</span>
                              )}
                            </div>
                            <span className="font-medium">{result.party.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold">{percentage}%</span>
                            <span className="text-gray-500 text-sm ml-2">({result.count} votes)</span>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No votes have been cast yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Results;
