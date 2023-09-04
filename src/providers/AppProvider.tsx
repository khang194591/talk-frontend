import { StyleProvider } from "@ant-design/cssinjs";
import { Auth0Provider } from "@auth0/auth0-react";
import { ConfigProvider } from "antd";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "../app";
import { theme } from "../themes";

export default function AppProvider({ children }: PropsWithChildren) {
  return (
    <Auth0Provider
      domain="dev-3c0bxolytggkg4ed.us.auth0.com"
      clientId="BdySi9dx2HLkBwEXXBBj2cIYvxsW0SVM"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <BrowserRouter>
        <StyleProvider hashPriority="high">
          <ConfigProvider theme={theme}>
            <Provider store={store}>{children}</Provider>
          </ConfigProvider>
        </StyleProvider>
      </BrowserRouter>
    </Auth0Provider>
  );
}
