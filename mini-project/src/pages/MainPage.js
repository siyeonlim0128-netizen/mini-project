import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoHome, GoHeart, GoCommentDiscussion, GoPerson } from 'react-icons/go';
import styles from './MainPage.module.css';

const CATEGORIES = [
  '전체 카테고리',
  '전공책',
  '교양책',
  '일반물품',
  '분실물',
  '생활용품',
  '대여',
  '기타',
];

const SORT_OPTIONS = ['최신순', '관심순', '가격 낮은 순'];

const DUMMY_POSTS = [
  { id: 1, title: '경영학원론 교재 팝니다', price: '12,000원', category: '전공책', image: null },
  { id: 2, title: '과잠 L사이즈 거의 새거', price: '25,000원', category: '일반물품', image: null },
  { id: 3, title: '일본어 교양 교재', price: '8,000원', category: '교양책', image: null },
];

function MainPage() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체 카테고리');
  const [activeSort, setActiveSort] = useState('최신순');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);

  const toggleLike = (postId) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter((id) => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };

  const filteredPosts = DUMMY_POSTS.filter((post) => {
    if (selectedCategory !== '전체 카테고리') {
      return post.category === selectedCategory;
    }
    return true;
  });

  const searchedPosts = filteredPosts.filter((post) =>
    post.title.includes(searchText)
  );

  return (
    <div className={styles.container}>
      {/* ===== 헤더 ===== */}
      <header className={styles.header}>
        <h1 className={styles.logo}>BOO-Market</h1>
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
      <button className={styles.fab} onClick={() => navigate('/create')}>
        +
      </button>

      {/* ===== 하단 네비게이션 바 ===== */}
      <nav className={styles.bottomNav}>
        <button className={`${styles.navItem} ${styles.navItemActive}`}>
          <GoHome className={styles.navIcon} />
          <span className={styles.navLabel}>홈버튼</span>
        </button>
        <button className={styles.navItem}>
          <GoHeart className={styles.navIcon} />
          <span className={styles.navLabel}>관심상품</span>
        </button>
        <button className={styles.navItem}>
          <GoCommentDiscussion className={styles.navIcon} />
          <span className={styles.navLabel}>메세지</span>
        </button>
        <button className={styles.navItem}>
          <GoPerson className={styles.navIcon} />
          <span className={styles.navLabel}>마이페이지</span>
        </button>
      </nav>
    </div>
  );
}

export default MainPage;