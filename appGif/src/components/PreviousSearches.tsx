import type { FormData } from "../hooks/useFormSearch";

interface Props {
    title: string;
    terms: string[];
    onLabelClick: (data: FormData) => void;
}

export const PreviousSearches = ({ title, terms, onLabelClick }: Props) => {

    const sendQuery = ( value: string ) => {
        const data: FormData = { query: value };
        onLabelClick( data );
    }    

    return (
        <div
            className="previous-searches"
        >
            <h2>{title}</h2>
            <ul
                className="previous-searches-list"
            >
                {
                    terms.map( ( element ) => (
                        <li
                            key={ element }
                            onClick={ () => sendQuery( element ) }
                        >
                            { element }
                        </li>
                    ))
                }
            </ul>
        </div>
    );
};
