//import { mockGifs } from "./mock-gif/gif.mock";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import { GifList } from "./components/GifList";
import { useApiGif } from "./hooks/useApiGif";
import { useFormSearch } from "./hooks/useFormSearch";

const App = () => {

    const { isLoading, listGifs } = useApiGif();
    const { state, handleInputChange, handleSubmit } = useFormSearch();

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
            />
            {/*GifList*/}
            {
                (!isLoading) && <GifList data={ listGifs }/>
            }
        </>
    );
}

export default App;
