import React, { useState } from "react";
import "./ResetPasswordPage.css";
import Boo9 from "../components/Boo9.svg";

function ResetPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordMatched =
    password.length > 0 && passwordCheck.length > 0 && password === passwordCheck;

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
                onChange={(event) => setEmail(event.target.value)}
                type="email"
              />
              <button type="button" onClick={handleNext}>
                인증하기
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-box">
            <label>학교 이메일</label>
            <input className="disabled-input" value={email} disabled />

            <label>인증번호</label>
            <div className="row">
              <input value={code} onChange={(event) => setCode(event.target.value)} />
              <button type="button" onClick={handleNext}>
                확인
              </button>
            </div>

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
            <p className="success-text">이메일 인증이 완료되었습니다</p>

            <label>새 비밀번호</label>
            <div className="password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "숨김" : "보기"}
              </button>
            </div>

            <label>비밀번호 확인</label>
            <div className="row">
              <div className="password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordCheck}
                  onChange={(event) => setPasswordCheck(event.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "숨김" : "보기"}
                </button>
              </div>

              <button type="button" disabled={!passwordMatched}>
                확인
              </button>
            </div>

            {passwordMatched && <p className="success-text">비밀번호가 일치합니다.</p>}

            <button
              type="button"
              className="submit-btn"
              disabled={!passwordMatched}
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
            <button type="button" onClick={() => window.history.back()}>
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
