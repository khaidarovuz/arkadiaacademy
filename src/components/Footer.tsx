import React from 'react';
import { ArkadiaLogo } from './ArkadiaLogo';
import { AcademySettings, BranchLocation } from '../types';
import { Phone, Send, Instagram, Lock, ArrowUp, MapPin } from 'lucide-react';

interface FooterProps {
  settings: AcademySettings;
  onOpenAdminLogin: () => void;
  isAdminLoggedIn?: boolean;
  onOpenAdminPanel?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenAdminLogin,
  isAdminLoggedIn,
  onOpenAdminPanel,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const branches: BranchLocation[] = (settings.branches && settings.branches.length > 0)
    ? settings.branches
    : [
        {
          id: 'def-1',
          name: 'Bosh Filial',
          address: settings.address,
          landmark: 'Metro bekati yonida',
          isMain: true,
        },
      ];

  return (
    <footer className="bg-neutral-950 text-white relative pt-16 pb-12 overflow-hidden border-t border-red-900/30">
      {/* Decorative red glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
          
          {/* Col 1 & 2: Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <div className="cursor-pointer inline-block" onClick={scrollToTop}>
              <ArkadiaLogo
                variant="horizontal"
                size="md"
                lightMode={true}
                customLogoUrl={settings.customLogoUrl}
              />
            </div>

            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Arkadia Academy — zamonaviy metodika va yuqori natijalarga yo'naltirilgan o'quv markazi. 
              Xorijiy tillar va aniq fanlar bo'yicha sifatli ta'lim beramiz.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-neutral-900 hover:bg-blue-600 text-neutral-300 hover:text-white flex items-center justify-center transition-colors border border-neutral-800"
                title="Telegram Kanal"
                id="footer-tg-icon"
              >
                <Send className="w-4 h-4" />
              </a>

              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-neutral-900 hover:bg-pink-600 text-neutral-300 hover:text-white flex items-center justify-center transition-colors border border-neutral-800"
                title="Instagram Sahifa"
                id="footer-insta-icon"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}
                className="w-10 h-10 rounded-xl bg-neutral-900 hover:bg-red-600 text-neutral-300 hover:text-white flex items-center justify-center transition-colors border border-neutral-800"
                title="Telefon"
                id="footer-phone-icon"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-widest">
              Bo'limlar
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <a href="#kurslar" className="hover:text-red-400 transition-colors">
                  Barcha Kurslar
                </a>
              </li>
              <li>
                <a href="#afzalliklar" className="hover:text-red-400 transition-colors">
                  Afzalliklarimiz
                </a>
              </li>
              <li>
                <a href="#yangiliklar" className="hover:text-red-400 transition-colors">
                  Yangiliklar & E'lonlar
                </a>
              </li>
              <li>
                <a href="#galereya" className="hover:text-red-400 transition-colors">
                  Foto & Video Galereya
                </a>
              </li>
              <li>
                <a href="#qabul" className="hover:text-red-400 transition-colors text-red-400 font-semibold">
                  Online Qabul
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Top Directions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-widest">
              Yo'nalishlar
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>IELTS Intensive 7.5+</li>
              <li>General English (Ingliz tili)</li>
              <li>Rus tili (So'zlashuv)</li>
              <li>Matematika & Mantiq</li>
              <li>DTM & Milliy Sertifikat</li>
            </ul>
          </div>

          {/* Col 5: Branches & Contacts Summary */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-widest flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>Filiallarimiz ({branches.length})</span>
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-400">
              <p className="font-mono text-white text-sm font-semibold">
                {settings.phone}
              </p>
              {branches.map((b, i) => (
                <div key={b.id || i} className="border-l-2 border-red-600/60 pl-2.5 py-0.5">
                  <p className="text-neutral-200 font-bold text-xs">{b.name}</p>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">{b.address}</p>
                  {b.landmark && (
                    <p className="text-red-400 text-[10px] mt-0.5">{b.landmark}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar & Discreet Admin Trigger */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span>© Arkadia Academy. Barcha huquqlar himoyalangan.</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Secret / Discreet Admin Access */}
            {isAdminLoggedIn ? (
              <button
                onClick={onOpenAdminPanel}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/80 text-red-300 hover:text-white border border-red-800 text-[11px] font-semibold transition-colors cursor-pointer"
                id="footer-admin-panel-link"
              >
                <Lock className="w-3 h-3 text-red-400" />
                <span>Boshqaruv Paneli</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="inline-flex items-center text-neutral-700 hover:text-neutral-400 transition-colors p-1.5 rounded-md opacity-30 hover:opacity-90 cursor-pointer"
                id="footer-admin-login-secret-trigger"
                aria-label="Admin"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-red-600 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Yuqoriga chiqish"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
