
import React, { useState } from "react";
import {
  UserRoundCog,
  FileText,
  Flag,
  LogOut,
  Trash2,
  Home,
  Heart,
  MessageCircle,
  UserRound,
  Settings,
  ChevronLeft,
} from "lucide-react";
import "./MyPage.css";

const posts = [
  { id: 1, category: "교재", likes: 12, comments: 3 },
  { id: 2, category: "분실물", likes: 8, comments: 1 },
  { id: 3, category: "교재", likes: 45, comments: 12 },
];

const majors = [
  "국제금융학과",
  "그리스·불가리아학과",
  "글로벌스포츠산업학부",
  "기후변화융합학부",
  "독일어통번역학과",
  "디지털콘텐츠학부",
  "루마니아학과",
  "말레이·인도네시아어통번역학과",
  "바이오메디컬공학부",
  "반도체전자공학부(반도체공학전공)",
  "반도체전자공학부(전자공학전공)",
  "사학과",
  "산업경영공학과",
  "생명공학과",
  "세르비아·크로아티아학과",
  "수학과",
  "스페인어통번역학과",
  "아랍어통번역학과",
  "아프리카학부",
  "언어인지과학과",
  "영어통번역학부",
  "우크라이나학과",
  "융합인재학부",
  "이탈리아어통번역학과",
  "일본어통번역학과",
  "자유전공학부(글로벌)",
  "전자물리학과",
  "정보통신공학과",
  "중국어통번역학과",
  "중앙아시아학과",
  "체코·슬로바키아학과",
  "철학과",
  "컴퓨터공학부",
  "태국어통번역학과",
  "통계학과",
  "투어리즘 & 웰니스학부",
  "폴란드학과",
  "한국학과",
  "화학과",
  "환경학과",
  "헝가리학과",
  "AI데이터융합학부",
  "Finance & AI융합학부",
  "Global Business & Technology학부",
];

function ProfileSummary() {
  const userName = localStorage.getItem("name") || "이름";
const userNickname = localStorage.getItem("nickname") || "닉네임";
const userMajor = localStorage.getItem("major") || "본전공";
  const userProfileImage = localStorage.getItem("userProfileImage");

  return (
    <section className="card profile-card">
      <div className="avatar">
        {userProfileImage && (
          <img src={userProfileImage} alt="프로필 이미지" />
        )}
      </div>

      <div className="profile-info">
        <div className="name-row">
          <strong>{userNickname}</strong>
          <span className="verified">●</span>
        </div>
        <p>
          {userName} · {userMajor}
        </p>
      </div>

      <button className="icon-button" aria-label="설정">
        <Settings size={30} strokeWidth={2.5} />
      </button>

      <div className="stats">
        <div>
          <strong>4</strong>
          <span>판매글</span>
        </div>
        <div>
          <strong>12</strong>
          <span>거래횟수</span>
        </div>
        <div>
          <strong>6</strong>
          <span>좋아요</span>
        </div>
      </div>
    </section>
  );
}

