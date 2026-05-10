import React, { useState } from 'react';
import styles from './MainPage.module.css';

// 카테고리 목록
const CATEGORIES = [
  '전체 카테고리',
  '전공책',
  '교양책',
  '의류',
  '분실물',
  '대여',
  '기타',
];

// 정렬 옵션
const SORT_OPTIONS = ['최신순', '관심순', '가격 낮은 순'];

// 더미 게시글 데이터 (나중에 API 연동 시 교체)
const DUMMY_POSTS = [
  {
    id: 1,
    title: '경영학원론 교재 팝니다',
    price: '12,000원',
    category: '전공책',
    image: null,
  },
  {
    id: 2,
    title: '과잠 L사이즈 거의 새거',
    price: '25,000원',
    category: '의류',
    image: null,
  },
  {
    id: 3,
    title: '일본어 교양 교재',
    price: '8,000원',
    category: '교양책',
    image: null,
  },
];

function MainPage() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체 카테고리');
  const [activeSort, setActiveSort] = useState('최신순');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]); // 관심상품 목록

  // 하트 토글 함수
  const toggleLike = (postId) => {
    if (likedPosts.includes(postId)) {
      // 이미 좋아요 했으면 취소
      setLikedPosts(likedPosts.filter((id) => id !== postId));
    } else {
      // 좋아요 추가
      setLikedPosts([...likedPosts, postId]);
    }
  };

  // 카테고리 필터링
  const filteredPosts = DUMMY_POSTS.filter((post) => {
    if (selectedCategory !== '전체 카테고리') {
      return post.category === selectedCategory;
    }
    return true;
  });

  // 검색 필터링
  const searchedPosts = filteredPosts.filter((post) =>
    post.title.includes(searchText)
  );

  return (
    <div className={styles.container}>
      {/* ===== 헤더 ===== */}
      <header className={styles.header}>
        <h1 className={styles.logo}>
          BOO-Market
          <span className={styles.logoIcon}>🦉</span>
        </h1>
      </header>

      {/* ===== 검색바 ===== */}
      <div className={styles.searchBar}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="검색어를 입력하세요"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* ===== 카테고리 드롭박스 ===== */}
      <div className={styles.filterSection}>
        <div className={styles.categoryWrapper}>
          <button
            className={styles.categoryButton}
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
            {selectedCategory}
            <span className={styles.arrow}>▾</span>
          </button>

          {isCategoryOpen && (
            <ul className={styles.categoryDropdown}>
              {CATEGORIES.map((cat) => (
                <li
                  key={cat}
                  className={`${styles.categoryItem} ${
                    selectedCategory === cat ? styles.categoryItemActive : ''
                  }`}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setIsCategoryOpen(false);
                  }}
                >
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ===== 정렬 필터 ===== */}
        <div className={styles.sortButtons}>
          {SORT_OPTIONS.map((option) => (
            <button
              key={option}
              className={`${styles.sortButton} ${
                activeSort === option ? styles.sortButtonActive : ''
              }`}
              onClick={() => setActiveSort(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* ===== 게시글 리스트 ===== */}
      <div className={styles.postList}>
        {searchedPosts.length > 0 ? (
          searchedPosts.map((post) => (
            <div key={post.id} className={styles.postCard}>
              <div className={styles.postImage}>
                {post.image ? (
                  <img src={post.image} alt={post.title} />
                ) : (
                  <span className={styles.imagePlaceholder}>사진</span>
                )}
              </div>
              <div className={styles.postInfo}>
                <p className={styles.postTitle}>{post.title}</p>
                <p className={styles.postPrice}>{post.price}</p>
              </div>
              {/* ===== 하트 버튼 ===== */}
              <button
                className={styles.likeButton}
                onClick={() => toggleLike(post.id)}
              >
                {likedPosts.includes(post.id) ? '❤️' : '🤍'}
              </button>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>등록된 게시글이 없습니다.</p>
          </div>
        )}
      </div>

      {/* ===== 플로팅 버튼 (글쓰기) ===== */}
      <button
        className={styles.fab}
        onClick={() => {
          // TODO: react-router 연결 후 navigate('/create') 로 변경
          alert('게시글 등록 페이지로 이동합니다.');
        }}
      >
        +
      </button>

      {/* ===== 하단 네비게이션 바 ===== */}
      <nav className={styles.bottomNav}>
        <button className={`${styles.navItem} ${styles.navItemActive}`}>
          <span className={styles.navIcon}>🏠</span>
          <span className={styles.navLabel}>홈버튼</span>
        </button>
        <button className={styles.navItem}>
          <span className={styles.navIcon}>♡</span>
          <span className={styles.navLabel}>관심상품</span>
        </button>
        <button className={styles.navItem}>
          <span className={styles.navIcon}>💬</span>
          <span className={styles.navLabel}>메세지</span>
        </button>
        <button className={styles.navItem}>
          <span className={styles.navIcon}>👤</span>
          <span className={styles.navLabel}>마이페이지</span>
        </button>
      </nav>
    </div>
  );
}

export default MainPage;