//import { useCounter } from "../hooks/useCounter";
import { useReducerCounter } from "../hooks/useReducerCounter";
import { AuthReducer } from "../hooks/useReducerCounter";

interface Props{
    valor?: number;
}

export const Counter = ( { valor = 0 }:Props ) => {
    
    //const { counter, add, dec, reset } = useCounter( valor );
    const initialState: AuthReducer = { count: valor };
    const { state, add, add2, dec, dec2, reset } = useReducerCounter( initialState );

    return (<>
        <h1>Counter { state.count }</h1>
        <button
            onClick={ add }
        >
            +1
        </button>
        <button
            onClick={ add2 }
        >
            +2
        </button>
        <button
            onClick={ dec }
        >
            -1
        </button>
        <button
            onClick={ dec2 }
        >
            -2
        </button>
        <button
            onClick={ reset }
        >
            reset
        </button>
    </>);
}
