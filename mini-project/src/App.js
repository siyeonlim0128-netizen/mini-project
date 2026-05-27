import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Wishlist from "./pages/Wishlist";
import PostDetail from "./pages/PostDetail";
import MyPage from "./pages/MyPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// 다른 팀원이 만드는 페이지들 — 완성되면 주석 해제!
// import LandingPage from "./pages/LandingPage";
// import Main from "./pages/Main";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<LandingPage />} /> */}
        {/* <Route path="/main" element={<Main />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/password-reset" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;