import React, { useState, useEffect } from 'react';
import { AcademySettings } from '../types';
import { Send, Instagram, Phone, X, Check, ExternalLink, Sparkles } from 'lucide-react';

interface EditSocialModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AcademySettings;
  onSave: (newSettings: AcademySettings) => Promise<void> | void;
}

export const EditSocialModal: React.FC<EditSocialModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [telegramUsername, setTelegramUsername] = useState(settings.telegramUsername || '');
  const [instagramUsername, setInstagramUsername] = useState(settings.instagramUsername || '');
  const [phone, setPhone] = useState(settings.phone || '');
  const [phoneSecondary, setPhoneSecondary] = useState(settings.phoneSecondary || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTelegramUsername(settings.telegramUsername || '');
      setInstagramUsername(settings.instagramUsername || '');
      setPhone(settings.phone || '');
      setPhoneSecondary(settings.phoneSecondary || '');
      setSavedSuccess(false);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  // Compute live URLs
  const cleanTg = telegramUsername.trim().replace(/^@/, '');
  const cleanInsta = instagramUsername.trim().replace(/^@/, '');

  const liveTelegramUrl = cleanTg ? `https://t.me/${cleanTg}` : '';
  const liveInstagramUrl = cleanInsta ? `https://instagram.com/${cleanInsta}` : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedTgUser = cleanTg ? (cleanTg.startsWith('@') ? cleanTg : `@${cleanTg}`) : '';
    const formattedInstaUser = cleanInsta;

    const updatedSettings: AcademySettings = {
      ...settings,
      telegramUsername: formattedTgUser,
      telegramUrl: liveTelegramUrl || settings.telegramUrl,
      instagramUsername: formattedInstaUser,
      instagramUrl: liveInstagramUrl || settings.instagramUrl,
      phone: phone.trim() || settings.phone,
      phoneSecondary: phoneSecondary.trim() || settings.phoneSecondary,
    };

    await onSave(updatedSettings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center shadow-md shadow-red-600/30 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-neutral-900 dark:text-white font-heading">
                Telegram & Instagram Tahrirlash
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Username va havolalarni istalgan vaqtda to'g'rilang
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2 duration-150">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Muvaffaqiyatli saqlandi! Barcha bo'limlar yangilandi.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Telegram Block */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                <div className="w-6 h-6 rounded-lg bg-blue-500 text-white flex items-center justify-center shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <span>Telegram Kanal / Guruh</span>
              </div>
              {liveTelegramUrl && (
                <a
                  href={liveTelegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>Tekshirish</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                Telegram Username (@belgisi bilan yoki siz)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">@</span>
                <input
                  type="text"
                  required
                  value={cleanTg}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  placeholder="arkadia_academy"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs font-mono focus:border-red-600 dark:focus:border-red-500 outline-none transition-colors"
                />
              </div>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1">
                Havola avtomatik shakllanadi: <span className="font-mono text-blue-600 dark:text-blue-400">{liveTelegramUrl || 'https://t.me/...'}</span>
              </p>
            </div>
          </div>

          {/* Instagram Block */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shrink-0">
                  <Instagram className="w-3.5 h-3.5" />
                </div>
                <span>Instagram Sahifa</span>
              </div>
              {liveInstagramUrl && (
                <a
                  href={liveInstagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-pink-600 dark:text-pink-400 hover:underline"
                >
                  <span>Tekshirish</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                Instagram Username
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">@</span>
                <input
                  type="text"
                  required
                  value={cleanInsta}
                  onChange={(e) => setInstagramUsername(e.target.value)}
                  placeholder="arkadia_academy"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs font-mono focus:border-red-600 dark:focus:border-red-500 outline-none transition-colors"
                />
              </div>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1">
                Havola avtomatik shakllanadi: <span className="font-mono text-pink-600 dark:text-pink-400">{liveInstagramUrl || 'https://instagram.com/...'}</span>
              </p>
            </div>
          </div>

          {/* Quick Phone Update */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">
                Asosiy Telefon
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs font-mono focus:border-red-600 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">
                Qo'shimcha Telefon
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  value={phoneSecondary}
                  onChange={(e) => setPhoneSecondary(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs font-mono focus:border-red-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-black shadow-lg shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Saqlash va Yangilash</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
