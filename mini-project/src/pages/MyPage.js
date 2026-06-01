import React, { useEffect, useState } from "react";
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
  ChevronLeft,
} from "lucide-react";
import "./MyPage.css";
import { apiFetch } from "../api";

const getMyPosts = () => {
  const savedPosts = localStorage.getItem("myPosts");

  if (savedPosts) {
    try {
      return JSON.parse(savedPosts).map((post) => ({
        ...post,
        isLocal: post.isLocal ?? true,
      }));
    } catch {
      return [];
    }
  }

  return [1, 2, 3]
    .map((id) => {
      const category = localStorage.getItem(`postCategory${id}`);
      const description = localStorage.getItem(`postDescription${id}`);
      const image = localStorage.getItem(`postImage${id}`);

      if (!category && !description && !image) {
        return null;
      }

      return {
        id,
        category: category || "전공책",
        description: description || "",
        image,
        likes: Number(localStorage.getItem(`postLikes${id}`)) || 0,
        comments: Number(localStorage.getItem(`postComments${id}`)) || 0,
        isLocal: true,
      };
    })
    .filter(Boolean);
};

const saveMyPosts = (posts) => {
  localStorage.setItem("myPosts", JSON.stringify(posts));
};

const removeStoredPost = (postId, posts) => {
  const nextPosts = posts.filter((post) => post.id !== postId);

  saveMyPosts(nextPosts);
  localStorage.removeItem(`postCategory${postId}`);
  localStorage.removeItem(`postDescription${postId}`);
  localStorage.removeItem(`postImage${postId}`);
  localStorage.removeItem(`postLikes${postId}`);
  localStorage.removeItem(`postComments${postId}`);

  return nextPosts;
};

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

const NAV_PATHS = {
  home: "/main",
  favorite: "/wishlist",
  message: "/messages",
  mypage: "/mypage",
};

function ProfileSummary() {
  const [profile, setProfile] = useState(null);
  const localPostCount = getMyPosts().length;
  const userName = profile?.name || localStorage.getItem("name") || "이름";
  const userNickname = profile?.nickname || localStorage.getItem("nickname") || "닉네임";
  const userMajor = profile?.major?.name || localStorage.getItem("major") || "본전공";
  const userProfileImage = localStorage.getItem("userProfileImage");
  const salesPostCount = Math.max(profile?.sales_post_count ?? 0, localPostCount);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiFetch("/api/user/me", { auth: true });
        setProfile(response?.data || null);
      } catch (error) {
        setProfile(null);
      }
    };

    fetchProfile();
  }, []);

  return (
    <section className="card profile-card">
      <div className="avatar">
        {userProfileImage && <img src={userProfileImage} alt="프로필 이미지" />}
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

      <div className="stats">
        <div>
          <strong>{salesPostCount}</strong>
          <span>내 글</span>
        </div>
        <div>
          <strong>{profile?.transaction_count ?? 12}</strong>
          <span>거래횟수</span>
        </div>
        <div>
          <strong>{profile?.wish_count ?? 6}</strong>
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

  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST", auth: true });
    } catch (error) {
      // Even if the server token is already expired, clear local login state.
    }

    localStorage.removeItem("accessToken");
    setModalType(null);
    alert("로그아웃되었습니다.");
    window.location.href = "/login";
  };

  const handleWithdraw = async () => {
    try {
      await apiFetch("/api/user/delete", { method: "DELETE", auth: true });
    } catch (error) {
      alert(error.message);
      return;
    }

    localStorage.clear();
    setModalType(null);
    alert("탈퇴 처리되었습니다.");
    window.location.href = "/";
  };

  const modalMessage =
    modalType === "logout"
      ? "정말로 로그아웃하시겠습니까?"
      : "정말로 탈퇴하시겠습니까?";

  const confirmText = modalType === "logout" ? "로그아웃" : "탈퇴";

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

        <button
          className="menu-item"
          onClick={() => {
            window.location.href = "/report";
          }}
        >
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

        <button
          className="menu-item danger"
          onClick={() => setModalType("withdraw")}
        >
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
  const moveToTab = (tab) => {
    if (tab === "mypage") {
      window.history.pushState(null, "", NAV_PATHS.mypage);
      onMove("main");
      return;
    }

    window.location.href = NAV_PATHS[tab];
  };

  return (
    <nav className="bottom-nav">
      <button
        className={activeTab === "home" ? "active" : ""}
        onClick={() => moveToTab("home")}
      >
        <Home size={30} strokeWidth={2.8} />
        <span>홈버튼</span>
      </button>

      <button
        className={activeTab === "favorite" ? "active" : ""}
        onClick={() => moveToTab("favorite")}
      >
        <Heart size={32} strokeWidth={2.8} />
        <span>관심상품</span>
      </button>

      <button
        className={activeTab === "message" ? "active" : ""}
        onClick={() => moveToTab("message")}
      >
        <MessageCircle size={32} strokeWidth={2.8} />
        <span>메세지</span>
      </button>

      <button
        className={activeTab === "mypage" ? "active" : ""}
        onClick={() => moveToTab("mypage")}
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
  const [editMajor, setEditMajor] = useState(
    localStorage.getItem("major") || ""
  );
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("userProfileImage") || ""
  );
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameTried, setNicknameTried] = useState(false);
  const [editMajorOpen, setEditMajorOpen] = useState(false);
  const [majorOptions, setMajorOptions] = useState([]);
  const [saveError, setSaveError] = useState("");

  const nicknameChanged = editNickname.trim() !== originalNickname.trim();
  const canSave = !nicknameChanged || nicknameChecked;
  const selectedMajor = majorOptions.find((item) => item.name === editMajor);

  const duplicatedNicknames = ["admin", "test", "관리자", "hufs"];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [profileResponse, majorsResponse] = await Promise.all([
          apiFetch("/api/user/me", { auth: true }),
          apiFetch("/api/majors"),
        ]);
        const profile = profileResponse?.data;

        setMajorOptions(majorsResponse?.data || []);

        if (profile) {
          setEditName(profile.name || "");
          setEditNickname(profile.nickname || "");
          setEditMajor(profile.major?.name || "");
        }
      } catch (error) {
        setMajorOptions(majors.map((name, index) => ({ id: index + 1, name })));
      }
    };

    fetchInitialData();
  }, []);

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

  const handleSave = async () => {
    if (!canSave) return;

    setSaveError("");

    try {
      await apiFetch("/api/user/update", {
        method: "PUT",
        auth: true,
        body: {
          nickname: editNickname,
          major_id: selectedMajor?.id,
        },
      });

      localStorage.setItem("name", editName);
      localStorage.setItem("nickname", editNickname);
      localStorage.setItem("major", editMajor);
      localStorage.setItem("userProfileImage", profileImage);
    } catch (error) {
      setSaveError(error.message);
      return;
    }

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
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
      </section>

      <section className="edit-form-card">
        <label className="edit-label">닉네임</label>
        <div className="edit-nickname-row">
          <input
            value={editNickname}
            onChange={(event) => {
              setEditNickname(event.target.value);
              setNicknameChecked(false);
              setNicknameTried(false);
            }}
            onBlur={handleNicknameBlur}
          />

          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
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
          onChange={(event) => setEditName(event.target.value)}
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
              {(majorOptions.length
                ? majorOptions
                : majors.map((name, index) => ({ id: index + 1, name }))
              ).map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setEditMajor(item.name);
                      setEditMajorOpen(false);
                    }}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          className="password-change-button"
          type="button"
          onClick={() => {
            window.location.href = "/password-reset";
          }}
        >
          비밀번호 변경하러 가기
        </button>
      </section>

      <section className="edit-submit-card">
        {saveError && <p className="edit-error">{saveError}</p>}
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

