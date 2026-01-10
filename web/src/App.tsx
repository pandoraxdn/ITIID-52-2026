import { Texto } from "./components/Texto";
import { Counter } from "./components/Counter";

const App = () => {
    return (
        <div>
                <h1>Hola dsm 52</h1>
                <Texto
                    texto="Alejandra"
                />
                <Counter
                    valor={10}
                />
        </div>
    );
}

export default App;
