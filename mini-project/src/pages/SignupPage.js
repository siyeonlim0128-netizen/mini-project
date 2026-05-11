import { useMemo, useState } from "react";
import { Check, Eye, EyeOff } from "lucide-react";
import "./SignupPage.css";

const steps = ["이메일", "학과", "비밀번호", "정보입력", "완료"];

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

export default function SignupPage() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailTried, setEmailTried] = useState(false);

  const [code, setCode] = useState("");
  const [codeChecked, setCodeChecked] = useState(false);
  const [codeTried, setCodeTried] = useState(false);

  const [major, setMajor] = useState("");
  const [majorOpen, setMajorOpen] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordCheckTried, setPasswordCheckTried] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showPwCheck, setShowPwCheck] = useState(false);

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameTried, setNicknameTried] = useState(false);
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);

  const emailValid = /^[^\s@]+@hufs\.ac\.kr$/i.test(email);
  const codeValid = code === "123456";
  const passwordSame = password && password === passwordCheck;
  const nicknameValid = nickname.trim().length >= 2;
  const duplicatedNicknames = ["admin", "test", "관리자", "hufs"];
  const nicknameDuplicated = duplicatedNicknames.includes(nickname.trim());

  const canNext = useMemo(() => {
    if (step === 1) return emailChecked && codeChecked;
    if (step === 2) return major !== "";
    if (step === 3) return passwordSame && passwordCheckTried;
    if (step === 4) {
      return name.length >= 2 && nicknameChecked && agree1 && agree2;
    }

    return false;
  }, [
    step,
    emailChecked,
    codeChecked,
    major,
    passwordSame,
    passwordCheckTried,
    name,
    nicknameChecked,
    agree1,
    agree2,
  ]);

  const next = () => {
    if (canNext) {
      setMajorOpen(false);
      setStep(step + 1);
    }
  };

  return (
    <main className="page">
      <section className="card">
        <h1>회원가입</h1>

        <ol className="progress">
          {steps.map((label, index) => {
            const number = index + 1;
            const done = number < step;
            const active = number === step;

            return (
              <li
                key={label}
                className={`${done ? "done" : ""} ${active ? "active" : ""}`}
              >
                <span>{done ? <Check size={14} /> : number}</span>
                <p>{label}</p>
              </li>
            );
          })}
        </ol>

        {step === 1 && (
          <div className="box">
            <label>학교 이메일</label>

            <div className="row">
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailChecked(false);
                  setEmailTried(false);
                  setCodeChecked(false);
                  setCodeTried(false);
                }}
              />

              <button
                className="check-button"
                onClick={() => {
                  setEmailTried(true);
                  setEmailChecked(emailValid);
                }}
              >
                인증하기
              </button>
            </div>

            <p className="error">
              {emailTried && !emailValid ? "유효하지 않는 이메일입니다." : ""}
            </p>

            <label>인증번호</label>

            <div className="row">
              <input
                value={code}
                placeholder={emailChecked ? "숫자 6자리 입력" : ""}
                onChange={(e) => {
                  setCode(e.target.value);
                  setCodeChecked(false);
                  setCodeTried(false);
                }}
              />

              <button
                className="check-button"
                disabled={!emailChecked}
                onClick={() => {
                  setCodeTried(true);
                  setCodeChecked(codeValid);
                }}
              >
                확인
              </button>
            </div>

            <p className={codeChecked ? "success" : "error"}>
              {codeChecked
                ? "이메일 인증이 완료되었습니다."
                : codeTried && !codeValid
                  ? "인증번호가 일치하지 않습니다."
                  : ""}
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="box">
            <label className="major-label">본전공</label>

            <div className="custom-select">
              <button
                type="button"
                className="select-button"
                onClick={() => setMajorOpen(!majorOpen)}
              >
                <span>{major || "선택해주세요"}</span>
                <span className="select-arrow">⌄</span>
              </button>

              {majorOpen && (
                <ul className="select-list">
                  {majors.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        onClick={() => {
                          setMajor(item);
                          setMajorOpen(false);
                        }}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="box">
            <label>비밀번호</label>

            <div className="password">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordCheckTried(false);
                }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <label>비밀번호 확인</label>

            <div className="row">
              <div className="password">
                <input
                  type={showPwCheck ? "text" : "password"}
                  value={passwordCheck}
                  onChange={(e) => {
                    setPasswordCheck(e.target.value);
                    setPasswordCheckTried(false);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwCheck(!showPwCheck)}
                >
                  {showPwCheck ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button
              type="button"
              className="check-button"
              disabled={!passwordCheck}
              onClick={() => setPasswordCheckTried(true)}
            >
              확인
            </button>
            </div>

            <p className={passwordSame ? "success" : "error"}>
              {passwordCheckTried
              ? passwordSame
              ? "비밀번호가 일치합니다."
              : "비밀번호가 일치하지 않습니다."
              : ""}
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="box">
            <label>이름</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />

            <label className="nickname-label">닉네임</label>
            <div className="row">
              <input
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setNicknameChecked(false);
                  setNicknameTried(false);
                }}

              />
              <button
  className="check-button"
  onClick={() => {
    setNicknameTried(true);
    setNicknameChecked(nicknameValid && !nicknameDuplicated);
  }}
>
  확인
</button>
            </div>

            <p className={nicknameChecked ? "success" : "error"}>
              {nicknameTried
              ? nicknameChecked
              ? "사용가능한 닉네임입니다."
              : "이미 존재하는 닉네임입니다."
              : ""}
            </p>

            <h3>약관동의</h3>
            <label className="check">
              <input
                type="checkbox"
                checked={agree1}
                onChange={() => setAgree1(!agree1)}
              />
              개인정보 처리방침에 동의합니다.
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={agree2}
                onChange={() => setAgree2(!agree2)}
              />
              서비스 이용약관에 동의합니다.
            </label>
          </div>
        )}

        {step === 5 && (
          <div className="complete">
            <h2>
              회원가입이
              <br />
              완료되었습니다.
            </h2>
            <img
            className="complete-image"
            src="/images/hufs-owl.png"
            alt="HUFS 마스코트"
        />
            <button onClick={() => setStep(1)}>닫기</button>
          </div>
        )}

        {step < 5 && (
          <div className="actions">
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)}>
                이전
              </button>
            )}
            <button type="button" disabled={!canNext} onClick={next}>
              {step === 4 ? "회원가입" : "다음"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
} 