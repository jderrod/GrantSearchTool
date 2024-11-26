import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GrantsList from "./components/GrantsList";
import GrantDetails from "./components/GrantDetails";
import SavedGrants from "./components/SavedGrants";

function App() {
    return (
        <Router>
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
                <div className="container">
                    <a className="navbar-brand" href="/">Grant Search Tool</a>
                    <div className="navbar-nav">
                        <a className="nav-link" href="/">Home</a>
                        <a className="nav-link" href="/saved-grants">Saved Grants</a>
                    </div>
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<GrantsList />} />
                <Route path="/grants/:grantId" element={<GrantDetails />} />
                <Route path="/saved-grants" element={<SavedGrants />} />
            </Routes>
        </Router>
    );
}

export default App;