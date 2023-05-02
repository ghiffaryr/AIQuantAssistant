import "./App.css";
import { BrowserRouter } from "react-router-dom";

import ApiRoutes from "./api/ApiRoutes";
import { Provider } from "react-redux";
import store from "./store/store";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ApiRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
