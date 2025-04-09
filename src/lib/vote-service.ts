
import { toast } from "@/components/ui/use-toast";
import { supabaseService } from "./supabase-service";

export const voteService = {
  castVote: async (userId: string, partyId: string) => {
    try {
      // Check if user has already voted
      const user = await supabaseService.getUserById(userId);
      if (!user) {
        toast({
          variant: "destructive",
          title: "Vote Failed",
          description: "User not found.",
        });
        return null;
      }

      if (user.has_voted) {
        toast({
          variant: "destructive",
          title: "Vote Failed",
          description: "You have already cast your vote.",
        });
        return null;
      }

      // Cast the vote
      const vote = await supabaseService.createVote(userId, partyId);
      
      // Update local storage if the user is logged in
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.id === userId) {
            parsedUser.has_voted = true;
            localStorage.setItem("currentUser", JSON.stringify(parsedUser));
          }
        } catch (error) {
          console.error("Failed to update stored user:", error);
        }
      }

      toast({
        title: "Vote Successful",
        description: "Your vote has been recorded.",
      });
      
      return vote;
    } catch (error) {
      console.error("Vote casting error:", error);
      toast({
        variant: "destructive",
        title: "Vote Failed",
        description: "An error occurred while casting your vote.",
      });
      return null;
    }
  },

  getResults: async () => {
    try {
      const counts = await supabaseService.getVoteCountByParty();
      const parties = await supabaseService.getParties();
      
      return parties.map(party => ({
        party,
        count: counts[party.id] || 0
      })).sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error("Error getting vote results:", error);
      return [];
    }
  },

  getUserVote: async (userId: string) => {
    try {
      const votes = await supabaseService.getVotesByUserId(userId);
      if (!votes || votes.length === 0) {
        return null;
      }
      
      const vote = votes[0]; // Assuming one vote per user
      const party = await supabaseService.getPartyById(vote.party_id);
      
      if (!party) {
        return null;
      }
      
      return { vote, party };
    } catch (error) {
      console.error("Error getting user vote:", error);
      return null;
    }
  },
  
  getCurrentElection: async () => {
    return await supabaseService.getActiveElection();
  }
};
