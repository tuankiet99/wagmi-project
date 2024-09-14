import { PropsWithChildren } from "react";
import {
  darkTheme,
  RainbowKitProvider as RainbowKit,
} from "@rainbow-me/rainbowkit";

import "@rainbow-me/rainbowkit/styles.css";

const theme = darkTheme({
  accentColor: "#2F76FD",
});
theme.colors.connectButtonBackground = "#0FDBD1";
theme.colors.connectButtonText = "#1E1E1E";
theme.radii.connectButton = "4px";

function RainbowKitProvider({ children }: PropsWithChildren) {
  return <RainbowKit theme={theme}>{children}</RainbowKit>;
}

export default RainbowKitProvider;
