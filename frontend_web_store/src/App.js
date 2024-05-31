import "./App.css";
import { BrowserRouter } from "react-router-dom";

import ApiRoutes from "./api/ApiRoutes";
import { Provider } from "react-redux";
import store from "./store/store";
import { MantineProvider } from "@mantine/core";
// core styles are required for all packages
import '@mantine/core/styles.css';

function App() {
  return (
    <MantineProvider>
      <Provider store={store}>
        <BrowserRouter>
          <ApiRoutes />
        </BrowserRouter>
      </Provider>
    </MantineProvider>
  );
}

export default App;
