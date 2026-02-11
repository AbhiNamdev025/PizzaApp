import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Mail,
  Lock,
  KeyRound,
  ArrowLeft,
  Loader2,
  Pizza,
  Eye,
  EyeOff,
} from "lucide-react";
import styles from "./forgotpassword.module.css";
import { BASE_URL } from "../../../utils/constant";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("OTP sent to your email");
        setStep(2);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Enter 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/user/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("OTP Verified");
        setStep(3);
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password reset successful!");
        navigate("/");
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (err) {
      toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.forgotContainer}>
      <div className={styles.forgotCard}>
        <div className={styles.header}>
          <div className={styles.iconCircle}>
            <Pizza size={40} className={styles.headerIcon} />
          </div>
          <h2 className={styles.title}>
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Reset Password"}
          </h2>
          <p className={styles.subtitle}>
            {step === 1 && "Enter your email to receive a reset code"}
            {step === 2 && `An OTP has been sent to ${email}`}
            {step === 3 && "Create a new strong password"}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleRequestOTP} className={styles.form}>
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} size={20} />
                <input
                  type="email"
                  placeholder="Email Address"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? (
                <Loader2 className={styles.spinner} size={20} />
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className={styles.form}>
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <KeyRound className={styles.inputIcon} size={20} />
                <input
                  type="text"
                  placeholder="6-Digit OTP"
                  className={styles.input}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? (
                <Loader2 className={styles.spinner} size={20} />
              ) : (
                "Verify OTP"
              )}
            </button>
            <button
              type="button"
              className={styles.resendBtn}
              onClick={handleRequestOTP}
              disabled={loading}
            >
              Resend OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className={styles.form}>
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  className={styles.input}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? (
                <Loader2 className={styles.spinner} size={20} />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}

        <div className={styles.footer}>
          <Link to="/" className={styles.backLink}>
            <ArrowLeft size={18} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
