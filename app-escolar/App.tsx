import {View, Text} from "react-native";
import {Button} from "@/components/ui/button";
import RootLayout from "./app/_layout";

const App = () => {
  return (
    <RootLayout>
      <View className="items-center justify-center flex-1 bg-black">
        <Text className="text-xl font-bold text-white">
          NativeWind funcionando
        </Text>
        <Button
          variant="secondary"
        >
          Entrar
        </Button>
      </View>
    </RootLayout>
  );
}

export default App;
