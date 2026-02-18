import { useState } from "react";

interface UsePreviousSearches {
    previousTerms:          string[];
    addTerm:                (term: string) => void;
}

export const usePreviousSearches = (): UsePreviousSearches => {
  const [previousTerms, setPreviousTerms] = useState<string[]>([]);

  const addTerm = (term: string): void => {
        setPreviousTerms( prev => [...prev, term] );
  };

  return { previousTerms, addTerm };
};
