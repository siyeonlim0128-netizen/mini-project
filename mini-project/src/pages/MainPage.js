import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  apiFetch,
  getAccessToken,
  getLocalWishlist,
  removeLocalWishlistItem,
  requestWish,
  saveLocalWishlistItem,
  saveLocalPostSnapshots,
} from '../api';
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

const getPostId = (post) =>
  post?.postId ?? post?.goodsId ?? post?.goods_id ?? post?.post_id ?? post?.id;

const getInterestCount = (post) =>
  Number(
    post?.wishCount ??
      post?.wish_count ??
      post?.wishlistCount ??
      post?.wishlist_count ??
      post?.wishListCount ??
      post?.wish_list_count ??
      post?.interestCount ??
      post?.interest_count ??
      post?.wishedCount ??
      post?.wished_count ??
      post?.heartCount ??
      post?.heart_count ??
      0
  ) || 0;

const getNumericPrice = (price) => {
  const numberOnly = String(price || '').replace(/[^\d]/g, '');
  return numberOnly ? Number(numberOnly) : 0;
};

const formatPrice = (post) => {
  if (post?.isFree || post?.is_free) return '무료나눔';
  if (typeof post?.price === 'number') return `${post.price.toLocaleString()}원`;
  return post?.price || '';
};

const normalizePost = (post) => {
  const id = getPostId(post);

  return {
    id,
    title: post?.title || post?.name || '제목 없음',
    price: formatPrice(post),
    category: post?.category || post?.categoryName || post?.category_name || '기타',
    image:
      post?.thumbnailUrl ||
      post?.thumbnail_url ||
      post?.image ||
      post?.images?.[0] ||
      null,
    isWished: Boolean(post?.isWished || post?.is_wished || post?.wished),
    interestCount: getInterestCount(post),
  };
};

const extractPostList = (response) => {
  const data = response?.data;
  if (Array.isArray(data?.posts)) return data.posts;
  if (Array.isArray(data?.goods)) return data.goods;
  if (Array.isArray(data)) return data;
  return [];
};

function MainPage({
  onCreateClick,
  onLikesClick,
  onMessagesClick,
  onMyPageClick,
}) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체 카테고리');
  const [activeSort, setActiveSort] = useState('최신순');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadPosts = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const response = await apiFetch('/api/posts', {
          auth: Boolean(getAccessToken()),
        });
        const backendPosts = extractPostList(response)
          .map(normalizePost)
          .filter((post) => post.id);

        if (!mounted) return;

        setPosts(backendPosts);
        saveLocalPostSnapshots(backendPosts);
        backendPosts
          .filter((post) => post.isWished)
          .forEach((post) => saveLocalWishlistItem(post));
        const localWishlistIds = getLocalWishlist()
          .map(getPostId)
          .filter(Boolean);
        setLikedPosts(
          Array.from(
            new Set([
              ...backendPosts
                .filter((post) => post.isWished)
                .map((post) => post.id),
              ...localWishlistIds,
            ])
          )
        );
      } catch (error) {
        if (!mounted) return;
        setPosts([]);
        setLikedPosts([]);
        setLoadError('게시글 목록을 불러오지 못했습니다.');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadPosts();

    return () => {
      mounted = false;
    };
  }, []);

  const toggleLike = async (post) => {
    const postId = getPostId(post);
    const token = getAccessToken();
    if (!postId) return;

    if (!token) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    const isLiked = likedPosts.some((id) => String(id) === String(postId));
    const shouldLike = !isLiked;

    setLikedPosts((prev) =>
      shouldLike
        ? Array.from(new Set([...prev, postId]))
        : prev.filter((id) => String(id) !== String(postId))
    );

    if (shouldLike) {
      saveLocalWishlistItem({ ...post, interestCount: post.interestCount + 1 });
    } else {
      removeLocalWishlistItem(postId);
    }

    setPosts((prevPosts) =>
      prevPosts.map((item) =>
        String(item.id) === String(postId)
          ? {
              ...item,
              interestCount: Math.max(
                0,
                item.interestCount + (shouldLike ? 1 : -1)
              ),
            }
          : item
      )
    );

    try {
      await requestWish(postId, shouldLike);
    } catch (error) {
      console.warn('관심상품 백엔드 요청 실패:', error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (selectedCategory !== '전체 카테고리') {
      return post.category === selectedCategory;
    }
    return true;
  });

  const searchedPosts = filteredPosts.filter((post) =>
    post.title.includes(searchText)
  );

  const sortedPosts = [...searchedPosts].sort((a, b) => {
    if (activeSort === '관심순') {
      return b.interestCount - a.interestCount;
    }

    if (activeSort === '가격 낮은 순') {
      return getNumericPrice(a.price) - getNumericPrice(b.price);
    }

    return 0;
  });

  const handlePostClick = (postId) => {
    if (!postId) return;
    navigate(`/post/${postId}`);
  };

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
        {isLoading ? (
          <div className={styles.emptyState}>
            <p>게시글을 불러오는 중입니다.</p>
          </div>
        ) : loadError ? (
          <div className={styles.emptyState}>
            <p>{loadError}</p>
          </div>
        ) : sortedPosts.length > 0 ? (
          sortedPosts.map((post) => {
            const isLiked = likedPosts.some(
              (id) => String(id) === String(post.id)
            );

            return (
              <div
                key={post.id}
                className={styles.postCard}
                role="button"
                tabIndex={0}
                onClick={() => handlePostClick(post.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handlePostClick(post.id);
                  }
                }}
              >
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
                  <p className={styles.interestCount} aria-label={`관심 ${post.interestCount}명`}>
                    <span className={styles.interestIcon}>♥</span>
                    <span>{post.interestCount}</span>
                  </p>
                </div>
                <button
                  className={styles.likeButton}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleLike(post);
                  }}
                >
                  {isLiked ? '❤️' : '🤍'}
                </button>
              </div>
            );
          })
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
        <button className={styles.navItem} onClick={onLikesClick}>
          <svg className={styles.navSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21C12 21 4 13.5 4 8.5C4 5.46 6.46 3 9.5 3C11.06 3 12 4 12 4S12.94 3 14.5 3C17.54 3 20 5.46 20 8.5C20 13.5 12 21 12 21Z"/></svg>
          <span className={styles.navLabel}>관심상품</span>
        </button>
        <button className={styles.navItem} onClick={onMessagesClick}>
          <svg className={styles.navSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
          <span className={styles.navLabel}>메세지</span>
        </button>
        <button className={styles.navItem} onClick={onMyPageClick}>
          <svg className={styles.navSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/></svg>
          <span className={styles.navLabel}>마이페이지</span>
        </button>
      </nav>
    </div>
  );
}

export default MainPage;
