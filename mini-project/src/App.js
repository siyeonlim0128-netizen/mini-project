import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import MainPage from "./pages/MainPage";
import MyPage from "./pages/MyPage";
import PostCreatePage from "./pages/PostCreatePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function AppRoutes() {
  const navigate = useNavigate();

  const goMain = () => navigate("/main");
  const goCreate = () => navigate("/posts/create");

  return (
    <Routes>
      <Route path="/" element={<MainPage onCreateClick={goCreate} />} />
      <Route path="/main" element={<MainPage onCreateClick={goCreate} />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/posts/create" element={<PostCreatePage onBack={goMain} />} />
      <Route path="/password-reset" element={<ResetPasswordPage />} />
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