function MyPostCard({ post, onDeleteRequest }) {
  const handleEditPost = () => {
    localStorage.setItem("editingPostId", String(post.id));
    window.location.href = `/posts/edit/${post.id}`;
  };

  return (
    <article className="post-card">
      <div className="post-body">
        <div className="post-image">
          {post.image && <img src={post.image} alt="게시글 이미지" />}
        </div>

        <div className="post-content">
          <span className="badge">{post.category}</span>
          <p>{post.description}</p>
        </div>
      </div>

      <div className="post-meta">
        <span>
          <Heart size={15} strokeWidth={2.4} />
          {post.likes}
        </span>
        <span>
          <MessageCircle size={15} strokeWidth={2.4} />
          {post.comments}
        </span>
      </div>

      <div className="post-actions">
        <button onClick={handleEditPost}>✎ 수정</button>
        <button className="delete" onClick={() => onDeleteRequest(post)}>
          ⌫ 삭제
        </button>
      </div>
    </article>
  );
}

function MyPostsPage({ onMove }) {
  const [myPosts, setMyPosts] = useState(getMyPosts);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteDone, setDeleteDone] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const response = await apiFetch("/api/user/me/goods", { auth: true });
        const posts = (response?.data || []).map((post) => ({
          id: post.goods_id,
          category: "",
          description: `${post.title || ""}${post.price ? ` · ${post.price}원` : ""}`,
          image: post.thumbnail_url,
          likes: 0,
          comments: 0,
          isLocal: false,
        }));

        setMyPosts([...getMyPosts(), ...posts]);
      } catch (error) {
        setMyPosts(getMyPosts());
      }
    };

    fetchMyPosts();
  }, []);

  const closeDeleteConfirm = () => {
    setDeleteTarget(null);
  };

  const confirmDeletePost = async () => {
    if (!deleteTarget) return;

    setDeleteError("");

    if (!deleteTarget.isLocal) {
      try {
        await apiFetch(`/api/goods/${deleteTarget.id}`, {
          method: "DELETE",
          auth: true,
        });
      } catch (error) {
        setDeleteError(error.message);
        return;
      }
    }

    setMyPosts(removeStoredPost(deleteTarget.id, myPosts));
    setDeleteTarget(null);
    setDeleteDone(true);
  };

  return (
    <div className="phone posts-phone">
      <header className="posts-header">
        <button className="posts-back-button" onClick={() => onMove("main")}>
          <ChevronLeft size={24} strokeWidth={2.6} />
        </button>
        <strong>내가 쓴 글</strong>
        <span>{myPosts.length}개</span>
      </header>

      <div className="post-list">
        {myPosts.map((post) => (
          <MyPostCard
            key={post.id}
            post={post}
            onDeleteRequest={setDeleteTarget}
          />
        ))}
      </div>

      {deleteTarget && (
        <div className="post-modal-overlay">
          <div className="post-delete-modal">
            <p>정말로 삭제하시겠습니까?</p>
            {deleteError && <p className="edit-error">{deleteError}</p>}

            <div className="post-delete-actions">
              <button type="button" onClick={closeDeleteConfirm}>
                취소
              </button>
              <button
                type="button"
                className="post-delete-confirm"
                onClick={confirmDeletePost}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteDone && (
        <div className="post-modal-overlay">
          <div className="post-delete-modal post-delete-complete">
            <p>삭제되었습니다.</p>

            <button type="button" onClick={() => setDeleteDone(false)}>
              확인
            </button>
          </div>
        </div>
      )}
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
