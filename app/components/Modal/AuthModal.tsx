"use client";

import React from "react";
import Modal from "./Modal";
import { useAuthModal } from "@/app/context/AuthModalContext";
import { FloatingInput, Checkbox } from "../Form";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { TermsModal } from "./TermsModal";
import { useRegisterMutation, useLoginMutation } from "@/lib/store/api/auth-api";
import { apiErrorMessage } from "@/lib/store/base-api";
import { toast } from "sonner";

/* Apple-store style auth pieces (DESIGN.md §7, §13). The ! keeps these ahead of
   the shared inputs' and Modal header's own classes. */
const TITLE = "text-[22px]! md:text-[24px]! font-semibold! text-brand-charcoal! tracking-[-0.02em]! leading-tight";
const FIELD =
  "h-12! rounded-xl! border-black/[0.12]! px-4! text-[15px]! text-brand-charcoal! transition-colors focus:border-brand-orange! focus:ring-4! focus:ring-brand-orange/15!";
const LINK = "text-brand-orange-text font-medium hover:underline cursor-pointer";
const SOCIAL = "w-full h-11 text-[15px]! font-medium! bg-black/[0.04] hover:bg-black/[0.08] text-brand-charcoal";

const AuthModal = () => {
  const { isOpen, view, closeModal, setView } = useAuthModal();
  const [isTermsOpen, setIsTermsOpen] = React.useState(false);

  const titles = {
    login: "Sign in",
    register: "Create account",
    forgotPassword: "Reset password",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      size="sm"
      title={titles[view as keyof typeof titles]}
      className={TITLE}
    >
      {view === "login" ? (
        <LoginForm key="login" onSwitch={() => setView("register")} />
      ) : view === "register" ? (
        <RegisterForm
          key="register"
          onSwitch={() => setView("login")}
          onOpenTerms={() => setIsTermsOpen(true)}
        />
      ) : (
        <ForgotPasswordForm key="forgot" onBack={() => setView("login")} />
      )}

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
    </Modal>
  );
};

