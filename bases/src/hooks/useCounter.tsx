import { useState } from "react";

interface UseCounter{
    counter:    number;
    add:        () => void;
    dec:        () => void;
    reset:      () => void;
}

export const useCounter = ( valor: number ): UseCounter => {

    const [ counter, setCounter ] = useState<number>(valor);

    const add = () => setCounter( prev => prev + 1 );

    const dec = () => setCounter( prev => (prev == 0) ? 0 : prev - 1 );

    const reset = () => setCounter( valor );

    return { counter, add, dec, reset };
}
    
