import { Provider } from "react-redux";
import { MainView } from "./pages/MainView";
import store from "./store/configureStore";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <Provider store={store}>
      <div className="bg-dark text-white min-vh-100">
        {/* Optional: Add a global loading overlay or error boundary here */}
        <MainView />

        {/* Optional: Global footer */}
        {/* <footer className="bg-secondary text-center py-3 mt-auto border-top border-warning">
          <div className="">
            <small className="text-light">
              © 2024 RetroLens - Your Historic Movie Collection
            </small>
          </div>
        </footer> */}
      </div>
    </Provider>
  );
};

export default App;
