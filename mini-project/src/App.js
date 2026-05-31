import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Wishlist from "./pages/Wishlist";
import PostDetail from "./pages/PostDetail";
import MyPage from "./pages/MyPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SignupPage from "./pages/SignupPage";
import Main from "./pages/MainPage";
import ReportPage from "./pages/ReportPage";
import MessageList from "./pages/MessageList";
import ChatRoom from "./pages/ChatRoom";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/postdetail" element={<PostDetail />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/password-reset" element={<ResetPasswordPage />} />
        <Route path="/main" element={<Main />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/messages" element={<MessageList />} />
        <Route path="/message/:id" element={<ChatRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;