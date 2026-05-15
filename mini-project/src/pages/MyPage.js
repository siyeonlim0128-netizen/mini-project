import React, { useState } from "react";
import "./MyPage.css";

const posts = [
  { id: 1, category: "교재", likes: 12, comments: 3 },
  { id: 2, category: "분실물", likes: 8, comments: 1 },
  { id: 3, category: "교재", likes: 45, comments: 12 },
];

function ProfileSummary() {
  return (
    <section className="card profile-card">
      <div className="avatar" />

      <div className="profile-info">
        <div className="name-row">
          <strong>마프 3조</strong>
          <span className="verified">●</span>
        </div>
        <p>성재우 · 컴퓨터공학부</p>
      </div>

      <button className="icon-button" aria-label="설정">
        ⚙
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
  return (
    <section className="card menu-card">
      <button className="menu-item" onClick={() => onMove("edit")}>
        <span className="menu-icon">♙</span>
        <span>회원 정보 수정</span>
        <span className="chevron">›</span>
      </button>

      <button className="menu-item" onClick={() => onMove("posts")}>
        <span className="menu-icon">▣</span>
        <span>내가 쓴 글</span>
        <span className="chevron">›</span>
      </button>

      <button className="menu-item">
        <span className="menu-icon">⚑</span>
        <span>신고하기</span>
        <span className="chevron">›</span>
      </button>

      <button className="menu-item">
        <span className="menu-icon">↪</span>
        <span>로그아웃</span>
        <span className="chevron">›</span>
      </button>

      <button className="menu-item danger">
        <span className="menu-icon">♧</span>
        <span>회원 탈퇴</span>
      </button>
    </section>
  );
}

function BottomNav({ onMove }) {
  return (
    <nav className="bottom-nav">
      <button>
        <span>⌂</span>
        홈
      </button>

      <button onClick={() => onMove("posts")}>
        <span>▤</span>
        내 글
      </button>

      <button className="active" onClick={() => onMove("main")}>
        <span>●</span>
        마이
      </button>
    </nav>
  );
}

function MainMyPage({ onMove }) {
  return (
    <div className="phone">
      <h2 className="page-title">마이페이지-기본</h2>
      <ProfileSummary />
      <MenuList onMove={onMove} />
      <BottomNav onMove={onMove} />
    </div>
  );
}

function EditProfilePage({ onMove }) {
  return (
    <div className="phone">
      <section className="card edit-top">
        <button className="back-button" onClick={() => onMove("main")}>
          ‹
        </button>
        <div className="large-avatar" />
      </section>

      <section className="card form-card">
        <label>
          닉네임
          <div className="input-row">
            <input />
            <button>중복확인</button>
          </div>
          <small>사용가능한 닉네임입니다.</small>
        </label>

        <label>
          이름
          <input />
        </label>

        <label>
          본전공
          <select defaultValue="">
            <option value="" disabled />
            <option>컴퓨터공학부</option>
            <option>소프트웨어학부</option>
            <option>디자인학부</option>
          </select>
        </label>

        <button className="wide-button">비밀번호 변경하러 가기</button>
      </section>

      <button className="submit-button" onClick={() => onMove("main")}>
        수정 완료
      </button>
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

