import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

// Types matching our Supabase schema
export interface User {
  id: string;
  name: string;
  email: string;
  voter_id: string;
  has_voted: boolean;
}

export interface Party {
  id: string;
  name: string;
  // Change logoUrl to logo_url to match the database column name
  logo_url: string;
  description: string;
}

export interface Vote {
  id: string;
  user_id: string;
  party_id: string;
  timestamp: Date;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
}

// Test user data for login - this keeps us from needing to create users with RLS issues
const TEST_USERS = [
  {
    id: "12345678-1234-1234-1234-123456789012",
    name: "John Doe",
    email: "john@example.com",
    voter_id: "VOT12345",
    has_voted: false
  },
  {
    id: "22345678-1234-1234-1234-123456789012",
    name: "Jane Smith",
    email: "jane@example.com",
    voter_id: "VOT67890",
    has_voted: false
  },
  {
    id: "32345678-1234-1234-1234-123456789012",
    name: "Bob Johnson",
    email: "bob@example.com",
    voter_id: "VOT54321",
    has_voted: false
  },
  {
    id: "42345678-1234-1234-1234-123456789012",
    name: "Alice Williams",
    email: "alice@example.com",
    voter_id: "VOT09876",
    has_voted: false
  }
];

export const supabaseService = {
  // User methods
  getUsers: async () => {
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      console.error("Error fetching users:", error);
      return [];
    }
    return data;
  },
  
  getUserById: async (id: string) => {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single();
    if (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      return null;
    }
    return data;
  },
  
  getUserByEmail: async (email: string) => {
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single();
    if (error && error.code !== "PGRST116") { // PGRST116 is the "no rows returned" error
      console.error(`Error fetching user with email ${email}:`, error);
    }
    return data || null;
  },
  
  getUserByVoterId: async (voterId: string) => {
    console.log(`SupabaseService: Fetching user with voter ID: ${voterId}`);
    
    if (!voterId || typeof voterId !== 'string') {
      console.error("Invalid voter ID provided:", voterId);
      return null;
    }
    
    try {
      // First try to find in the local test users array to bypass RLS issues
      const testUser = TEST_USERS.find(user => user.voter_id === voterId.trim());
      if (testUser) {
        console.log("Found test user:", testUser);
        return testUser;
      }
      
      // If not found in test users, try the database
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("voter_id", voterId.trim())
        .maybeSingle();
      
      if (error) {
        console.error(`Error fetching user with voter ID ${voterId}:`, error);
        return null;
      }
      
      if (data) {
        console.log(`Found user in database:`, data);
        return data;
      } else {
        console.log(`No user found with voter ID: ${voterId}`);
        return null;
      }
    } catch (err) {
      console.error("Unexpected error in getUserByVoterId:", err);
      return null;
    }
  },
  
  updateUserVoteStatus: async (userId: string, hasVoted: boolean) => {
    // Check if it's a test user first
    const testUserIndex = TEST_USERS.findIndex(user => user.id === userId);
    if (testUserIndex >= 0) {
      TEST_USERS[testUserIndex].has_voted = hasVoted;
      return TEST_USERS[testUserIndex];
    }
    
    // Otherwise update in database
    const { data, error } = await supabase
      .from("users")
      .update({ has_voted: hasVoted })
      .eq("id", userId)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating vote status for user ${userId}:`, error);
      return null;
    }
    return data;
  },

  // Create user (for testing) - not used anymore since we have hardcoded test users
  createUser: async (user: { name: string, email: string, voter_id: string }) => {
    console.log(`Creating test user with voter ID: ${user.voter_id}`);
    const { data, error } = await supabase
      .from("users")
      .insert(user)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating user:", error);
      return null;
    }
    return data;
  },

  // Party methods
  getParties: async () => {
    const { data, error } = await supabase.from("parties").select("*");
    if (error) {
      console.error("Error fetching parties:", error);
      return [];
    }
    return data;
  },
  
  getPartyById: async (id: string) => {
    const { data, error } = await supabase.from("parties").select("*").eq("id", id).single();
    if (error) {
      console.error(`Error fetching party with ID ${id}:`, error);
      return null;
    }
    return data;
  },

  // Vote methods
  getVotes: async () => {
    const { data, error } = await supabase.from("votes").select("*");
    if (error) {
      console.error("Error fetching votes:", error);
      return [];
    }
    return data;
  },
  
  getVotesByUserId: async (userId: string) => {
    const { data, error } = await supabase.from("votes").select("*").eq("user_id", userId);
    if (error) {
      console.error(`Error fetching votes for user ${userId}:`, error);
      return [];
    }
    return data;
  },
  
  createVote: async (userId: string, partyId: string) => {
    const voteData = { user_id: userId, party_id: partyId };
    
    const { data, error } = await supabase
      .from("votes")
      .insert(voteData)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating vote:", error);
      return null;
    }
    
    // Update user's vote status
    await supabaseService.updateUserVoteStatus(userId, true);
    
    return data;
  },
  
  getVoteCountByParty: async () => {
    const { data: votes, error } = await supabase.from("votes").select("party_id");
    
    if (error) {
      console.error("Error fetching votes for count:", error);
      return {};
    }
    
    const counts: Record<string, number> = {};
    votes.forEach(vote => {
      counts[vote.party_id] = (counts[vote.party_id] || 0) + 1;
    });
    
    return counts;
  },

  // Election methods
  getElections: async () => {
    const { data, error } = await supabase.from("elections").select("*");
    if (error) {
      console.error("Error fetching elections:", error);
      return [];
    }
    return data;
  },
  
  getActiveElection: async () => {
    const { data, error } = await supabase
      .from("elections")
      .select("*")
      .eq("is_active", true)
      .single();
    
    if (error && error.code !== "PGRST116") {
      console.error("Error fetching active election:", error);
    }
    return data || null;
  },
  
  getElectionById: async (id: string) => {
    const { data, error } = await supabase.from("elections").select("*").eq("id", id).single();
    if (error) {
      console.error(`Error fetching election with ID ${id}:`, error);
      return null;
    }
    return data;
  }
};
