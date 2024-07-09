import { Route, Routes } from "react-router-dom";
import HomePage from "./Components/HomePage";
import Status from "./Components/Status/Status";
import StatusViewer from "./Components/Status/StatusViewer";
import Signin from "./Components/Register/Signin";
import Signup from "./Components/Register/Signup";
import ProfilePage from "./Components/Profile/ProfilePage";

function App() {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<HomePage/>}></Route>        
        <Route exact path="/status" element={<Status/>}></Route>
        <Route exact path="/status/:userId" element={<StatusViewer/>}></Route>
        <Route exact path="/signin" element={<Signin/>}></Route>
        <Route exact path="/signup" element={<Signup/>}></Route>
        <Route exact path="/profile" element={<ProfilePage/>}></Route>
      </Routes>
      
    </div>
  );
}

export default App;
