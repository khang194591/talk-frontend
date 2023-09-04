import Home from "./components/Home";
import AppProvider from "./providers/AppProvider";
// import AppRouter from "./router";

export default function App() {
  return (
    <AppProvider>
      <Home />
      {/* <AppRouter /> */}
    </AppProvider>
  );
}
