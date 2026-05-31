import React, { useEffect, useState } from 'react';
import styles from './PostCreatePage.module.css';
import owlSuccess from '../assets/owl_wink_heart.svg';
import owlContact from '../assets/owl_contact.svg';

const CATEGORIES = ['전공책', '교양책', '생활용품', '분실물', '대여', '기타'];

function PostCreatePage({ onBack }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState(0);
  const [price, setPrice] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  const handleSubmit = () => {
    if (!title || !category) {
      alert('제목과 카테고리는 필수입니다!');
      return;
    }
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successCard}>
          <p className={styles.successText}>
            게시물이<br />등록되었어요!
          </p>
          <img src={owlSuccess} alt="등록 완료" className={styles.successImage} />
          <button className={styles.confirmButton} onClick={onBack}>
            확인
          </button>
        </div>
      </div>
    );
  }

  if (showContact) {
    return (
      <div className={styles.contactModal}>
        <div className={styles.contactModalContent}>
          <img src={owlContact} alt="쪽지" className={styles.contactOwlImage} />
          <h2 className={styles.contactModalTitle}>쪽지로 연락받기</h2>
          <p className={styles.contactModalDesc}>
            안전하고 편리한 거래를 위해<br />앱 내 쪽지를 이용해 주세요!
          </p>
          <div className={styles.contactFeatureList}>
            <div className={styles.contactFeature}>
              <div className={styles.contactFeatureIcon}>🔒</div>
              <div>
                <p className={styles.contactFeatureTitle}>개인정보 보호</p>
                <p className={styles.contactFeatureDesc}>전화번호, 메일 없이도 개인정보를 안전하게 보호할 수 있어요.</p>
              </div>
            </div>
            <div className={styles.contactFeature}>
              <div className={styles.contactFeatureIcon}>💬</div>
              <div>
                <p className={styles.contactFeatureTitle}>편리한 소통</p>
                <p className={styles.contactFeatureDesc}>구매 문의, 가격 협의 등 모든 대화를 앱 내 쪽지에서 간편하게!</p>
              </div>
            </div>
            <div className={styles.contactFeature}>
              <div className={styles.contactFeatureIcon}>🛡️</div>
              <div>
                <p className={styles.contactFeatureTitle}>사기 예방</p>
                <p className={styles.contactFeatureDesc}>외부 링크나 사기 부담 없이 안전한 거래 환경을 제공해요.</p>
              </div>
            </div>
          </div>
          <button className={styles.contactConfirmButton} onClick={() => setShowContact(false)}>
            확인
          </button>
          <button className={styles.contactDismiss} onClick={() => setShowContact(false)}>
            다시 보지 않기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <button className={styles.backButton} onClick={onBack}>←</button>
          <h1 className={styles.headerTitle}>게시물 등록</h1>
          <div className={styles.headerSpacer} />
        </div>

        <div className={styles.imageUpload}>
          <div className={styles.cameraIcon}>📷</div>
          <p className={styles.uploadText}>사진을 추가해주세요.</p>
          <p className={styles.uploadSubText}>최대 5장을 등록할 수 있어요.</p>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>제목</label>
          <input
            type="text"
            className={styles.inputBox}
            placeholder="제목을 입력해주세요"
            maxLength={50}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>카테고리</label>
          <select
            className={styles.inputBox}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">카테고리를 선택해주세요</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>물품 상태</label>
          <div className={styles.starRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`${styles.star} ${rating >= star ? styles.starActive : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>가격</label>
          <div className={styles.priceRow}>
            <input
              type="text"
              className={styles.inputBox}
              placeholder="가격을 입력해주세요"
              value={isFree ? '' : price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={isFree}
            />
            <label className={styles.freeLabel}>
              <input
                type="checkbox"
                checked={isFree}
                onChange={(e) => setIsFree(e.target.checked)}
                className={styles.checkbox}
              />
              무료나눔
            </label>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>거래 희망 장소</label>
          <input
            type="text"
            className={styles.inputBox}
            placeholder="예) 서울캠퍼스 학생회관 앞"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>연락 방법</label>
          <button className={styles.contactMethod} onClick={() => setShowContact(true)}>
            <span className={styles.contactIcon}>💬</span>
            쪽지로 연락받기
          </button>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>상세 설명</label>
          <textarea
            className={styles.textareaBox}
            placeholder={'상품에 대해 자세히 설명해주세요'}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            rows={4}
          />
        </div>
      </div>

      <div className={styles.bottomActions}>
        <button className={styles.cancelButton} onClick={onBack}>취소</button>
        <button className={styles.submitButton} onClick={handleSubmit}>등록하기</button>
      </div>
    </div>
  );
}

export default PostCreatePage;
