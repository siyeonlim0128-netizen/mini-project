import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Wishlist from "./pages/Wishlist";
import PostDetail from "./pages/PostDetail";
import MyPage from "./pages/MyPage";
import PostCreatePage from "./pages/PostCreatePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SignupPage from "./pages/SignupPage";
import MainPage from "./pages/MainPage";
import ReportPage from "./pages/ReportPage";
import MessageList from "./pages/MessageList";
import ChatRoom from "./pages/ChatRoom";


function AppRoutes() {
  const navigate = useNavigate();

  const goMain = () => navigate("/main");
  const goCreate = () => navigate("/posts/create");

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/favorites" element={<Wishlist />} />
      <Route path="/postdetail" element={<PostDetail />} />
      <Route path="/main" element={<MainPage onCreateClick={goCreate} />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/posts/create" element={<PostCreatePage onBack={goMain} />} />
      <Route path="/password-reset" element={<ResetPasswordPage />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/messages" element={<MessageList />} />
      <Route path="/message/:id" element={<ChatRoom />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
