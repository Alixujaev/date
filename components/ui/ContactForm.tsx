"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import {
  CONTACT_LIMITS,
  isValidMessage,
  isValidName,
} from "@/lib/contact";
import { useTranslation } from "@/lib/i18n/useTranslation";

export interface ContactValues {
  name: string;
  message: string;
}

interface ContactFormProps {
  onSubmit: (values: ContactValues) => void;
  submitting: boolean;
  /** Oxirgi yuborish xatosi — tugma ustida ko'rsatiladi. */
  error: string | null;
}

const field =
  "w-full rounded-xl border bg-white/[0.04] px-4 py-3 text-sm text-[color:var(--text-primary)] placeholder:text-muted/40 transition-colors hover:bg-white/[0.06] focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-blush-400/60 disabled:opacity-50";

const label = "mb-1.5 flex items-baseline justify-between text-xs font-medium uppercase tracking-[0.14em] text-muted";

const errorText = "mt-1.5 text-xs text-blush-300";

function borderFor(invalid: boolean): string {
  return invalid ? "border-blush-400/70" : "border-white/10";
}

export function ContactForm({ onSubmit, submitting, error }: ContactFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState({ name: false, message: false });

  const nameOk = isValidName(name);
  const messageOk = isValidMessage(message);
  const valid = nameOk && messageOk;

  const showNameError = touched.name && !nameOk;
  const showMessageError = touched.message && !messageOk;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!valid || submitting) return;
    onSubmit({ name: name.trim(), message: message.trim() });
  };

  return (
    <form className="w-full text-left" noValidate onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Ism maydoni */}
        <div>
          <label className={label} htmlFor="contact-name">
            {t.finale.nameLabel}
          </label>
          <input
            id="contact-name"
            type="text"
            required
            autoComplete="name"
            placeholder={t.finale.namePlaceholder}
            maxLength={CONTACT_LIMITS.name}
            value={name}
            disabled={submitting}
            onChange={(event) => setName(event.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
            aria-invalid={showNameError}
            aria-describedby={showNameError ? "contact-name-error" : undefined}
            className={`${field} ${borderFor(showNameError)}`}
          />
          {showNameError && (
            <p id="contact-name-error" className={errorText}>
              {t.finale.nameError}
            </p>
          )}
        </div>

        {/* Xabar maydoni */}
        <div>
          <label className={label} htmlFor="contact-message">
            {t.finale.messageLabel}
          </label>
          <textarea
            id="contact-message"
            required
            rows={4}
            maxLength={CONTACT_LIMITS.message}
            value={message}
            disabled={submitting}
            placeholder={t.finale.messagePlaceholder}
            onChange={(event) => setMessage(event.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, message: true }))}
            aria-invalid={showMessageError}
            aria-describedby={showMessageError ? "contact-message-error" : undefined}
            className={`${field} ${borderFor(showMessageError)} resize-none`}
          />
          {showMessageError && (
            <p id="contact-message-error" className={errorText}>
              {t.finale.messageError}
            </p>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-center text-sm text-blush-300">
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-center">
        <Button
          type="submit"
          variant="primary"
          className="min-w-[12rem]"
          disabled={!valid}
          loading={submitting}
        >
          {submitting ? t.finale.submitting : error ? t.finale.retry : t.finale.submit}
        </Button>
      </div>
    </form>
  );
}
