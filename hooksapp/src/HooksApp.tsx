import { Container } from "./components/Container";
import { CustomForm } from "./components/CustomForm";

const HooksApp = () => {
  return (
    <div
        style={{
            alignContent: "center",
            alignItems: "center",
            flex: 1
        }}
    >
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
    </div>
  );
};

export default HooksApp;
