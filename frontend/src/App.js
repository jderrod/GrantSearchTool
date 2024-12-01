import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import GrantsList from "./components/GrantsList";
import GrantDetails from "./components/GrantDetails";
import SavedGrants from "./components/SavedGrants";

function App() {
    return (
        <Router>
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
                <div className="container">
                    <Link className="navbar-brand" to="/">Grant Search Tool</Link>
                    <div className="navbar-nav">
                        <Link className="nav-link" to="/">Home</Link>
                        <Link className="nav-link" to="/saved-grants">Saved Grants</Link>
                    </div>
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<GrantsList />} />
                <Route path="/grants/:source/:grantId" element={<GrantDetails />} />
                <Route path="/saved-grants" element={<SavedGrants />} />
            </Routes>
        </Router>
    );
}

export default App;