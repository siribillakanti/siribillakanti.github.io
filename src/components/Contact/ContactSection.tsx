import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Sparkles,
  Mail,
  Github,
  Linkedin,
  Send,
  Copy,
  Check,
  Heart,
  Shield,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { StickerLayer } from '../Common/StickerLayer';
import confetti from 'canvas-confetti';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  botcheck: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

type SubmitStatus = 'idle' | 'email_sent' | 'archived_only' | 'fallback_mailto' | 'error';

export const ContactSection: React.FC = () => {
  const { profile, showToast, setIsAdminOpen, sectionsContent, branding } = usePortfolio();
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    botcheck: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [submittedName, setSubmittedName] = useState('');
  const [pendingMailtoUrl, setPendingMailtoUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sec = sectionsContent.contact;
  const recipientEmail = profile.email || 'siri.billakanti1@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    showToast('Email Copied to Clipboard!', profile.email, 'bordeaux');
    setTimeout(() => setCopied(false), 2500);
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = 'Please provide your name.';
    } else if (formData.name.trim().length < 2) {
      nextErrors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      nextErrors.email = 'Please provide your email address.';
    } else if (!emailRegex.test(formData.email.trim())) {
      nextErrors.email = 'Please provide a valid email address.';
    }

    if (!formData.message.trim()) {
      nextErrors.message = 'Please write a message.';
    } else if (formData.message.trim().length < 10) {
      nextErrors.message = 'Message must be at least 10 characters.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) {
      showToast('Validation Error', 'Please correct the highlighted fields.', 'info');
      return;
    }

    // Anti-spam honeypot: silently drop bots
    if (formData.botcheck) {
      setSubmitStatus('email_sent');
      setSubmittedName(formData.name.trim());
      setFormData({ name: '', email: '', subject: '', message: '', botcheck: '' });
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const emailSubject = formData.subject.trim() || `Portfolio Inquiry from ${formData.name.trim()}`;
    const trimmedMessage = formData.message.trim();
    const senderName = formData.name.trim();
    const senderEmail = formData.email.trim();

    let emailDelivered = false;
    let messageArchived = false;

    try {
      // 1. Attempt serverless email delivery (Formspree or Web3Forms)
      const customEndpoint = (import.meta.env.VITE_CONTACT_FORM_ENDPOINT as string) || '';
      const web3Key = (import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string) || '';

      if (customEndpoint) {
        try {
          const res = await fetch(customEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              name: senderName,
              email: senderEmail,
              subject: emailSubject,
              message: trimmedMessage,
            }),
          });
          if (res.ok) {
            emailDelivered = true;
          }
        } catch (err: any) {
          console.warn('[Contact Form] Custom endpoint dispatch failed:', err?.message);
        }
      } else if (web3Key) {
        try {
          const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              access_key: web3Key,
              name: senderName,
              email: senderEmail,
              subject: emailSubject,
              message: trimmedMessage,
              botcheck: formData.botcheck,
              from_name: senderName,
              replyto: senderEmail,
            }),
          });
          const data = await res.json();
          if (res.ok && data.success === true) {
            emailDelivered = true;
          }
        } catch (err: any) {
          console.warn('[Contact Form] Web3Forms dispatch failed:', err?.message);
        }
      }

      // 2. Independent Supabase archival (inspecting error explicitly)
      if (isSupabaseConfigured() && supabase) {
        try {
          const { error } = await supabase.from('portfolio_messages').insert({
            name: senderName,
            email: senderEmail,
            subject: emailSubject,
            message: trimmedMessage,
          });
          if (error) {
            console.warn('[Contact Form] Supabase message archiving returned error:', error.message);
          } else {
            messageArchived = true;
          }
        } catch (dbErr: any) {
          console.warn('[Contact Form] Supabase message archiving exception:', dbErr?.message);
        }
      }

      setSubmittedName(senderName);

      // 3. Evaluate results independently
      if (emailDelivered) {
        // Email service confirmed delivery
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#5C1327', '#C72C61', '#F9E498', '#A8C69F', '#1D4ED8'],
        });

        setSubmitStatus('email_sent');
        showToast('Message Dispatched!', `Thank you ${senderName}. Your letter has been sent.`, 'success');
        setFormData({ name: '', email: '', subject: '', message: '', botcheck: '' });
      } else if (messageArchived) {
        // Email delivery failed or was unconfigured, but Supabase archive succeeded
        setSubmitStatus('archived_only');
        showToast(
          'Inquiry Saved',
          'Your inquiry was saved to the portfolio database, but direct email delivery could not be confirmed.',
          'info'
        );
        setFormData({ name: '', email: '', subject: '', message: '', botcheck: '' });
      } else {
        // Neither service succeeded: prompt manual mailto send
        const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(
          emailSubject
        )}&body=${encodeURIComponent(
          `Hello Siri,\n\n${trimmedMessage}\n\nFrom: ${senderName} (${senderEmail})`
        )}`;

        setPendingMailtoUrl(mailtoUrl);
        setSubmitStatus('fallback_mailto');

        showToast(
          'Manual Send Required',
          'Automated delivery was unavailable. Please send the drafted letter via your email client.',
          'info'
        );

        setTimeout(() => {
          window.location.href = mailtoUrl;
        }, 1000);
      }
    } catch (outerErr: any) {
      console.error('[Contact Form] Submission error:', outerErr);
      setErrorMessage('An unexpected error occurred while processing your request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto overflow-visible">
      {/* Visual Customizer Stickers */}
      <StickerLayer pageId="contact" />

      {/* Section Header */}
      <div className="mb-12">
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-bordeaux-800 tracking-tight">
          {sec?.title || 'Contact'}
        </h2>
        {sec?.subtitle && (
          <p className="font-mono text-xs sm:text-sm font-semibold text-raspberry-600 mt-1">
            {sec.subtitle}
          </p>
        )}
        {sec?.description && (
          <p className="font-sans text-sm sm:text-base text-plum-700 mt-2 max-w-xl leading-relaxed">
            {sec.description}
          </p>
        )}
      </div>

      {/* Tactile Postcard Composition */}
      <div className="relative bg-ivory-50 border-3 border-plum-900 rounded-card-lg p-6 sm:p-10 shadow-card-xl overflow-hidden">
        {/* Airmail Border Accent Strip at Top */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-bordeaux-800 via-butter-400 to-cobalt-600" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-3">
          {/* Left Column: Direct Contact Details & Postcard Note (5 cols) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="font-mono text-xs font-bold text-raspberry-600 uppercase tracking-widest block">
                DIRECT INBOX
              </span>

              <div className="p-4 bg-ivory-200/80 rounded-xl border border-plum-900/20 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-mono text-xs text-plum-600 font-bold">PRIMARY EMAIL:</span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="flex items-center space-x-1 text-xs font-mono text-bordeaux-800 font-bold hover:underline"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-sm sm:text-base font-bold text-plum-900 select-all break-all">
                  {profile.email}
                </div>
              </div>

              {/* Social Channels */}
              <div className="space-y-2 pt-2">
                <span className="font-mono text-xs font-bold text-plum-700 uppercase tracking-wider block">
                  DIGITAL SPACES
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 p-3 bg-ivory-100 hover:bg-plum-900 hover:text-ivory-100 text-plum-900 rounded-xl border-2 border-plum-900 shadow-sm transition-all text-xs font-mono font-bold"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>

                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 p-3 bg-ivory-100 hover:bg-cobalt-600 hover:text-ivory-100 text-plum-900 rounded-xl border-2 border-plum-900 shadow-sm transition-all text-xs font-mono font-bold"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Note Callout */}
            <div className="p-4 bg-ivory-200/60 rounded-xl border border-plum-900/15">
              <p className="font-sans text-xs sm:text-sm text-plum-800 leading-relaxed">
                Messages sent here reach my inbox directly. I typically respond within 24 to 48 hours.
              </p>
            </div>
          </div>

          {/* Right Column: Direct Message Form (7 cols) */}
          <div className="lg:col-span-7 bg-ivory-100 p-6 sm:p-8 rounded-2xl border-2 border-plum-900 shadow-card">
            <h3 className="font-serif text-2xl font-bold text-bordeaux-800 mb-2">
              Send a Message
            </h3>
            <p className="font-sans text-xs sm:text-sm text-plum-700 mb-5">
              Write a note regarding software opportunities, technical ideas, or collaborations.
            </p>

            {/* Case 1: Email Confirmed Delivered */}
            {submitStatus === 'email_sent' && (
              <div className="p-6 bg-pistachio-100/80 border-2 border-pistachio-600 rounded-2xl text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-pistachio-200 rounded-full flex items-center justify-center border-2 border-pistachio-700">
                  <CheckCircle2 className="w-6 h-6 text-pistachio-800" />
                </div>
                <div>
                  <h4 className="font-serif text-xl font-bold text-bordeaux-800">
                    Letter Dispatched Successfully
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-plum-800 mt-1.5 leading-relaxed">
                    Thank you for reaching out, {submittedName || 'friend'}! Your message has been sent to Siri's inbox ({recipientEmail}).
                    You will receive a response within 24 to 48 hours.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitStatus('idle')}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-bordeaux-800 text-ivory-100 font-mono text-xs font-bold rounded-xl border-2 border-plum-900 shadow-sm hover:bg-bordeaux-900 transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-butter-300" />
                  <span>Send Another Note</span>
                </button>
              </div>
            )}

            {/* Case 2: Email failed/unconfigured, but Supabase archive succeeded */}
            {submitStatus === 'archived_only' && (
              <div className="p-6 bg-butter-200/90 border-2 border-plum-900 rounded-2xl text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-butter-300 rounded-full flex items-center justify-center border-2 border-plum-900">
                  <CheckCircle2 className="w-6 h-6 text-bordeaux-800" />
                </div>
                <div>
                  <h4 className="font-serif text-xl font-bold text-bordeaux-800">
                    Inquiry Saved to Portfolio Database
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-plum-800 mt-1.5 leading-relaxed">
                    Thank you, {submittedName || 'friend'}. Your message has been securely recorded in the portfolio database, but automated email delivery could not be confirmed.
                    Siri will review your inquiry from the admin dashboard, or you can write directly to {recipientEmail}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitStatus('idle')}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-bordeaux-800 text-ivory-100 font-mono text-xs font-bold rounded-xl border-2 border-plum-900 shadow-sm hover:bg-bordeaux-900 transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-butter-300" />
                  <span>Send Another Note</span>
                </button>
              </div>
            )}

            {/* Case 3: Neither succeeded — fallback to manual mailto send */}
            {submitStatus === 'fallback_mailto' && (
              <div className="p-6 bg-ivory-200/90 border-2 border-plum-900 rounded-2xl text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-ivory-100 rounded-full flex items-center justify-center border-2 border-plum-900">
                  <Mail className="w-6 h-6 text-bordeaux-800" />
                </div>
                <div>
                  <h4 className="font-serif text-xl font-bold text-bordeaux-800">
                    Direct Dispatch Unavailable — Please Send via Email
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-plum-800 mt-1.5 leading-relaxed">
                    Automated email delivery and database archiving were unavailable. We opened your default mail client with your drafted letter.
                    If it did not open automatically, please click below to send it to {recipientEmail}.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                  <a
                    href={pendingMailtoUrl}
                    className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-bordeaux-800 text-ivory-100 font-mono text-xs font-bold rounded-xl border-2 border-plum-900 shadow-sm hover:bg-bordeaux-900 transition-all"
                  >
                    <Mail className="w-3.5 h-3.5 text-butter-300" />
                    <span>Open Email Client</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmitStatus('idle')}
                    className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-ivory-100 text-plum-900 font-mono text-xs font-bold rounded-xl border-2 border-plum-900 shadow-sm hover:bg-butter-200 transition-all"
                  >
                    <span>Back to Form</span>
                  </button>
                </div>
              </div>
            )}

            {/* Default / Idle / Error Form */}
            {(submitStatus === 'idle' || submitStatus === 'error') && (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Honeypot field for anti-spam bots */}
                <input
                  type="text"
                  name="botcheck"
                  value={formData.botcheck}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  style={{ display: 'none' }}
                />

                {errorMessage && (
                  <div className="p-3 bg-red-100 border border-red-300 rounded-xl text-xs font-mono text-red-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="contact-name" className="font-mono text-xs font-bold text-plum-800 block">
                      Your Name <span className="text-bordeaux-800">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="e.g. Alex Chen"
                      className={`w-full px-3.5 py-2.5 bg-ivory-50 border-2 rounded-xl font-sans text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm transition-colors ${
                        errors.name ? 'border-red-600 bg-red-50/50' : 'border-plum-900'
                      }`}
                    />
                    {errors.name && (
                      <span className="text-[11px] font-mono text-red-700 block">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="contact-email" className="font-mono text-xs font-bold text-plum-800 block">
                      Your Email <span className="text-bordeaux-800">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="alex@example.com"
                      className={`w-full px-3.5 py-2.5 bg-ivory-50 border-2 rounded-xl font-sans text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm transition-colors ${
                        errors.email ? 'border-red-600 bg-red-50/50' : 'border-plum-900'
                      }`}
                    />
                    {errors.email && (
                      <span className="text-[11px] font-mono text-red-700 block">
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="contact-subject" className="font-mono text-xs font-bold text-plum-800 block">
                    Subject / Topic
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="Internship opportunity, project inquiry, or quick hello"
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border-2 border-plum-900 rounded-xl font-sans text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="contact-message" className="font-mono text-xs font-bold text-plum-800 block">
                    Message <span className="text-bordeaux-800">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="Share details about what you're building or how we can collaborate..."
                    className={`w-full px-3.5 py-2.5 bg-ivory-50 border-2 rounded-xl font-sans text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm resize-none transition-colors ${
                      errors.message ? 'border-red-600 bg-red-50/50' : 'border-plum-900'
                    }`}
                  />
                  {errors.message && (
                    <span className="text-[11px] font-mono text-red-700 block">
                      {errors.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-bordeaux-800 hover:bg-bordeaux-900 text-ivory-100 font-sans font-bold text-sm rounded-xl border-2 border-plum-900 shadow-card hover:shadow-card-hover transition-all active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 text-butter-300 animate-spin" />
                      <span>Dispatching Letter...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-butter-300" />
                      <span>Dispatch Letter to Siri</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Colophon & Admin Access */}
        <div className="mt-12 pt-6 border-t-2 border-plum-900/15 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-plum-600 gap-4">
          <div>
            {branding.footerCopyright || `© ${new Date().getFullYear()} Siri Billakanti. Crafted with care, mathematics, and curiosity.`}
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center space-x-1 text-plum-500 hover:text-bordeaux-800 py-1 px-2 rounded hover:bg-ivory-200 transition-colors"
              title="Content Management Dashboard"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};