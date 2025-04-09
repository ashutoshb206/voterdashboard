
// Mock database for voting system

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  voterId: string;
  hasVoted: boolean;
}

export interface Party {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
}

export interface Vote {
  id: string;
  userId: string;
  partyId: string;
  timestamp: Date;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

// Mock data
const parties: Party[] = [
  {
    id: "party-1",
    name: "Democratic Party",
    logoUrl: "/democratic-party.svg",
    description: "Focused on social equality and progressive policies."
  },
  {
    id: "party-2",
    name: "Republican Party",
    logoUrl: "/republican-party.svg",
    description: "Focused on traditional values and economic freedom."
  },
  {
    id: "party-3",
    name: "Green Party",
    logoUrl: "/green-party.svg",
    description: "Focused on environmental protection and social justice."
  },
  {
    id: "party-4",
    name: "Libertarian Party",
    logoUrl: "/libertarian-party.svg",
    description: "Focused on individual liberty and limited government."
  }
];

const users: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    voterId: "VOT12345",
    hasVoted: false
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    voterId: "VOT67890",
    hasVoted: true
  }
];

const votes: Vote[] = [
  {
    id: "vote-1",
    userId: "user-2",
    partyId: "party-1",
    timestamp: new Date("2023-11-07T10:30:00")
  }
];

const elections: Election[] = [
  {
    id: "election-1",
    title: "Presidential Election 2024",
    description: "Vote for the next president of the United States",
    startDate: new Date("2024-11-03T00:00:00"),
    endDate: new Date("2024-11-03T23:59:59"),
    isActive: true
  },
  {
    id: "election-2",
    title: "Midterm Elections 2022",
    description: "Vote for your state representatives",
    startDate: new Date("2022-11-08T00:00:00"),
    endDate: new Date("2022-11-08T23:59:59"),
    isActive: false
  }
];

// Mock database service
export const db = {
  // User methods
  getUsers: () => [...users],
  getUserById: (id: string) => users.find(user => user.id === id),
  getUserByEmail: (email: string) => users.find(user => user.email === email),
  getUserByVoterId: (voterId: string) => users.find(user => user.voterId === voterId),
  updateUserVoteStatus: (userId: string, hasVoted: boolean) => {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      users[userIndex].hasVoted = hasVoted;
      return users[userIndex];
    }
    return null;
  },

  // Party methods
  getParties: () => [...parties],
  getPartyById: (id: string) => parties.find(party => party.id === id),

  // Vote methods
  getVotes: () => [...votes],
  getVotesByUserId: (userId: string) => votes.filter(vote => vote.userId === userId),
  createVote: (userId: string, partyId: string) => {
    const newVote: Vote = {
      id: `vote-${votes.length + 1}`,
      userId,
      partyId,
      timestamp: new Date()
    };
    votes.push(newVote);
    
    // Update user's vote status
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      users[userIndex].hasVoted = true;
    }
    
    return newVote;
  },
  getVoteCountByParty: () => {
    const counts: Record<string, number> = {};
    parties.forEach(party => {
      counts[party.id] = votes.filter(vote => vote.partyId === party.id).length;
    });
    return counts;
  },

  // Election methods
  getElections: () => [...elections],
  getActiveElection: () => elections.find(election => election.isActive),
  getElectionById: (id: string) => elections.find(election => election.id === id)
};
