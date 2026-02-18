import { useReducer } from "react";

export interface FormData { 
    query:  string;
}

interface UseFormSearch{
    state:              FormData;
    handleInputChange:  ( fieldName: keyof FormData, value: string ) => void;
    handleSubmit:       () => void;
}

export const useFormSearch = (): UseFormSearch => {

    const initialForm: FormData = {
        query: ""
    }

    type Action = { type: "handleInputChange", payload: { fieldName: keyof FormData, value: string } };

    const formReducer = ( state: FormData, action: Action ) => {
        switch( action.type ){
            case "handleInputChange":
                return {
                    ...state,
                    [ action.payload.fieldName ] : action.payload.value
            }
        }
    }

    const [ state, dispatch ] = useReducer( formReducer, initialForm );

    const handleInputChange = ( fieldName: keyof FormData, value: string ) => {
        dispatch({ type: "handleInputChange", payload: { fieldName, value } });
    }

    const handleSubmit = () => {
        handleInputChange( "query", "" );
    }

    return { state, handleInputChange, handleSubmit };
};
