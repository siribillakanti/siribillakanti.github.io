import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Mail,
  Github,
  Linkedin,
  Copy,
  Check,
  ArrowUpRight,
  Send,
  Lock,
  Sparkles,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { StickerLayer } from '../Common/StickerLayer';

export const ContactSection: React.FC = () => {
  const { profile, showToast, setIsAdminOpen, sectionsContent, branding } = usePortfolio();
  const [copied, setCopied] = useState(false);

  const sec = sectionsContent.contact;
  const recipientEmail = profile.email || 'siri.billakanti1@gmail.com';
  const linkedinUrl = profile.linkedin || 'https://www.linkedin.com/in/siri-billakanti-0b798a384/';
  const githubUrl = profile.github || 'https://github.com/siribillakanti';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(recipientEmail);
    setCopied(true);
    showToast('Email Copied to Clipboard!', recipientEmail, 'bordeaux');
    setTimeout(() => setCopied(false), 2500);
  };

  const contactChannels = [
    {
      id: 'email',
      title: 'Email',
      label: recipientEmail,
      actionText: 'Compose Email',
      href: `mailto:${recipientEmail}`,
      icon: Mail,
      external: false,
      colorClass: 'text-bordeaux-800 group-hover:text-bordeaux-900',
      badgeBg: 'bg-bordeaux-800 text-ivory-100',
      borderHover: 'hover:border-bordeaux-800 hover:bg-ivory-100/90',
    },
    {
      id: 'linkedin',
      title: 'LinkedIn',
      label: 'in/siri-billakanti-0b798a384',
      actionText: 'Connect on LinkedIn',
      href: linkedinUrl,
      icon: Linkedin,
      external: true,
      colorClass: 'text-cobalt-600 group-hover:text-cobalt-700',
      badgeBg: 'bg-cobalt-600 text-ivory-100',
      borderHover: 'hover:border-cobalt-600 hover:bg-ivory-100/90',
    },
    {
      id: 'github',
      title: 'GitHub',
      label: 'github.com/siribillakanti',
      actionText: 'View Repositories',
      href: githubUrl,
      icon: Github,
      external: true,
      colorClass: 'text-plum-900 group-hover:text-plum-950',
      badgeBg: 'bg-plum-900 text-ivory-100',
      borderHover: 'hover:border-plum-900 hover:bg-ivory-100/90',
    },
  ];

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
          {/* Left Column: Direct Inquiries & Postcard Context (5 cols) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="font-mono text-xs font-bold text-raspberry-600 uppercase tracking-widest block">
                DIRECT INBOX
              </span>

              {/* Quick Copy Box */}
              <div className="p-4 bg-ivory-200/80 rounded-xl border border-plum-900/20 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-mono text-xs text-plum-600 font-bold">PRIMARY EMAIL:</span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="flex items-center space-x-1 text-xs font-mono text-bordeaux-800 font-bold hover:underline focus:outline-none focus:ring-1 focus:ring-bordeaux-800 rounded px-1"
                    aria-label="Copy primary email to clipboard"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-sm sm:text-base font-bold text-plum-900 select-all break-all">
                  {recipientEmail}
                </div>
              </div>

              {/* Collaboration Note */}
              <div className="p-4 bg-ivory-200/50 rounded-xl border border-plum-900/15 space-y-2">
                <div className="flex items-center space-x-1.5 text-bordeaux-800 font-mono text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>RESPONSE WINDOW</span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-plum-800 leading-relaxed">
                  I typically respond to inquiries within 24 to 48 hours. Open to full-time engineering roles, technical collaborations, and research dialogues.
                </p>
              </div>
            </div>

            {/* Subtle Stamp Note */}
            <div className="hidden lg:block pt-4">
              <div className="border border-dashed border-plum-900/30 p-3 rounded-lg text-center bg-ivory-100/50">
                <span className="font-mono text-[11px] text-plum-600 tracking-wider uppercase block">
                  Postmark // Siri Billakanti Portfolio
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Connection Channels (7 cols) */}
          <div className="lg:col-span-7 bg-ivory-100 p-6 sm:p-8 rounded-2xl border-2 border-plum-900 shadow-card flex flex-col justify-between">
            <div className="space-y-3 mb-6">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-bordeaux-800 tracking-tight">
                Let's stay connected.
              </h3>
              <p className="font-sans text-sm sm:text-base text-plum-700 leading-relaxed max-w-lg">
                Have an opportunity, a project idea, or just want to say hello? I'd love to hear from you.
              </p>
            </div>

            {/* Connection Cards */}
            <div className="space-y-3">
              {contactChannels.map((channel) => {
                const IconComponent = channel.icon;
                return (
                  <a
                    key={channel.id}
                    href={channel.href}
                    target={channel.external ? '_blank' : undefined}
                    rel={channel.external ? 'noreferrer' : undefined}
                    className={`group block p-4 bg-ivory-50 border-2 border-plum-900 rounded-xl shadow-sm transition-all duration-200 active:scale-[0.99] ${channel.borderHover}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-ivory-200/80 border border-plum-900/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                          <IconComponent className={`w-5 h-5 ${channel.colorClass} transition-colors`} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-serif text-base sm:text-lg font-bold text-plum-900">
                              {channel.title}
                            </span>
                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-ivory-200 text-plum-700 uppercase tracking-wider hidden sm:inline-block">
                              {channel.actionText}
                            </span>
                          </div>
                          <p className="font-mono text-xs text-plum-600 truncate mt-0.5">
                            {channel.label}
                          </p>
                        </div>
                      </div>

                      <div className="flex-shrink-0 ml-3">
                        <div className="w-8 h-8 rounded-lg bg-ivory-200 group-hover:bg-bordeaux-800 group-hover:text-ivory-100 text-plum-800 flex items-center justify-center border border-plum-900/20 transition-all">
                          {channel.external ? (
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          ) : (
                            <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                          )}
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Direct Note */}
            <div className="mt-6 pt-4 border-t border-plum-900/10 flex items-center justify-between text-xs font-mono text-plum-600">
              <span className="flex items-center space-x-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-bordeaux-700" />
                <span>Preferred: Email or LinkedIn</span>
              </span>
              <span className="text-plum-500 hidden sm:inline">Direct response</span>
            </div>
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
