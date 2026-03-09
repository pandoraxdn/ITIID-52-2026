import {type ReactNode} from "react";
import "../global.css";
import {View} from "react-native";
import {PortalHost} from "@rn-primitives/portal";

const RootLayout = ({children}: {children: ReactNode}) => {
  return (
    <>
      <View style={{flex: 1}}>
        {children}
      </View>
      <PortalHost />
    </>
  );
}

export default RootLayout;
