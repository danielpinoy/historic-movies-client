import Container from "react-bootstrap/Container";
import { Provider } from "react-redux";
import { MainView } from "./components/main-view";
import store from "./store/configureStore";

const App = () => {
    return (
        <Provider store={store}>
            <Container className="mt-2">
                <MainView />
            </Container>
        </Provider>
    );
};

export default App;
