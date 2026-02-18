import type { KeyboardEvent } from "react";
import type { FormData } from "../hooks/useFormSearch";

interface Props {
    placeholder:        string;
    buttonText?:        string;
    state:              FormData;
    handleSubmit:       () => void;
    handleInputChange:  ( fieldName: keyof FormData, value: string ) => void;
    onSend:             ( data: FormData ) => void;
    addTerm:            ( term: string ) => void;
}

export const SearchBar = ({ placeholder, buttonText = "Buscar", handleSubmit, handleInputChange, state, onSend, addTerm}: Props) => {

    const sendPetition = () => {
        onSend(state);
        addTerm( state.query );
        handleSubmit();
    }

    const handleKeyDown = ( event: KeyboardEvent<HTMLElement> ) => {
        ( event.key === "Enter" ) && sendPetition();
    }

    return (
        <div
            className="search-container"
        >
            <input
                type="text"
                placeholder={ placeholder }
                value={ state.query }
                onChange={ (event) => handleInputChange("query", event.target.value) }
                onKeyDown={ handleKeyDown }
            />
            <button
                onClick={ sendPetition }
            >
                { buttonText }
            </button>
        </div>
    );
};
