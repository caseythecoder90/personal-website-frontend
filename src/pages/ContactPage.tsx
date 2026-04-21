import * as React from 'react';
import { useState } from 'react';
import { usePageTitle } from '@/hooks';
import { contactApi } from '@/api/contact';
import type { ApiError } from '@/api/client';
import { ContactInfoLink, MailIcon, GithubIcon, LinkedinIcon } from '@/components/ui';
import type { InquiryType } from '@/types';

// ----------------------------------------------------------------------------
// Static data
// ----------------------------------------------------------------------------

/** Display labels for the inquiry dropdown. Values map to the backend enum. */
const INQUIRY_OPTIONS: { value: InquiryType; label: string }[] = [
  { value: 'GENERAL',       label: 'General Inquiry' },
  { value: 'PROJECT',       label: 'Project Inquiry' },
  { value: 'COLLABORATION', label: 'Collaboration' },
  { value: 'HIRING',        label: 'Hiring / Full-time' },
  { value: 'FREELANCE',     label: 'Freelance / Contract' },
];

const MESSAGE_MIN = 20;
const MESSAGE_MAX = 2000;

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

interface FormState {
  name: string;
  email: string;
  subject: string;
  inquiryType: InquiryType;
  message: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

type SubmitState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

const EMPTY_FORM: FormState = {
  name: '',
  email: '',
  subject: '',
  inquiryType: 'GENERAL',
  message: '',
};

// ----------------------------------------------------------------------------
// Validation
// ----------------------------------------------------------------------------

/** Minimal email regex — backend does authoritative validation. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};

  if (!form.name.trim()) errors.name = 'Name is required';
  else if (form.name.length > 255) errors.name = 'Name must be 255 characters or fewer';

  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Enter a valid email address';
  else if (form.email.length > 255) errors.email = 'Email must be 255 characters or fewer';

  if (form.subject.length > 255) errors.subject = 'Subject must be 255 characters or fewer';

  const trimmedMessage = form.message.trim();
  if (!trimmedMessage) {
    errors.message = 'Message is required';
  } else if (trimmedMessage.length < MESSAGE_MIN) {
    errors.message = `Message must be at least ${MESSAGE_MIN} characters`;
  } else if (trimmedMessage.length > MESSAGE_MAX) {
    errors.message = `Message must be ${MESSAGE_MAX} characters or fewer`;
  }

  return errors;
}

// ----------------------------------------------------------------------------
// Error mapping
// ----------------------------------------------------------------------------

/**
 * Maps an unknown error from contactApi.submit() to a user-facing message.
 * Keeps the submit handler's catch block to a single line and puts all the
 * status-code branching in one named, testable place.
 */
function messageForSubmitError(err: unknown): string {
  const apiError = err as Partial<ApiError>;

  switch (apiError?.status) {
    case 429:
      return "You're sending a lot — please wait a minute and try again.";
    case 400:
      return apiError.message || 'Some fields look invalid. Please review and try again.';
    case 0:
      return 'Could not reach the server. Check your connection and try again.';
    default:
      return 'Something went wrong sending your message. Please try again.';
  }
}

// ----------------------------------------------------------------------------
// Page
// ----------------------------------------------------------------------------

export function ContactPage() {
  usePageTitle('Contact');

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submit, setSubmit] = useState<SubmitState>({ kind: 'idle' });

  // Drives whether we show red borders — we only flip it to true once the
  // user has attempted a submit, so a pristine form doesn't render angry.
  const [showErrors, setShowErrors] = useState(false);

