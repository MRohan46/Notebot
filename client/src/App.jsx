import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AppHome from "./pages/AppHome";
import Auth from "./pages/Auth"
import Session from "./pages/Session";
import PageNotFound from "./pages/PageNotFound";
import ChatPage from "./pages/Chat";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/app/home" element={<AppHome />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/library/:id" element={<Session />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/chat/:id" element={<ChatPage />} />

      <Route path="/*" element={<PageNotFound />}/>
    </Routes>
  );
}

export default App;
