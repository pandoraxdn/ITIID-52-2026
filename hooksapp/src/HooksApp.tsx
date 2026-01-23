//import { Container } from "./components/Container";
//import { CustomForm } from "./components/CustomForm";
//import { TrafficLight } from "./01-useState/TrafficLight";
//import { TrafficLightEffect } from "./02-useEffect/TrafficLightEffect";
//import { PokemonPage } from "./03-examples/PokemonPage";
import { TaskApp } from "./04-useReducer/TaskApp";

const HooksApp = () => {
  return (
    <div
        className="bg-gradient"
    >
      <TaskApp/> 
      {/*
        <PokemonPage />
        <TrafficLight />
        <Container>
            <h1
                style={{
                    alignSelf: "center",
                    textAlign: "center",
                    color: "pink",
                    fontWeight: "bold",
                    fontSize: 30
                }}
            >
                Iniciar Sesión
            </h1>
            <CustomForm/>
        </Container>
      */}
    </div>
  );
};

export default HooksApp;