  const messageLength = form.message.trim().length;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear a field's error as soon as the user edits it.
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (submit.kind === 'submitting') return; // debounce double-clicks

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setShowErrors(true);
      return;
    }

    setErrors({});
    setShowErrors(false);
    setSubmit({ kind: 'submitting' });

    try {
      await contactApi.submit({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim() || undefined,
        message: form.message.trim(),
        inquiryType: form.inquiryType,
      });
      setSubmit({ kind: 'success' });
      setForm(EMPTY_FORM);
    } catch (err) {
      setSubmit({ kind: 'error', message: messageForSubmitError(err) });
    }
  };

  function resetForm() {
    setForm(EMPTY_FORM);
    setErrors({});
    setShowErrors(false);
    setSubmit({ kind: 'idle' });
  }

  return (
    <main className="pt-16 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        {/* ============================================================
            LEFT: identity + contact links
            ============================================================ */}
        <section className="lg:col-span-5">
          <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tighter text-on-surface leading-tight mb-6">
            Get In Touch<span className="text-primary">.</span>
          </h1>
          <p className="font-body text-on-surface-variant text-lg leading-relaxed max-w-md mb-10">
            Open to full-time roles, freelance engagements, and interesting technical
            collaborations. Drop a note and I'll get back within a day or two.
          </p>

          <div className="flex flex-col gap-5">
            <ContactInfoLink
              href="mailto:caseythecoder90@gmail.com"
              label="Email"
              value="caseythecoder90@gmail.com"
              icon={<MailIcon />}
            />
            <ContactInfoLink
              href="https://github.com/caseythecoder90"
              label="GitHub"
              value="caseythecoder90"
              icon={<GithubIcon />}
              external
            />
            <ContactInfoLink
              href="https://www.linkedin.com/in/caseyq20"
              label="LinkedIn"
              value="linkedin.com/in/caseyq20"
              icon={<LinkedinIcon />}
              external
            />
          </div>
        </section>

        {/* ============================================================
            RIGHT: form card
            ============================================================ */}
        <section className="lg:col-span-7">
          <div className="bg-surface-container-low p-8 md:p-12 rounded-xl border border-outline-variant/15">
            {submit.kind === 'success' ? (
              <SuccessState onReset={resetForm} />
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Name + Email row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field
                    label="Full Name"
                    htmlFor="contact-name"
                    error={showErrors ? errors.name : undefined}
                  >
                    <input
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="Jane Doe"
                      className={inputClasses(showErrors && !!errors.name)}
                    />
                  </Field>
                  <Field
                    label="Email Address"
                    htmlFor="contact-email"
                    error={showErrors ? errors.email : undefined}
                  >
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="jane@example.com"
                      className={inputClasses(showErrors && !!errors.email)}
                    />
                  </Field>
                </div>

                {/* Subject */}
                <Field
                  label="Subject"
                  htmlFor="contact-subject"
                  optional
                  error={showErrors ? errors.subject : undefined}
                >
                  <input
                    id="contact-subject"
                    type="text"
                    value={form.subject}
                    onChange={(e) => update('subject', e.target.value)}
                    placeholder="What's this about?"
                    className={inputClasses(showErrors && !!errors.subject)}
                  />
                </Field>

                {/* Inquiry type */}
                <Field label="Inquiry Type" htmlFor="contact-inquiry">
                  <div className="relative">
                    <select
                      id="contact-inquiry"
                      value={form.inquiryType}
                      onChange={(e) => update('inquiryType', e.target.value as InquiryType)}
                      className={`${inputClasses(false)} appearance-none cursor-pointer pr-12`}
                    >
                      {INQUIRY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <svg
                      aria-hidden="true"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </Field>

                {/* Message */}
                <Field
                  label="Message"
                  htmlFor="contact-message"
                  error={showErrors ? errors.message : undefined}
                  trailing={
                    <span
                      className={`font-label text-[10px] tracking-widest ${
                        messageLength > MESSAGE_MAX
                          ? 'text-error'
                          : messageLength < MESSAGE_MIN
                            ? 'text-outline'
                            : 'text-on-surface-variant'
                      }`}
                    >
                      {messageLength} / {MESSAGE_MAX}
                    </span>
                  }
                >
                  <textarea
                    id="contact-message"
                    rows={6}
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder={`Tell me about what you're working on... (min ${MESSAGE_MIN} characters)`}
                    className={`${inputClasses(showErrors && !!errors.message)} resize-none`}
                  />
                </Field>

                {/* Submit row */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-6">
                  <button
                    type="submit"
                    disabled={submit.kind === 'submitting'}
                    className="w-full sm:w-auto bg-gradient-to-br from-primary to-primary-dim text-on-primary font-headline font-bold px-10 py-4 rounded-md tracking-tight shadow-[0_0_0_rgba(163,166,255,0)] hover:shadow-[0_0_15px_rgba(163,166,255,0.3)] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-wait"
                  >
                    {submit.kind === 'submitting' ? 'Sending…' : 'Send Message'}
                  </button>
                  <p className="text-on-surface-variant text-xs italic">
                    I usually respond within 24–48 hours.
                  </p>
                </div>

                {submit.kind === 'error' && (
                  <div
                    role="alert"
                    className="p-4 rounded-md bg-error/10 border border-error/20 text-error text-sm"
                  >
                    {submit.message}
                  </div>
                )}
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

// ----------------------------------------------------------------------------
// Tiny local helpers (scoped to this page — not reused elsewhere)
// ----------------------------------------------------------------------------

interface FieldProps {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  error?: string;
  optional?: boolean;
  trailing?: React.ReactNode;
}

/** Label + input wrapper with consistent spacing and inline error display. */
function Field({ label, htmlFor, children, error, optional, trailing }: FieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between ml-1">
        <label
          htmlFor={htmlFor}
          className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant"
        >
          {label}
          {optional && <span className="ml-2 text-outline normal-case tracking-normal">(optional)</span>}
        </label>
        {trailing}
      </div>
      {children}
      {error && (
        <p className="ml-1 text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** Shared Tailwind classes for inputs/textareas/selects. */
function inputClasses(hasError: boolean): string {
  const base =
    'w-full bg-surface-container-lowest rounded-md p-4 text-on-surface placeholder:text-outline/50 transition-all focus:outline-none focus:ring-1';
  const ring = hasError
    ? 'ring-1 ring-error focus:ring-error'
    : 'ring-1 ring-transparent focus:ring-primary';
  return `${base} ${ring}`;
}

interface SuccessStateProps {
  onReset: () => void;
}

function SuccessState({ onReset }: SuccessStateProps) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">
        Message sent.
      </h2>
      <p className="text-on-surface-variant max-w-md mx-auto mb-8">
        Thanks for reaching out — I'll get back to you within a day or two. No need to check your inbox yet.
      </p>
      <button
        onClick={onReset}
        className="font-label text-[11px] uppercase tracking-widest text-primary hover:text-on-surface transition-colors"
      >
        Send another message
      </button>
    </div>
  );
}

/*
 * ============================================================================
 * PAGE: ContactPage
 * ============================================================================
 *
 * PURPOSE:
 *   /contact — split layout with identity/links on the left and a form on
 *   the right that POSTs to /api/v1/contact. Handles client-side validation,
 *   per-field error display, a submit state machine, and rate-limit (429)
 *   and network error messaging.
 *
 * STATE:
 *   form          — controlled form values
 *   errors        — per-field error map
 *   showErrors    — gates whether error UI is visible (false until first submit)
 *   submit        — discriminated union: idle | submitting | success | error
 *
 * REACT PATTERNS:
 *
 *   DISCRIMINATED UNION FOR SUBMIT STATE
 *     Instead of four booleans (isLoading, isSuccess, isError, errorMessage),
 *     `submit` is one value with a `.kind` tag. Illegal states are
 *     unrepresentable (you can't be "submitting" and "error" at the same time).
 *     Java analogue: sealed class Result<T> { Loading, Ok, Err<String> }.
 *
 *   DEBOUNCE DOUBLE-CLICK
 *     `if (submit.kind === 'submitting') return;` in handleSubmit prevents a
 *     second POST if the user double-clicks the submit button before the
 *     first response lands. Also disables the button visually. No backend
 *     rate limit is in place yet, so the FE has to guard this.
 *
 *   LAZY ERROR DISPLAY
 *     `showErrors` flips true only after an invalid submit attempt. A
 *     first-time visitor sees a clean form, not red text on every field.
 *     Once a field's error is shown, editing that field clears it — the
 *     user gets immediate feedback that the fix worked.
 *
 *   GENERIC UPDATE HELPER
 *     `update<K extends keyof FormState>(key: K, value: FormState[K])`
 *     is type-safe — TypeScript enforces that `value` matches the field's
 *     declared type. E.g. `update('inquiryType', 'GENERAL')` compiles,
 *     `update('inquiryType', 'FOO')` does not.
 *
 *   CONTROLLED INPUTS
 *     Each input's `value` comes from state, `onChange` writes back. React
 *     is the single source of truth. The DOM never holds state the component
 *     doesn't know about — no need to read `e.target.value` out of a ref.
 *
 * ERROR MAPPING:
 *   429 → friendly "slow down" message (rate limit)
 *   400 → use backend message (validation)
 *   0   → "couldn't reach server" (network)
 *   *   → generic retry message
 *
 * ============================================================================
 */
