//import { mockGifs } from "./mock-gif/gif.mock";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import { GifList } from "./components/GifList";
import { PreviousSearches } from "./components/PreviousSearches";
import { useApiGif } from "./hooks/useApiGif";
import { useFormSearch } from "./hooks/useFormSearch";
import { usePreviousSearches } from "./hooks/usePreviousSearches";

const App = () => {

    const { isLoading, listGifs, sendQuery } = useApiGif();
    const { state, handleInputChange, handleSubmit } = useFormSearch();
    const { addTerm, previousTerms } = usePreviousSearches();

    return(
        <>
            {/*Header*/}
            <Header
                title="Buscar Gifs"
                description="Encuentra el mejor gif"
            />
            {/*SearchBar*/}
            <SearchBar
                placeholder="Buscar gif"
                buttonText="Buscar"
                handleSubmit={ handleSubmit }
                handleInputChange={ handleInputChange }
                state={ state }
                onSend={ sendQuery }
                addTerm={ addTerm }
            />
            {/*Previous Searches*/}
            <PreviousSearches
                title="Busquedas recientes"
                terms={ previousTerms }
                onLabelClick={ sendQuery } 
            />
            {/*GifList*/}
            {
                (!isLoading) && <GifList data={ listGifs }/>
            }
        </>
    );
}

export default App;
