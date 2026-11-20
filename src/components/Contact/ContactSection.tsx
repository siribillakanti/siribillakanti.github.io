import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Sparkles, Mail, Github, Linkedin, Send, Copy, Check, Heart, Shield, Lock } from 'lucide-react';
import { StickerLayer } from '../Common/StickerLayer';
import confetti from 'canvas-confetti';

export const ContactSection: React.FC = () => {
  const { profile, showToast, setIsAdminOpen, sectionsContent, branding } = usePortfolio();
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const sec = sectionsContent.contact;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    showToast('Email Copied to Clipboard!', profile.email, 'bordeaux');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill all fields', 'Name, email, and message are required.', 'info');
      return;
    }

    // Launch celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#5C1327', '#C72C61', '#F9E498', '#A8C69F', '#1D4ED8'],
    });

    setSent(true);
    showToast('Message Dispatched!', `Thank you ${formData.name}. Opening your email client...`, 'success');

    // Mailto fallback so user can send immediately
    const mailtoUrl = `mailto:${profile.email}?subject=${encodeURIComponent(
      formData.subject || `Portfolio Inquiry from ${formData.name}`
    )}&body=${encodeURIComponent(
      `Hello Siri,\n\n${formData.message}\n\nFrom: ${formData.name} (${formData.email})`
    )}`;

    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 1200);
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
            <h3 className="font-serif text-2xl font-bold text-bordeaux-800 mb-4">
              Send a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-xs font-bold text-plum-800 block">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Chen"
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border-2 border-plum-900 rounded-xl font-sans text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-xs font-bold text-plum-800 block">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@example.com"
                    className="w-full px-3.5 py-2.5 bg-ivory-50 border-2 border-plum-900 rounded-xl font-sans text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Internship opportunity, project inquiry, or quick hello"
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border-2 border-plum-900 rounded-xl font-sans text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-xs font-bold text-plum-800 block">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details about what you're building or how we can collaborate..."
                  className="w-full px-3.5 py-2.5 bg-ivory-50 border-2 border-plum-900 rounded-xl font-sans text-sm text-plum-900 focus:outline-none focus:ring-2 focus:ring-bordeaux-800 shadow-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-bordeaux-800 hover:bg-bordeaux-900 text-ivory-100 font-sans font-bold text-sm rounded-xl border-2 border-plum-900 shadow-card hover:shadow-card-hover transition-all active:translate-x-0.5 active:translate-y-0.5"
              >
                <Send className="w-4 h-4 text-butter-300" />
                <span>{sent ? 'Dispatched! Opening Mail Client...' : 'Dispatch Letter to Siri'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Colophon & Admin Access */}
        <div className="mt-12 pt-6 border-t-2 border-plum-900/15 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-plum-600 gap-4">
          <div>
            {branding.footerCopyright || `© ${new Date().getFullYear()} Siri Billakanti. Crafted with care, mathematics, and curiosity.`}
          </div>

          <div className="flex items-center space-x-4">
            <button
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