function MenuList({ onMove }) {
  const [modalType, setModalType] = useState(null);

  const closeModal = () => {
    setModalType(null);
  };


  const handleLogout = () => {
    setModalType(null);
    alert("로그아웃되었습니다.");
    // 필요하면 로그인 페이지로 이동
    // window.location.href = "/";
  };

  const handleWithdraw = () => {
    localStorage.clear();
    setModalType(null);
    alert("탈퇴 처리되었습니다.");
    // 필요하면 회원가입/로그인 페이지로 이동
    // window.location.href = "/";
  };

  const modalMessage =
    modalType === "logout"
      ? "정말로 로그아웃하시겠습니까?"
      : "정말로 탈퇴하시겠습니까?";

  const confirmText = modalType === "logout" ? "확인" : "탈퇴";

  return (
    <>
      <section className="card menu-card">
        <button className="menu-item" onClick={() => onMove("edit")}>
          <span className="menu-icon">
            <UserRoundCog size={17} strokeWidth={2.4} />
          </span>
          <span className="menu-label">회원 정보 수정</span>
          <span className="chevron">›</span>
        </button>

        <button className="menu-item" onClick={() => onMove("posts")}>
          <span className="menu-icon">
            <FileText size={17} strokeWidth={2.4} />
          </span>
          <span className="menu-label">내가 쓴 글</span>
          <span className="chevron">›</span>
        </button>

        <button className="menu-item">
          <span className="menu-icon">
            <Flag size={17} strokeWidth={2.4} />
          </span>
          <span className="menu-label">신고하기</span>
          <span className="chevron">›</span>
        </button>

        <button className="menu-item" onClick={() => setModalType("logout")}>
          <span className="menu-icon">
            <LogOut size={17} strokeWidth={2.4} />
          </span>
          <span className="menu-label">로그아웃</span>
          <span className="chevron">›</span>
        </button>

        <button className="menu-item danger" onClick={() => setModalType("withdraw")}>
          <span className="menu-icon">
            <Trash2 size={17} strokeWidth={2.4} />
          </span>
          <span className="menu-label">회원 탈퇴</span>
        </button>
      </section>

      {modalType && (
        <div className="modal-overlay">
          <div className="withdraw-modal">
            <p>{modalMessage}</p>

            <div className="modal-actions">
  <button type="button" onClick={closeModal}>
    취소
  </button>
  <button
    type="button"
    onClick={modalType === "logout" ? handleLogout : handleWithdraw}
  >
    {confirmText}
  </button>
</div>
          </div>
        </div>
      )}
    </>
  );
}

function BottomNav({ activeTab = "mypage", onMove }) {
  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <nav className="bottom-nav">
      <button
        className={activeTab === "home" ? "active" : ""}
        onClick={goHome}
      >
        <Home size={30} strokeWidth={2.8} />
        <span>홈버튼</span>
      </button>

      <button className={activeTab === "favorite" ? "active" : ""}>
        <Heart size={32} strokeWidth={2.8} />
        <span>관심상품</span>
      </button>

      <button className={activeTab === "message" ? "active" : ""}>
        <MessageCircle size={32} strokeWidth={2.8} />
        <span>메세지</span>
      </button>

      <button
        className={activeTab === "mypage" ? "active" : ""}
        onClick={() => onMove("main")}
      >
        <UserRound size={30} strokeWidth={2.8} />
        <span>마이페이지</span>
      </button>
    </nav>
  );
}

function MainMyPage({ onMove }) {
  return (
    <div className="phone main-phone">
      <ProfileSummary />
      <MenuList onMove={onMove} />
      <BottomNav activeTab="mypage" onMove={onMove} />
    </div>
  );
}

