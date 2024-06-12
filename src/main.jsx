import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "@/lib/store.jsx";
import MenuProvider from "./providers/MenuProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MenuProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </MenuProvider>
  </React.StrictMode>
);
