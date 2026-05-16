import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PostCreatePage.module.css';

// 부엉이 캐릭터 SVG 임포트
import owlHeader from '../assets/owl_header.svg';
import owlCancel from '../assets/owl_cancel.svg';
import owlSuccess from '../assets/owl_success.svg';
import owlContact from '../assets/owl_contact.svg';

// 카테고리 옵션
const CATEGORY_OPTIONS = [
  { id: 'textbook', label: '전공책' },
  { id: 'liberal', label: '교양책' },
  { id: 'general', label: '생활용품' },
  { id: 'lost', label: '분실물' },
  { id: 'rental', label: '대여' },
];

function PostCreatePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // ===== 폼 상태 =====
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [starRating, setStarRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [price, setPrice] = useState('');
  const [isFreeShare, setIsFreeShare] = useState(false);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  // ===== 모달/다이얼로그 상태 =====
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSuccessScreen, setIsSuccessScreen] = useState(false);

  // ===== 이미지 업로드 =====
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      alert('최대 5장까지 업로드할 수 있어요!');
      return;
    }
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random(),
    }));
    setImages([...images, ...newImages]);
    e.target.value = '';
  };

  const removeImage = (imageId) => {
    setImages(images.filter((img) => img.id !== imageId));
  };

  // ===== 카테고리 선택 =====
  const handleCategorySelect = (label) => {
    setCategory(label);
    setIsCategoryModalOpen(false);
  };

  // ===== 가격 포맷팅 =====
  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value) {
      setPrice(Number(value).toLocaleString());
    } else {
      setPrice('');
    }
  };

  // ===== 유효성 검증 =====
  const validateForm = () => {
    if (!title.trim()) return '제목을 입력해주세요.';
    if (!category) return '카테고리를 선택해주세요.';
    if (!isFreeShare && !price) return '가격을 입력해주세요.';
    if (!description.trim()) return '상세 설명을 입력해주세요.';
    return null;
  };

  // ===== 등록하기 =====
  const handleSubmit = () => {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }
    setIsSuccessScreen(true);
  };

  // ===== 취소 =====
  const handleCancel = () => {
    setIsCancelDialogOpen(true);
  };

  const confirmCancel = () => {
    setIsCancelDialogOpen(false);
    navigate('/');
  };

  // ===== 등록 완료 화면 =====
  if (isSuccessScreen) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successContent}>
          <h2 className={styles.successTitle}>
            게시물이
            <br />
            등록되었어요!
          </h2>
          <img src={owlSuccess} alt="등록 완료" className={styles.successOwl} />
          <button
            className={styles.successButton}
            onClick={() => navigate('/')}
          >
            확인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* ===== 헤더 영역 (스카이라인 + 부엉이) ===== */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <button className={styles.backButton} onClick={handleCancel}>
            ←
          </button>
          <h1 className={styles.headerTitle}>게시글 등록</h1>
          <div className={styles.headerSpacer} />
        </div>
        {/* 도시 스카이라인 배경 */}
        <div className={styles.skyline}>
          <svg viewBox="0 0 430 60" className={styles.skylineSvg}>
            <rect x="20" y="20" width="18" height="40" fill="#B8CCF0" rx="2" />
            <rect x="42" y="10" width="14" height="50" fill="#A3BBE8" rx="2" />
            <rect x="60" y="25" width="20" height="35" fill="#C5D6F5" rx="2" />
            <rect x="85" y="5" width="12" height="55" fill="#9BB4E3" rx="2" />
            <rect x="100" y="18" width="22" height="42" fill="#B0C5EF" rx="2" />
            <rect x="128" y="8" width="16" height="52" fill="#A8BFE9" rx="2" />
            <rect x="150" y="22" width="20" height="38" fill="#C0D2F3" rx="2" />
            <rect x="175" y="12" width="14" height="48" fill="#9FB7E5" rx="2" />
            <rect x="195" y="28" width="18" height="32" fill="#CBDAF6" rx="2" />
            <rect x="220" y="6" width="20" height="54" fill="#A5BCE7" rx="2" />
            <rect x="245" y="18" width="16" height="42" fill="#B5C9F1" rx="2" />
            <rect x="265" y="10" width="22" height="50" fill="#9DB5E4" rx="2" />
            <rect x="292" y="24" width="14" height="36" fill="#C3D4F4" rx="2" />
            <rect x="310" y="14" width="18" height="46" fill="#AABFEA" rx="2" />
            <rect x="335" y="20" width="20" height="40" fill="#BDD0F2" rx="2" />
            <rect x="360" y="8" width="16" height="52" fill="#A1B9E6" rx="2" />
            <rect x="382" y="26" width="18" height="34" fill="#C8D8F5" rx="2" />
            <rect x="405" y="15" width="14" height="45" fill="#B3C7F0" rx="2" />
          </svg>
        </div>
        {/* 부엉이 캐릭터 */}
        <div className={styles.headerOwlWrapper}>
          <img src={owlHeader} alt="부엉이" className={styles.headerOwl} />
        </div>
      </header>

      {/* ===== 메인 폼 카드 ===== */}
      <div className={styles.formCard}>
        <div className={styles.formScroll}>
          {/* ===== 이미지 업로드 ===== */}
          <div className={styles.imageSection}>
            {images.length === 0 ? (
              <div
                className={styles.imageUploadPlaceholder}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className={styles.cameraCircle}>📷</div>
                <p className={styles.uploadText}>사진을 추가해주세요</p>
                <p className={styles.uploadSub}>여러 장을 등록할 수 있어요</p>
              </div>
            ) : (
              <div className={styles.imagePreviewRow}>
                {images.map((img) => (
                  <div key={img.id} className={styles.imagePreviewItem}>
                    <img src={img.preview} alt="미리보기" className={styles.previewImg} />
                    <button className={styles.removeImageBtn} onClick={() => removeImage(img.id)}>
                      ×
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <div className={styles.addMoreImage} onClick={() => fileInputRef.current?.click()}>
                    <span>+</span>
                    <span className={styles.imageCount}>{images.length}/5</span>
                  </div>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className={styles.hiddenInput}
              onChange={handleImageUpload}
            />
          </div>

          {/* ===== 제목 ===== */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              제목 <span className={styles.required}>*</span>
            </label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.textInput}
                placeholder="제목을 입력해주세요 (최대 50자)"
                value={title}
                onChange={(e) => {
                  if (e.target.value.length <= 50) setTitle(e.target.value);
                }}
                maxLength={50}
              />
              <span className={styles.charCount}>{title.length}/50</span>
            </div>
          </div>

          {/* ===== 카테고리 ===== */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              카테고리 <span className={styles.required}>*</span>
            </label>
            <button
              className={styles.selectButton}
              onClick={() => setIsCategoryModalOpen(true)}
            >
              <span className={category ? styles.selectTextActive : styles.selectTextPlaceholder}>
                {category || '카테고리를 선택해주세요'}
              </span>
              <span className={styles.selectArrow}>▾</span>
            </button>
            <p className={styles.hintText}>
              전공책, 교양책, 생활용품, 분실물, 대여 중 선택할 수 있어요
            </p>
          </div>

          {/* ===== 물품 상태 (별점) ===== */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>물품 상태</label>
            <div className={styles.starRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={styles.starButton}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setStarRating(star)}
                  type="button"
                >
                  <span
                    className={
                      star <= (hoverRating || starRating)
                        ? styles.starFilled
                        : styles.starEmpty
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
            <p className={styles.hintText}>
              별 1개(아쉬워요) ~ 5개(거의 새것이에요)로 상태를 알려주세요
            </p>
          </div>

          {/* ===== 가격 ===== */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>가격</label>
            <div className={styles.priceRow}>
              <div className={styles.priceInputBox}>
                <input
                  type="text"
                  className={styles.priceInput}
                  placeholder="가격을 입력해주세요"
                  value={isFreeShare ? '' : price}
                  onChange={handlePriceChange}
                  disabled={isFreeShare}
                />
                <span className={styles.priceUnit}>원</span>
              </div>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={isFreeShare}
                  onChange={(e) => {
                    setIsFreeShare(e.target.checked);
                    if (e.target.checked) setPrice('');
                  }}
                />
                <span className={styles.checkboxCustom}>
                  {isFreeShare && <span className={styles.checkMark}>✓</span>}
                </span>
                <span className={styles.checkboxText}>무료나눔</span>
              </label>
            </div>
            <p className={styles.hintText}>
              체크 시 가격이 0원으로 설정됩니다
            </p>
          </div>

          {/* ===== 거래 희망 장소 ===== */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>거래 희망 장소</label>
            <div className={styles.locationInputBox}>
              <span className={styles.locationIcon}>📍</span>
              <input
                type="text"
                className={styles.locationInput}
                placeholder="예) 서울캠퍼스 학생회관 앞"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <p className={styles.hintText}>
              직접 거래를 위한 장소를 알려주세요
            </p>
          </div>

          {/* ===== 연락 방법 ===== */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>연락 방법</label>
            <button
              className={styles.contactButton}
              onClick={() => setIsContactModalOpen(true)}
              type="button"
            >
              <span className={styles.contactIcon}>💬</span>
              <span>쪽지로 연락받기</span>
            </button>
            <p className={styles.hintText}>
              안전한 거래를 위해 쪽지로만 연락을 주고받아요
            </p>
          </div>

          {/* ===== 상세 설명 ===== */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>상세 설명</label>
            <div className={styles.textareaWrapper}>
              <textarea
                className={styles.textArea}
                placeholder="상품에 대해 자세히 설명해주세요 (최대 1000자)"
                value={description}
                onChange={(e) => {
                  if (e.target.value.length <= 1000) setDescription(e.target.value);
                }}
                maxLength={1000}
                rows={4}
              />
              <span className={styles.charCountArea}>{description.length}/1000</span>
            </div>
            <p className={styles.hintText}>
              구성품, 사용 기간, 하자 여부 등 자세히 적어주시면 거래가 더 잘 성사돼요
            </p>
          </div>
        </div>
      </div>

      {/* ===== 하단 버튼 ===== */}
      <div className={styles.bottomActions}>
        <button className={styles.cancelButton} onClick={handleCancel} type="button">
          취소
        </button>
        <button className={styles.submitButton} onClick={handleSubmit} type="button">
          등록하기
        </button>
      </div>

      {/* ===== 카테고리 선택 모달 ===== */}
      {isCategoryModalOpen && (
        <div className={styles.overlay} onClick={() => setIsCategoryModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>카테고리</h3>
              <button className={styles.modalClose} onClick={() => setIsCategoryModalOpen(false)}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              {CATEGORY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  className={`${styles.modalOption} ${
                    category === opt.label ? styles.modalOptionActive : ''
                  }`}
                  onClick={() => handleCategorySelect(opt.label)}
                >
                  <span>{opt.label}</span>
                  <span className={styles.modalCheck}>
                    {category === opt.label ? '✔' : ''}
                  </span>
                </button>
              ))}
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.modalCancelBtn}
                onClick={() => setIsCategoryModalOpen(false)}
              >
                취소
              </button>
              <button
                className={styles.modalConfirmBtn}
                onClick={() => setIsCategoryModalOpen(false)}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 쪽지 연락 모달 ===== */}
      {isContactModalOpen && (
        <div className={styles.overlay} onClick={() => setIsContactModalOpen(false)}>
          <div className={styles.contactModal} onClick={(e) => e.stopPropagation()}>
            <img src={owlContact} alt="쪽지 연락" className={styles.contactOwl} />
            <h3 className={styles.contactModalTitle}>쪽지로 연락받기</h3>
            <ul className={styles.contactInfoList}>
              <li>개인 정보 보호</li>
              <li>분쟁시 예방</li>
              <li>서기 예방</li>
            </ul>
            <button
              className={styles.contactConfirmBtn}
              onClick={() => setIsContactModalOpen(false)}
            >
              확인
            </button>
            <p className={styles.contactDismiss}>다시 보지 않기</p>
          </div>
        </div>
      )}

      {/* ===== 취소 확인 다이얼로그 ===== */}
      {isCancelDialogOpen && (
        <div className={styles.overlay} onClick={() => setIsCancelDialogOpen(false)}>
          <div className={styles.cancelDialog} onClick={(e) => e.stopPropagation()}>
            <img src={owlCancel} alt="취소 확인" className={styles.cancelOwl} />
            <div className={styles.cancelBox}>
              <p className={styles.cancelTitle}>작성을 취소하시겠어요?</p>
              <p className={styles.cancelSub}>입력된 내용은 저장되지 않아요.</p>
              <div className={styles.cancelActions}>
                <button
                  className={styles.cancelNo}
                  onClick={() => setIsCancelDialogOpen(false)}
                >
                  취소
                </button>
                <button className={styles.cancelYes} onClick={confirmCancel}>
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCreatePage;