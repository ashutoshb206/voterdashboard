
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { voteService } from "@/lib/vote-service";
import { supabaseService } from "@/lib/supabase-service";
import PartyCard from "@/components/PartyCard";
import Layout from "@/components/Layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createTestUser } from "@/lib/create-test-data";

const Vote: React.FC = () => {
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voted, setVoted] = useState(false);
  const [userVote, setUserVote] = useState<any>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Create test user on page load for demo purposes
  useEffect(() => {
    createTestUser();
  }, []);

  // Fetch parties data
  const { data: parties = [] } = useQuery({
    queryKey: ['parties'],
    queryFn: supabaseService.getParties,
  });

  // Fetch active election
  const { data: activeElection } = useQuery({
    queryKey: ['activeElection'],
    queryFn: voteService.getCurrentElection,
  });

  // Cast vote mutation
  const castVoteMutation = useMutation({
    mutationFn: ({ userId, partyId }: { userId: string, partyId: string }) => 
      voteService.castVote(userId, partyId),
    onSuccess: (data) => {
      if (data && currentUser) {
        queryClient.invalidateQueries({ queryKey: ['voteResults'] });
        checkUserVote(currentUser.id);
      }
    }
  });

  // Check if user has already voted
  const checkUserVote = async (userId: string) => {
    const vote = await voteService.getUserVote(userId);
    if (vote) {
      setUserVote(vote);
      setVoted(true);
    }
  };

  useEffect(() => {
    // Check if user is logged in
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Check if user has already voted
    if (currentUser.has_voted) {
      checkUserVote(currentUser.id);
    }
  }, [currentUser, navigate]);

  const handleVote = async (partyId: string) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      await castVoteMutation.mutateAsync({ userId: currentUser.id, partyId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return null; // This will be handled by the useEffect redirect
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Cast Your Vote</h1>
          
          {activeElection ? (
            <p className="text-gray-600 mb-8">
              You are voting in the <strong>{activeElection.title}</strong>
            </p>
          ) : (
            <p className="text-gray-600 mb-8">
              No active election at the moment.
            </p>
          )}

          {!activeElection ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Active Election</AlertTitle>
              <AlertDescription>
                There is currently no active election. Please check back later.
              </AlertDescription>
            </Alert>
          ) : voted ? (
            <Alert className="bg-green-50 border-green-200 mb-8">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-700">Vote Successful!</AlertTitle>
              <AlertDescription>
                Thank you for participating in this election. Your vote for{" "}
                <strong>{userVote?.party?.name}</strong> has been recorded.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="default" className="bg-blue-50 border-blue-200 mb-8">
              <AlertTriangle className="h-4 w-4 text-vote-blue" />
              <AlertTitle className="text-vote-blue">Important Information</AlertTitle>
              <AlertDescription>
                You can only vote once in this election. Please review your choice carefully before submitting.
              </AlertDescription>
            </Alert>
          )}

          {activeElection && !voted && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {parties.map((party) => (
                <PartyCard
                  key={party.id}
                  party={party}
                  onVote={handleVote}
                  disabled={isSubmitting}
                />
              ))}
            </div>
          )}

          {voted && userVote && (
            <div className="mt-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Your Vote Receipt</h2>
              <div className="bg-white border rounded-lg p-6 max-w-md mx-auto">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                </div>
                <p className="text-gray-700 mb-2">
                  You voted for:
                </p>
                <p className="text-xl font-bold mb-4">
                  {userVote.party.name}
                </p>
                <p className="text-gray-500 text-sm">
                  Vote ID: {userVote.vote.id}
                </p>
                <p className="text-gray-500 text-sm">
                  Time: {new Date(userVote.vote.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Vote;
