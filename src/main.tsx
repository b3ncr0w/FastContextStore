import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { StoreProvider } from "./fastContextStore";
import { DataWrapper } from "./DataWrapper";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StoreProvider>
    <DataWrapper>
      <App />
    </DataWrapper>
  </StoreProvider>
);