const LoginForm = ({ onSwitch }: { onSwitch: () => void }) => {
  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const [loginUser, { isLoading }] = useLoginMutation();
  const { setView, closeModal } = useAuthModal();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const id = identifier.trim();
    if (!id) {
      setErrorMsg("Please enter your email or phone number.");
      return;
    }
    if (!password) {
      setErrorMsg("Please enter your password.");
      return;
    }

    try {
      await loginUser({
        identifier: id,
        password,
      }).unwrap();

      toast.success("Logged in successfully!");
      closeModal();
    } catch (err) {
      const msg = apiErrorMessage(err, "Invalid credentials. Please try again.");
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-6">
      {errorMsg && (
        <div className="p-3 rounded-xl bg-error-soft text-error text-[13px] font-medium leading-snug flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-error shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <FloatingInput
          className={FIELD}
          label="Email or phone number"
          placeholder="Email or phone number"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <div className="flex flex-col gap-1">
          <FloatingInput
            className={FIELD}
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            suffixElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-faint hover:text-brand-charcoal transition-colors cursor-pointer"
              >
                <Icon
                  name={showPassword ? "visibility_off" : "visibility"}
                  size="xs"
                />
              </button>
            }
          />
          <div className="flex justify-end px-1">
            <button
              type="button"
              onClick={() => setView("forgotPassword")}
              className="text-[13px] font-medium text-brand-orange-text hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
        </div>
      </div>

      <Checkbox label="Remember me" id="remember" />

      <Button
        type="submit"
        variant="accent"
        shape="pill"
        size="lg"
        fullWidth
        isLoading={isLoading}
        disabled={isLoading}
        className="h-12 text-[16px]!"
      >
        Log in
      </Button>

      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-black/[0.06]"></div>
        <span className="text-[12px] text-faint">or</span>
        <div className="flex-1 h-px bg-black/[0.06]"></div>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="secondary"
          shape="pill"
          className={SOCIAL}
          iconLeft={
            <div className="w-5 h-5 flex items-center justify-center bg-[#EA4335] text-white text-[11px] font-semibold rounded-full">
              G
            </div>
          }
        >
          Continue with Google
        </Button>
      </div>

      <p className="text-center text-[14px] text-subtle">
        Don’t have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className={LINK}
        >
          Register now
        </button>
      </p>
    </form>
  );
};

const RegisterForm = ({
  onSwitch,
  onOpenTerms,
}: {
  onSwitch: () => void;
  onOpenTerms: () => void;
}) => {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [agreedToTerms, setAgreedToTerms] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const [registerUser, { isLoading }] = useRegisterMutation();
  const { closeModal } = useAuthModal();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const fName = firstName.trim();
    const lName = lastName.trim();
    const mail = email.trim();
    const tel = phone.trim();

    if (!fName || !lName) {
      setErrorMsg("Please provide both your first and last name.");
      return;
    }
    if (!mail || !mail.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!tel || tel.replace(/\D/g, "").length < 7) {
      setErrorMsg("Please enter a valid phone number.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    if (!agreedToTerms) {
      setErrorMsg("Please accept the Terms and Conditions to proceed.");
      return;
    }

    try {
      await registerUser({
        first_name: fName,
        last_name: lName,
        email: mail,
        phone_number: tel,
        password,
      }).unwrap();

      toast.success("Account created successfully! Welcome to Koolbuy.");
      closeModal();
    } catch (err) {
      const msg = apiErrorMessage(err, "Failed to create account. Please try again.");
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-6">
      {errorMsg && (
        <div className="p-3 rounded-xl bg-error-soft text-error text-[13px] font-medium leading-snug flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-error shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FloatingInput
          label="First name"
          placeholder="John"
          className={FIELD}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <FloatingInput
          label="Last name"
          placeholder="Doe"
          className={FIELD}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4">
        <FloatingInput
          className={FIELD}
          type="email"
          label="Email"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FloatingInput
          className={FIELD}
          type="tel"
          label="Phone number"
          placeholder="+234 800 000 0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <FloatingInput
          className={FIELD}
          type={showPassword ? "text" : "password"}
          label="Password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          suffixElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-faint hover:text-brand-charcoal transition-colors cursor-pointer"
            >
              <Icon
                name={showPassword ? "visibility_off" : "visibility"}
                size="xs"
              />
            </button>
          }
        />
      </div>

      <div className="flex flex-col gap-3 px-1">
        <Checkbox
          id="terms"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          label={
            <span className="text-[13px] text-subtle">
              I agree with{" "}
              <button
                type="button"
                onClick={onOpenTerms}
                className="text-brand-orange-text hover:underline cursor-pointer"
              >
                Terms and Conditions
              </button>
            </span>
          }
        />
      </div>

      <Button
        type="submit"
        variant="accent"
        shape="pill"
        size="lg"
        fullWidth
        isLoading={isLoading}
        disabled={isLoading}
        className="h-12 text-[16px]!"
      >
        Create account
      </Button>

      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-black/[0.06]"></div>
        <span className="text-[12px] text-faint">or</span>
        <div className="flex-1 h-px bg-black/[0.06]"></div>
      </div>

      <Button
        type="button"
        variant="secondary"
        shape="pill"
        className={SOCIAL}
        iconLeft={
          <div className="w-5 h-5 flex items-center justify-center bg-[#EA4335] text-white text-[11px] font-semibold rounded-full">
            G
          </div>
        }
      >
        Register with Google
      </Button>

      <p className="text-center text-[14px] text-subtle">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className={LINK}
        >
          Log in
        </button>
      </p>
    </form>
  );
};

const ForgotPasswordForm = ({ onBack }: { onBack: () => void }) => (
  <div className="flex flex-col gap-6 py-2">
    <div className="flex flex-col gap-2 text-center">
      <p className="text-[15px] text-subtle leading-relaxed">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>
    </div>

    <div className="flex flex-col gap-4">
      <FloatingInput
        className={FIELD}
        label="Email address"
        placeholder="example@gmail.com"
        type="email"
      />
    </div>

    <Button variant="accent" shape="pill" size="lg" fullWidth className="h-12 text-[16px]!">
      Send reset link
    </Button>

    <p className="text-center text-[14px] text-subtle">
      Remember your password?{" "}
      <button
        onClick={onBack}
        className={LINK}
      >
        Back to login
      </button>
    </p>
  </div>
);

export { AuthModal };
