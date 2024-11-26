import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GrantsList from "./components/GrantsList";
import GrantDetails from "./components/GrantDetails";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<GrantsList />} />
                <Route path="/grants/:grantId" element={<GrantDetails />} />
            </Routes>
        </Router>
    );
}

export default App;
