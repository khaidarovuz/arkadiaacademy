import React, { useState } from 'react';
import { ArkadiaLogo } from './ArkadiaLogo';
import { AcademySettings } from '../types';
import { Phone, Send, Instagram, Menu, X, Sparkles, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  settings: AcademySettings;
  onOpenAdmission: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onOpenAdmission,
  darkMode = false,
  onToggleDarkMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top micro announcement bar (Glass / Crimson) */}
      {settings.showAnnouncement && settings.announcementText && (
        <div id="announcement-bar" className="w-full bg-gradient-to-r from-red-800 via-red-700 to-red-900 text-white text-xs sm:text-sm py-1.5 px-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 truncate">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-red-700 uppercase tracking-wider shrink-0">
                Muhim E'lon
              </span>
              <p className="truncate text-red-50 font-medium">
                {settings.announcementText}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3 text-xs shrink-0">
              <a
                href={settings.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-red-100 hover:text-white transition-colors"
                id="topbar-tg-link"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{settings.telegramUsername}</span>
              </a>
              <span className="text-red-400/80">|</span>
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-red-100 hover:text-white transition-colors"
                id="topbar-insta-link"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>@{settings.instagramUsername.replace(/^@/, '')}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Glassmorphism Navbar */}
      <nav className="glass-bar border-b border-red-500/10 dark:border-neutral-800 shadow-xs transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group" id="nav-brand-logo">
            <ArkadiaLogo
              variant="horizontal"
              size="md"
              customLogoUrl={settings.customLogoUrl}
            />
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7 text-[15px] font-medium text-neutral-700 dark:text-neutral-200">
            <a
              href="#kurslar"
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors py-1 relative group"
              id="nav-link-courses"
            >
              Kurslar
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full" />
            </a>
            <a
              href="#afzalliklar"
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors py-1 relative group"
              id="nav-link-whyus"
            >
              Afzalliklar
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full" />
            </a>
            <a
              href="#yangiliklar"
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors py-1 relative group"
              id="nav-link-news"
            >
              Yangiliklar
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full" />
            </a>
            <a
              href="#galereya"
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors py-1 relative group"
              id="nav-link-gallery"
            >
              Galereya
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full" />
            </a>
            <a
              href="#qabul"
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors py-1 relative group flex items-center gap-1.5 font-semibold text-red-600 dark:text-red-400"
              id="nav-link-admission"
            >
              <span>Qabul</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
            </a>
            <a
              href="#aloqa"
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors py-1 relative group"
              id="nav-link-contact"
            >
              Aloqa
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full" />
            </a>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Phone Quick Link */}
            <a
              href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}
              className="hidden xl:inline-flex items-center gap-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-400 transition-colors px-3 py-2 rounded-xl hover:bg-red-50/70 dark:hover:bg-neutral-800/60"
              id="nav-phone-button"
            >
              <div className="w-8 h-8 rounded-lg bg-red-100/80 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <span className="tracking-tight">{settings.phone}</span>
            </a>

            {/* Dark / Light Mode Toggle Button */}
            {onToggleDarkMode && (
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="w-10 h-10 rounded-xl border border-neutral-200/80 dark:border-neutral-700/80 bg-white/70 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                title={darkMode ? "Yorug' rejimga o'tish" : "Tungi rejimga o'tish"}
                id="theme-toggle-btn"
                aria-label="Rejimni o'zgartirish"
              >
                {darkMode ? (
                  <Sun className="w-4.5 h-4.5 text-amber-400 animate-in spin-in-90 duration-200" />
                ) : (
                  <Moon className="w-4.5 h-4.5 text-neutral-700 animate-in spin-in-90 duration-200" />
                )}
              </button>
            )}

            {/* Primary CTA: Admission Application */}
            <button
              onClick={onOpenAdmission}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold text-sm shadow-md shadow-red-600/20 hover:shadow-lg hover:shadow-red-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              id="nav-cta-apply"
            >
              <Sparkles className="w-4 h-4 text-red-200" />
              <span>Ariza Topshirish</span>
            </button>
          </div>

          {/* Mobile Menu & Theme Toggle (Theme toggle hidden on sm+ where desktop button is shown) */}
          <div className="flex items-center gap-2 lg:hidden">
            {onToggleDarkMode && (
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="sm:hidden p-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-red-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="Rejimni o'zgartirish"
                id="mobile-theme-toggle-btn"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-red-50 dark:hover:bg-neutral-800 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
              aria-label="Menyuni ochish"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-bar border-t border-red-500/10 dark:border-neutral-800 px-4 pt-4 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
            <a
              href="#kurslar"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-neutral-800 dark:text-neutral-200 hover:bg-red-50 dark:hover:bg-neutral-800 hover:text-red-600 dark:hover:text-red-400"
            >
              Kurslar va Dasturlar
            </a>
            <a
              href="#afzalliklar"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-neutral-800 dark:text-neutral-200 hover:bg-red-50 dark:hover:bg-neutral-800 hover:text-red-600 dark:hover:text-red-400"
            >
              Nega Arkadia Academy?
            </a>
            <a
              href="#yangiliklar"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-neutral-800 dark:text-neutral-200 hover:bg-red-50 dark:hover:bg-neutral-800 hover:text-red-600 dark:hover:text-red-400"
            >
              Yangiliklar va E'lonlar
            </a>
            <a
              href="#galereya"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-neutral-800 dark:text-neutral-200 hover:bg-red-50 dark:hover:bg-neutral-800 hover:text-red-600 dark:hover:text-red-400"
            >
              Foto & Video Galereya
            </a>
            <a
              href="#qabul"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-semibold text-red-600 dark:text-red-400 bg-red-50/70 dark:bg-red-950/40"
            >
              Qabul (Ariza topshirish)
            </a>
            <a
              href="#aloqa"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-neutral-800 dark:text-neutral-200 hover:bg-red-50 dark:hover:bg-neutral-800 hover:text-red-600 dark:hover:text-red-400"
            >
              Bog'lanish va Manzil
            </a>

            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-2.5">
              <a
                href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}
                className="w-full py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-center flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span>{settings.phone}</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmission();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-center shadow-md shadow-red-600/20 cursor-pointer"
              >
                Online Qabulga Yozilish
              </button>
              <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 px-1 pt-1">
                <a href={settings.telegramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-red-600 dark:hover:text-red-400">
                  <Send className="w-3.5 h-3.5 text-blue-500" />
                  <span>{settings.telegramUsername}</span>
                </a>
                <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-red-600 dark:hover:text-red-400">
                  <Instagram className="w-3.5 h-3.5 text-pink-500" />
                  <span>@{settings.instagramUsername.replace(/^@/, '')}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
