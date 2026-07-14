import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useAuth } from "../auth/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
}: LoginModalProps) {
  const { signIn } = useAuth();

  const emailInputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const focusTimer = window.setTimeout(() => {
      emailInputRef.current?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        !isSubmitting
      ) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await signIn(email, password);

      setEmail("");
      setPassword("");
      setErrorMessage(null);

      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Giriş yapılamadı. Lütfen tekrar deneyin.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropMouseDown = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <div
      className="login-modal-backdrop"
      onMouseDown={handleBackdropMouseDown}
    >
      <section
        className="login-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        aria-describedby="login-modal-description"
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        <button
          type="button"
          className="login-modal-close"
          aria-label="Giriş penceresini kapat"
          onClick={onClose}
          disabled={isSubmitting}
        >
          ×
        </button>

        <div
          className="login-modal-icon"
          aria-hidden="true"
        >
          🚘
        </div>

        <h2 id="login-modal-title">
          Admin Login
        </h2>

        <p
          id="login-modal-description"
          className="login-modal-description"
        >
          Araç eklemek, düzenlemek ve silmek için
          yönetici hesabınızla giriş yapın.
        </p>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div className="login-form-field">
            <label htmlFor="admin-email">
              Email
            </label>

            <input
              ref={emailInputRef}
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              placeholder="admin@example.com"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="login-form-field">
            <label htmlFor="admin-password">
              Password
            </label>

            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              placeholder="Enter your password"
              required
              disabled={isSubmitting}
            />
          </div>

          {errorMessage && (
            <div
              className="login-error"
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="login-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Signing in..."
              : "Sign In"}
          </button>
        </form>

        <p className="login-security-note">
          Only authorized inventory managers can
          modify vehicle records.
        </p>
      </section>
    </div>
  );
}