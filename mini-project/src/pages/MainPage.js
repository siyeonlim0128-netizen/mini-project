import React, { useState } from 'react';
import styles from './MainPage.module.css';
import owlHeader from '../assets/owl_header.svg';

const CATEGORIES = [
  '전체 카테고리',
  '전공책',
  '교양책',
  '의류',
  '분실물',
  '대여',
  '기타',
];

const SORT_OPTIONS = ['최신순', '관심순', '가격 낮은 순'];

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

function MainPage({ onCreateClick }) {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체 카테고리');
  const [activeSort, setActiveSort] = useState('최신순');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);
  const [currentTab, setCurrentTab] = useState('home');

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

  const likedPostsList = DUMMY_POSTS.filter((post) =>
    likedPosts.includes(post.id)
  );

  if (currentTab === 'likes') {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.logoCenter}>관심상품</h1>
        </header>
        <div className={styles.postList}>
          {likedPostsList.length > 0 ? (
            likedPostsList.map((post) => (
              <div key={post.id} className={styles.postCard}>
                <div className={styles.postImage}>
                  <span className={styles.imagePlaceholder}>사진</span>
                </div>
                <div className={styles.postInfo}>
                  <p className={styles.postTitle}>{post.title}</p>
                  <p className={styles.postPrice}>{post.price}</p>
                </div>
                <button className={styles.likeButton} onClick={() => toggleLike(post.id)}>❤️</button>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>관심상품이 없습니다.</p>
              <p className={styles.emptySubText}>홈에서 하트를 눌러 추가해보세요!</p>
            </div>
          )}
        </div>
        <nav className={styles.bottomNav}>
          <button className={styles.navItem} onClick={() => setCurrentTab('home')}>
            <svg className={styles.navSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l9-9 9 9"/><path d="M5 10v10h14V10"/></svg>
            <span className={styles.navLabel}>홈버튼</span>
          </button>
          <button className={`${styles.navItem} ${styles.navItemActive}`}>
            <svg className={styles.navSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21C12 21 4 13.5 4 8.5C4 5.46 6.46 3 9.5 3C11.06 3 12 4 12 4S12.94 3 14.5 3C17.54 3 20 5.46 20 8.5C20 13.5 12 21 12 21Z"/></svg>
            <span className={styles.navLabel}>관심상품</span>
          </button>
          <button className={styles.navItem} onClick={() => alert('메세지 페이지 준비 중!')}>
            <svg className={styles.navSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
            <span className={styles.navLabel}>메세지</span>
          </button>
          <button className={styles.navItem} onClick={() => alert('마이페이지 준비 중!')}>
            <svg className={styles.navSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/></svg>
            <span className={styles.navLabel}>마이페이지</span>
          </button>
        </nav>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.logo}>BOO-Market</h1>
        <img src={owlHeader} alt="부엉이" className={styles.owlCharacter} />
      </header>

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

      <button className={styles.fab} onClick={onCreateClick}>+</button>

      <nav className={styles.bottomNav}>
        <button className={`${styles.navItem} ${styles.navItemActive}`}>
          <svg className={styles.navSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l9-9 9 9"/><path d="M5 10v10h14V10"/></svg>
          <span className={styles.navLabel}>홈버튼</span>
        </button>
        <button className={styles.navItem} onClick={() => setCurrentTab('likes')}>
          <svg className={styles.navSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21C12 21 4 13.5 4 8.5C4 5.46 6.46 3 9.5 3C11.06 3 12 4 12 4S12.94 3 14.5 3C17.54 3 20 5.46 20 8.5C20 13.5 12 21 12 21Z"/></svg>
          <span className={styles.navLabel}>관심상품</span>
        </button>
        <button className={styles.navItem} onClick={() => alert('메세지 페이지 준비 중!')}>
          <svg className={styles.navSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
          <span className={styles.navLabel}>메세지</span>
        </button>
        <button className={styles.navItem} onClick={() => alert('마이페이지 준비 중!')}>
          <svg className={styles.navSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/></svg>
          <span className={styles.navLabel}>마이페이지</span>
        </button>
      </nav>
    </div>
  );
}

export default MainPage;