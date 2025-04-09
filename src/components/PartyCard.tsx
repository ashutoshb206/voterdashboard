
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Party } from "@/lib/supabase-service";

interface PartyCardProps {
  party: Party;
  onVote: (partyId: string) => void;
  disabled?: boolean;
}

const PartyCard: React.FC<PartyCardProps> = ({ party, onVote, disabled }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-vote-lightGray rounded-full flex items-center justify-center">
            {party.logo_url ? (
              <img 
                src={party.logo_url} 
                alt={`${party.name} logo`} 
                className="w-12 h-12 object-contain" 
              />
            ) : (
              <span className="text-2xl font-bold">{party.name.charAt(0)}</span>
            )}
          </div>
        </div>
        <CardTitle className="text-center">{party.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-center text-vote-darkGray">
          {party.description}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => onVote(party.id)}
          disabled={disabled}
        >
          Vote for this party
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PartyCard;
