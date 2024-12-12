import { RouterApp } from "../routes/router";
import { BrowserRouter as Router } from "react-router";

function App() {
  return (
    <div className="flex px-20 py-10 w-full h-screen gap-10">
      <Router>
        <RouterApp />
      </Router>
    </div>
  );
}

export default App;
