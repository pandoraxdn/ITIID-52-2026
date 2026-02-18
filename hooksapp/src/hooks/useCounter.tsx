import {useState} from "react";

interface UseCounter{
  counter: number;
  increment: () => void;
  decrement: () => void;
}

export const useCounter = (): UseCounter => {

  const [ counter, setCounter ] = useState<number>(1);

  const increment = () => setCounter(prev => prev + 1);

  const decrement = () => setCounter(prev => ( prev == 1 ) ? 1 : prev - 1);

  return {
    counter,
    increment,
    decrement
  };
};
