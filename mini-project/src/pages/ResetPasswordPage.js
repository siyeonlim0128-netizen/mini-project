import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./ResetPasswordPage.css";
import Boo9 from "../components/Boo9.svg";

function ResetPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [emailTried, setEmailTried] = useState(false);
  const [emailSendFailed, setEmailSendFailed] = useState(false);
  const [code, setCode] = useState("");
  const [codeTried, setCodeTried] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordCheckTried, setPasswordCheckTried] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailValid = /^[^\s@]+@hufs\.ac\.kr$/i.test(email.trim());
  const passwordMatched =
    password.length > 0 && passwordCheck.length > 0 && password === passwordCheck;
  const passwordConfirmed = passwordCheckTried && passwordMatched;

  const sendEmailCode = async () => {
    setEmailTried(true);
    setEmailSendFailed(false);

    if (!emailValid) return;

    try {
      const response = await fetch("http://localhost:4000/api/send-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        setEmailSendFailed(true);
        return;
      }

      setCode("");
      setCodeTried(false);
      setStep(2);
    } catch (error) {
      setEmailSendFailed(true);
    }
  };

  const verifyEmailCode = async () => {
    setCodeTried(true);

    if (code.length !== 6) return;

    try {
      const response = await fetch("http://localhost:4000/api/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      if (response.ok) {
        setStep(3);
      }
    } catch (error) {
      // codeTried already shows the same mismatch message.
    }
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="reset-page">
      <div className="reset-card">
        <h2 className="reset-title">
          {step === 4 ? "비밀번호 재설정 완료" : "비밀번호 재설정"}
        </h2>

        <div className="stepper">
          {["이메일", "인증", "비밀번호", "완료"].map((label, index) => {
            const number = index + 1;
            const active = step === number;
            const done = step > number;

            return (
              <React.Fragment key={label}>
                <div className="step-item">
                  <div className={`step-circle ${active ? "active" : ""} ${done ? "done" : ""}`}>
                    {done ? "✓" : number}
                  </div>
                  <span className={active || done ? "green" : ""}>{label}</span>
                </div>

                {index < 3 && <div className={`step-line ${step > number ? "done" : ""}`} />}
              </React.Fragment>
            );
          })}
        </div>

        {step === 1 && (
          <div className="form-box">
            <label>학교 이메일</label>
            <div className="row">
              <input
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setEmailTried(false);
                  setEmailSendFailed(false);
                  setCode("");
                  setCodeTried(false);
                }}
                type="email"
                placeholder="example@hufs.ac.kr"
              />
              <button type="button" onClick={sendEmailCode}>
                인증하기
              </button>
            </div>
            {emailTried && !emailValid && (
              <p className="error-text">유효하지 않은 이메일입니다.</p>
            )}
            {emailSendFailed && (
              <p className="error-text">인증번호 전송에 실패했습니다.</p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="form-box">
            <label>학교 이메일</label>
            <input className="disabled-input" value={email} disabled />

            <label>인증번호</label>
            <div className="row">
              <input
                value={code}
                inputMode="numeric"
                maxLength={6}
                placeholder="숫자 6자리 입력"
                onChange={(event) => {
                  setCode(event.target.value.replace(/\D/g, "").slice(0, 6));
                  setCodeTried(false);
                }}
              />
              <button type="button" onClick={verifyEmailCode} disabled={code.length !== 6}>
                확인
              </button>
            </div>
            {codeTried && (
              <p className="error-text">인증번호가 일치하지 않습니다.</p>
            )}

            <div className="bottom-buttons">
              <button type="button" onClick={handlePrev}>
                이전
              </button>
              <button type="button" disabled>
                다음
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-box">
            <label>학교 이메일</label>
            <input className="disabled-input" value={email} disabled />
            <p className="success-text">이메일 인증이 완료되었습니다.</p>

            <label>새 비밀번호</label>
            <div className="password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setPasswordCheckTried(false);
                }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <label>비밀번호 확인</label>
            <div className="row">
              <div className="password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordCheck}
                  onChange={(event) => {
                    setPasswordCheck(event.target.value);
                    setPasswordCheckTried(false);
                  }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button type="button" onClick={() => setPasswordCheckTried(true)}>
                확인
              </button>
            </div>

            {passwordCheckTried && (
              <p className={passwordMatched ? "success-text" : "error-text"}>
                {passwordMatched
                  ? "비밀번호가 일치합니다."
                  : "비밀번호가 일치하지 않습니다."}
              </p>
            )}

            <button
              type="button"
              className="submit-btn"
              disabled={!passwordConfirmed}
              onClick={handleNext}
            >
              비밀번호 변경하기
            </button>

            <div className="bottom-buttons">
              <button type="button" onClick={handlePrev}>
                이전
              </button>
              <button type="button" disabled>
                다음
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="complete-box">
            <h3>
              비밀번호 변경이
              <br />
              완료되었습니다.
            </h3>
            <img src={Boo9} alt="완료 캐릭터" />
            <button type="button" onClick={() => (window.location.href = "/login")}>
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
