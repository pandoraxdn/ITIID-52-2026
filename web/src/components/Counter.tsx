import { useCounter } from "../hooks/useCounter";

interface Props{
    valor?: number;
}

export const Counter = ( { valor = 0 }:Props ) => {
    
    const { counter, add, dec, reset } = useCounter( valor );

    return (<>
        <h1>Counter { counter }</h1>
        <button
            onClick={ add }
        >
            +1
        </button>
        <button
            onClick={ dec }
        >
            -1
        </button>
        <button
            onClick={ reset }
        >
            reset
        </button>
    </>);
}
