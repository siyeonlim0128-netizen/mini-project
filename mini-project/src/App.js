import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import Wishlist from "./pages/Wishlist";
import PostDetail from "./pages/PostDetail";
import MyPage from "./pages/MyPage";
import PostCreatePage from "./pages/PostCreatePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SignupPage from "./pages/SignupPage";
import ReportPage from "./pages/ReportPage";
import MessageList from "./pages/MessageList";
import ChatRoom from "./pages/ChatRoom";

function MainRoute({ initialTab = "home" }) {
  const navigate = useNavigate();

  return (
    <MainPage
      initialTab={initialTab}
      onCreateClick={() => navigate("/posts/new")}
      onHomeClick={() => navigate("/main")}
      onLikesClick={() => navigate("/wishlist")}
      onMessagesClick={() => navigate("/messages")}
      onMyPageClick={() => navigate("/mypage")}
    />
  );
}

function PostCreateRoute() {
  const navigate = useNavigate();

  return <PostCreatePage onBack={() => navigate("/main")} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/main" element={<MainRoute />} />
        <Route path="/favorites" element={<MainRoute initialTab="likes" />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/postdetail" element={<PostDetail />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/posts/new" element={<PostCreateRoute />} />
        <Route path="/posts/edit/:postId" element={<PostCreateRoute />} />
        <Route path="/password-reset" element={<ResetPasswordPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/messages" element={<MessageList />} />
        <Route path="/message/:id" element={<ChatRoom />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