function EditProfilePage({ onMove }) {
  const originalNickname = localStorage.getItem("nickname") || "";

  const [editName, setEditName] = useState(localStorage.getItem("name") || "");
  const [editNickname, setEditNickname] = useState(originalNickname);
  const [editMajor, setEditMajor] = useState(localStorage.getItem("major") || "");
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("userProfileImage") || ""
  );
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameTried, setNicknameTried] = useState(false);
  const [editMajorOpen, setEditMajorOpen] = useState(false);

  const nicknameChanged = editNickname.trim() !== originalNickname.trim();
  const canSave = !nicknameChanged || nicknameChecked;

  const duplicatedNicknames = ["admin", "test", "관리자", "hufs"];

  const handleNicknameCheck = () => {
    setNicknameTried(true);

    const nicknameDuplicated = duplicatedNicknames.includes(editNickname.trim());
    setNicknameChecked(!nicknameDuplicated);
  };

  const handleImageChange = (event) => {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    const imageUrl = reader.result;
    setProfileImage(imageUrl);
    localStorage.setItem("userProfileImage", imageUrl);
  };

  reader.readAsDataURL(file);
};

  const handleNicknameBlur = () => {
    if (nicknameChanged && !nicknameChecked) {
      setEditNickname(originalNickname);
      setNicknameTried(false);
      setNicknameChecked(false);
    }
  };

  const handleSave = () => {
    if (!canSave) return;

    localStorage.setItem("name", editName);
    localStorage.setItem("nickname", editNickname);
    localStorage.setItem("major", editMajor);
    localStorage.setItem("userProfileImage", profileImage);

    onMove("main");
  };

  return (
    <div className="phone edit-phone">
      <section className="edit-photo-card">
        <button className="edit-back-button" onClick={() => onMove("main")}>
          <ChevronLeft size={28} strokeWidth={2.6} />
        </button>

        <label className="edit-avatar">
          {profileImage && <img src={profileImage} alt="프로필 이미지" />}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
      </section>

      <section className="edit-form-card">
        <label className="edit-label">닉네임</label>
        <div className="edit-nickname-row">
          <input
  value={editNickname}
  onChange={(e) => {
    setEditNickname(e.target.value);
    setNicknameChecked(false);
    setNicknameTried(false);
  }}
  onBlur={handleNicknameBlur}
/>

<button
  type="button"
  onMouseDown={(e) => e.preventDefault()}
  onClick={handleNicknameCheck}
  disabled={!nicknameChanged}
>
  중복확인
</button>
        </div>

  
  {nicknameTried && (
  <p className={nicknameChecked ? "edit-success" : "edit-error"}>
    {nicknameChecked
      ? "사용가능한 닉네임입니다."
      : "사용가능하지 않은 닉네임입니다."}
  </p>
)}

        <label className="edit-label">이름</label>
        <input
          className="edit-input"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />

        <label className="edit-label">본전공</label>

<div className="custom-select edit-major-select">
  <button
    type="button"
    className="select-button"
    onClick={() => setEditMajorOpen(!editMajorOpen)}
  >
    <span>{editMajor || "선택해주세요"}</span>
    <span className="select-arrow">⌵</span>
  </button>

  {editMajorOpen && (
    <ul className="select-list">
      {majors.map((item) => (
        <li key={item}>
          <button
            type="button"
            onClick={() => {
              setEditMajor(item);
              setEditMajorOpen(false);
            }}
          >
            {item}
          </button>
        </li>
      ))}
    </ul>
  )}
</div>

        <button className="password-change-button" type="button">
          비밀번호 변경하러 가기
        </button>
      </section>

      <section className="edit-submit-card">
        <button
  className="edit-submit-button"
  onClick={handleSave}
  disabled={!canSave}
>
  수정 완료
</button>
      </section>
    </div>
  );
}

function MyPostCard({ post }) {
  return (
    <article className="post-card">
      <div className="post-body">
        <div className="post-image" />

        <div className="post-content">
          <span className="badge">{post.category}</span>
          <p>
            설명
            <br />
            및
            <br />
            가격
          </p>
        </div>
      </div>

      <div className="post-meta">
        <span>♡ {post.likes}</span>
        <span>▢ {post.comments}</span>
      </div>

      <div className="post-actions">
        <button>✎ 수정</button>
        <button className="delete">⌫ 삭제</button>
      </div>
    </article>
  );
}

function MyPostsPage({ onMove }) {
  return (
    <div className="phone posts-phone">
      <header className="posts-header">
        <button className="posts-back-button" onClick={() => onMove("main")}>
          ‹
        </button>
        <strong>내가 쓴 글</strong>
        <span>5개</span>
      </header>

      <div className="post-list">
        {posts.map((post) => (
          <MyPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default function MyPage() {
  const [page, setPage] = useState("main");

  if (page === "edit") {
    return <EditProfilePage onMove={setPage} />;
  }

  if (page === "posts") {
    return <MyPostsPage onMove={setPage} />;
  }

  return <MainMyPage onMove={setPage} />;
}

