import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import MainPage from "./pages/MainPage";
import MyPage from "./pages/MyPage";
import PostCreatePage from "./pages/PostCreatePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SignupPage from "./pages/SignupPage";

function MainRoute({ initialTab = "home" }) {
  const navigate = useNavigate();

  return (
    <MainPage
      initialTab={initialTab}
      onCreateClick={() => navigate("/posts/new")}
      onHomeClick={() => navigate("/main")}
      onLikesClick={() => navigate("/favorites")}
      onMessagesClick={() => navigate("/messages")}
      onMyPageClick={() => navigate("/mypage")}
    />
  );
}

function PostCreateRoute() {
  const navigate = useNavigate();

  return <PostCreatePage onBack={() => navigate("/main")} />;
}

function NotReadyPage({ title }) {
  const navigate = useNavigate();

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <section style={{ textAlign: "center" }}>
        <h1>{title}</h1>
        <button type="button" onClick={() => navigate("/main")}>
          홈으로
        </button>
      </section>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainRoute />} />
        <Route path="/main" element={<MainRoute />} />
        <Route path="/favorites" element={<MainRoute initialTab="likes" />} />
        <Route path="/messages" element={<NotReadyPage title="메세지" />} />
        <Route path="/report" element={<NotReadyPage title="신고하기" />} />
        <Route path="/login" element={<NotReadyPage title="로그인" />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/posts/new" element={<PostCreateRoute />} />
        <Route path="/posts/edit/:postId" element={<PostCreateRoute />} />
        <Route path="/password-reset" element={<ResetPasswordPage />} />
        <Route path="*" element={<MainRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
