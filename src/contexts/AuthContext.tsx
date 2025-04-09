
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabaseService } from "@/lib/supabase-service";
import { User } from "@/lib/supabase-service";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (voterId: string) => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        console.log("Restored user from localStorage:", parsedUser);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("currentUser");
      }
    } else {
      console.log("No user found in localStorage");
    }
    setLoading(false);
  }, []);

  const login = async (voterId: string): Promise<User | null> => {
    console.log(`AuthContext: Attempting to login with voter ID: ${voterId}`);
    setLoading(true);
    try {
      // In a real app, this would be an API call with proper authentication
      console.log("Fetching user from Supabase...");
      const user = await supabaseService.getUserByVoterId(voterId);
      console.log("Supabase response:", user);
      
      if (user) {
        console.log("User found, setting currentUser state");
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        toast({
          title: "Login successful",
          description: `Welcome, ${user.name}!`,
        });
        return user;
      } else {
        console.log("No user found with that voter ID");
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid voter ID. Please try again.",
        });
        return null;
      }
    } catch (error) {
      console.error("Login error in AuthContext:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An error occurred during login.",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const value = {
    currentUser,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
