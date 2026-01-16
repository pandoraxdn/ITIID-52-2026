import { CustomInput } from "./CustomInput";
import { Btn } from "./Btn";

export const CustomForm = () => {
  return (
    <form
        className="
            p-6
            max-w-md
            mx-auto
            flex
            flex-col
            gap-4
            bg-white
            rounded-lg
            shadow
        "
    >
        <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRElEDv8wUARorTMaUMkBxGlJh9cahKKqThcA&s"
            style={{
                height: 150,
                width: 150,
                borderRadius: 100,
                borderWidth: 10,
                borderColor: "pink",
                alignSelf: "center"
            }}
        />
        <CustomInput
            text="Correo"
            type="email"
            color="pink" 
        />
        <CustomInput
            text="Ingresa tu contraseña"
            type="password"
            color="pink" 
        />
        <CustomInput
            text="Pin de seguridad"
            type="number"
            color="pink" 
        />
        <Btn
            title="Login"
            color="pink"
            onPress={ () => console.log("Formulario enviado") }
        />
    </form>
  );
};
