import { ConfigProvider } from "antd";
import { PropsWithChildren } from "react";
import { theme } from "../themes";
import { StyleProvider } from "@ant-design/cssinjs";
import { BrowserRouter } from "react-router-dom";

export default function AppProvider({ children }: PropsWithChildren) {
  return (
    <BrowserRouter>
      <StyleProvider hashPriority="high">
        <ConfigProvider theme={theme}>{children}</ConfigProvider>
      </StyleProvider>
    </BrowserRouter>
  );
}
