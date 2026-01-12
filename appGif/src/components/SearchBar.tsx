import type { FormData } from "../hooks/useFormSearch";

interface Props {
    placeholder: string;
    buttonText?: string;
    state:          FormData;
    handleSubmit: () => void;
    handleInputChange: ( fieldName: keyof FormData, value: string ) => void;
}

export const SearchBar = ({ placeholder, buttonText = "Buscar", handleSubmit, handleInputChange, state}: Props) => {
  return (
    <div
        className="search-container"
    >
        <input
            type="text"
            placeholder={ placeholder }
            value={ state.query }
            onChange={ (event) => handleInputChange("query", event.target.value) }
        />
        <button>
            { buttonText }
        </button>
    </div>
  );
};
