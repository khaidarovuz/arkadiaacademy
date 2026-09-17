import React from 'react';
import { AcademySettings, BranchLocation } from '../types';
import { Phone, Send, Instagram, MapPin, Clock, ArrowUpRight, Sparkles, Building2, Navigation } from 'lucide-react';

interface ContactSectionProps {
  settings: AcademySettings;
  onOpenAdmission: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  onOpenAdmission,
}) => {
  // Normalize branches list
  const branches: BranchLocation[] = (settings.branches && settings.branches.length > 0)
    ? settings.branches
    : [
        {
          id: 'default-1',
          name: 'Bosh Filial',
          address: settings.address,
          landmark: "Metro bekati yaqinida",
          phone: settings.phone,
          isMain: true,
        },
      ];

  return (
    <section id="aloqa" className="py-20 bg-neutral-50/80 dark:bg-neutral-950/80 relative border-t border-neutral-200/60 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ARKADIA ACADEMY BOG'LANISH</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-heading">
            Biz bilan bog'laning
          </h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-300 text-base">
            Savollaringiz bormi? Markazlarimizga tashrif buyuring yoki telefon orqali bepul ma'lumot oling.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Phone Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">Telefon Raqamlar</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">Qo'ng'iroqlarga 7/24 javob beramiz</p>
              <a
                href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}
                className="text-base font-extrabold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 block transition-colors font-mono"
              >
                {settings.phone}
              </a>
              {settings.phoneSecondary && (
                <a
                  href={`tel:${settings.phoneSecondary.replace(/[^\d+]/g, '')}`}
                  className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 block mt-1 font-mono"
                >
                  {settings.phoneSecondary}
                </a>
              )}
            </div>
            <a
              href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-400"
            >
              <span>Qo'ng'iroq qilish</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Telegram Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">Telegram Kanal</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">Barcha xabarlar va e'lonlar</p>
              <div className="text-base font-extrabold text-blue-600 dark:text-blue-400 truncate">
                {settings.telegramUsername}
              </div>
            </div>
            <a
              href={settings.telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400"
              id="contact-tg-btn"
            >
              <span>Kanalga a'zo bo'lish</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Instagram Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-4">
                <Instagram className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">Instagram Sahifa</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">Foto, video va jonli efirlar</p>
              <div className="text-base font-extrabold text-pink-600 dark:text-pink-400 truncate">
                @{settings.instagramUsername.replace(/^@/, '')}
              </div>
            </div>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:text-pink-600 dark:hover:text-pink-400"
              id="contact-insta-btn"
            >
              <span>Instagramda kuzatish</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Working Hours Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">Ish Vaqti</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">Dam olish kunlarisiz</p>
              <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 leading-relaxed">
                {settings.workingHours}
              </div>
            </div>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Hozir ochiq</span>
            </div>
          </div>

        </div>

        {/* Arkadia Multiple Branches & Addresses Showcase */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                <span>Arkadia Academy Filiallari va Manzillari</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-1">
                O'zingizga qulay filialimizga tashrif buyuring
              </h3>
            </div>
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-xl self-start sm:self-auto">
              Jami {branches.length} ta o'quv filiali
            </span>
          </div>

          <div className={`grid grid-cols-1 ${branches.length > 1 ? 'md:grid-cols-2 lg:grid-cols-' + Math.min(branches.length, 3) : ''} gap-5`}>
            {branches.map((branch, index) => (
              <div
                key={branch.id || `branch-${index}`}
                className="rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group"
              >
                {branch.isMain && (
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                    Asosiy Bino
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-neutral-900 dark:text-white">
                        {branch.name || `${index + 1}-Filial`}
                      </h4>
                      {branch.landmark && (
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                          {branch.landmark}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium mt-2">
                    {branch.address}
                  </p>

                  {branch.phone && (
                    <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                      <span className="text-neutral-500 dark:text-neutral-400">Filial aloqa:</span>
                      <a
                        href={`tel:${branch.phone.replace(/[^\d+]/g, '')}`}
                        className="font-bold text-neutral-800 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-400 font-mono"
                      >
                        {branch.phone}
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3">
                  <a
                    href={`https://yandex.uz/maps/?text=${encodeURIComponent('Arkadia Academy ' + branch.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Xaritada ko'rish</span>
                  </a>

                  <button
                    onClick={onOpenAdmission}
                    className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-neutral-800 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-400 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Qabulga yozilish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
