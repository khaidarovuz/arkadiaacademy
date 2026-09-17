import React from 'react';
import { motion } from 'motion/react';
import { ArkadiaLogo } from './ArkadiaLogo';
import { AcademySettings } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, Award, Users, BookOpen, CheckCircle } from 'lucide-react';

interface HeroProps {
  settings: AcademySettings;
  onOpenAdmission: () => void;
  onExploreCourses: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onOpenAdmission,
  onExploreCourses,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
      {/* 3D Atmospheric ambient light circles (Red & White highlights) */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-red-200/35 via-red-100/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-red-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 -left-20 w-80 h-80 bg-red-300/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Subtle grid pattern background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage: `radial-gradient(#991b1b 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading & Calls to Action */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Clean Admission Open Badge (no hardcoded years) */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-neutral-900/90 border border-red-200/80 dark:border-red-900/50 shadow-xs mb-6 backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                ARKADIA ACADEMY O'QUV MARKAZI
              </span>
              <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                QABUL OCHIQ
              </span>
            </div>

            {/* Main Display Headline */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-neutral-950 dark:text-white tracking-tight leading-[1.12] mb-6 font-heading">
              Kelajakni <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-600 to-red-800">Arkadia Academy</span> bilan quring
            </h1>

            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl mb-8 font-normal">
              Xalqaro IELTS va xorijiy tillar, aniq fanlar, DTM va nufuzli litseylarga intensiv tayyorlov kurslari. 
              Arkadia Academy o'quv markazida har bir o'quvchi uchun individual yondashuv va kafolatlangan yuqori natijalar tizimi.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <button
                onClick={onOpenAdmission}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-base shadow-lg shadow-red-600/25 hover:shadow-xl hover:shadow-red-600/35 transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer"
                id="hero-primary-apply-btn"
              >
                <Sparkles className="w-5 h-5 text-red-200" />
                <span>Qabulga Yozilish (20% Aksiya)</span>
              </button>

              <button
                onClick={onExploreCourses}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/80 dark:bg-neutral-900/80 hover:bg-white dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-400 font-bold text-base border border-neutral-200/90 dark:border-neutral-700/80 hover:border-red-300 shadow-xs hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                id="hero-explore-courses-btn"
              >
                <span>Kurslarni Ko'rish</span>
                <ArrowRight className="w-4 h-4 text-red-600" />
              </button>
            </div>

            {/* Micro proof badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-red-100/80 dark:border-neutral-800 w-full">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-neutral-900 dark:text-white text-sm">Kafolat</div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Yuqori natija</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-neutral-900 dark:text-white text-sm">100% Amaliy</div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Muntazam testlar</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-neutral-900 dark:text-white text-sm">10-12 kishi</div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Kichik guruhlar</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-neutral-900 dark:text-white text-sm">Sertifikat</div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Rasmiy daraja</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3D Interactive Perspective Showcase Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            {/* Main Interactive 3D Tilt Container */}
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Floating Badge 1: Special Discount 20% */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-5 -left-4 sm:-left-8 z-20 glass-card px-4 py-3 rounded-2xl shadow-xl border border-red-200 dark:border-red-900/60 flex items-center gap-3 backdrop-blur-xl"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 text-white flex items-center justify-center font-black text-sm shadow-md shadow-red-600/30">
                  %
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-red-600 dark:text-red-400 font-bold">Maxsus Aksiya</div>
                  <div className="font-extrabold text-neutral-900 dark:text-white text-sm">20% Chegirma</div>
                </div>
              </motion.div>

              {/* Floating Badge 2: Small cohorts */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-6 -right-4 sm:-right-6 z-20 glass-card px-4 py-3 rounded-2xl shadow-xl border border-red-200 dark:border-red-900/60 flex items-center gap-3 backdrop-blur-xl"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-neutral-800 text-white flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-bold">Kichik Guruhlar</div>
                  <div className="font-extrabold text-neutral-900 dark:text-white text-sm">Qabul davom etmoqda</div>
                </div>
              </motion.div>

              {/* Central 3D Aesthetic Card */}
              <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-white via-white to-red-50/40 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 border border-red-100 dark:border-neutral-800 shadow-2xl relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Academy Emblem Display */}
                <div className="flex flex-col items-center justify-center text-center py-6">
                  <div className="relative mb-5 p-4 rounded-3xl bg-gradient-to-b from-red-50/80 to-white dark:from-neutral-800 dark:to-neutral-900 border border-red-100/80 dark:border-neutral-700 shadow-md">
                    <ArkadiaLogo variant="full" size="lg" customLogoUrl={settings.customLogoUrl} />
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/70 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-xs font-bold mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Zamonaviy Ta'lim Standartlari</span>
                  </div>

                  <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs mb-6 font-medium">
                    "{settings.motto}"
                  </p>

                  {/* Active Programs Pills (Languages and Sciences) */}
                  <div className="w-full space-y-2.5">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-neutral-800/80 border border-neutral-100 dark:border-neutral-700 shadow-2xs hover:border-red-200 dark:hover:border-red-800 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                        <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">IELTS Intensive 7.5+</span>
                      </div>
                      <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-md">
                        5 oy
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-neutral-800/80 border border-neutral-100 dark:border-neutral-700 shadow-2xs hover:border-red-200 dark:hover:border-red-800 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                        <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">General English (Ingliz tili)</span>
                      </div>
                      <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-md">
                        4 oy
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-neutral-800/80 border border-neutral-100 dark:border-neutral-700 shadow-2xs hover:border-red-200 dark:hover:border-red-800 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                        <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Matematika & Mantiq</span>
                      </div>
                      <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-md">
                        6 oy
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-neutral-800/80 border border-neutral-100 dark:border-neutral-700 shadow-2xs hover:border-red-200 dark:hover:border-red-800 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                        <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">DTM & Milliy Sertifikat</span>
                      </div>
                      <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-md">
                        6 oy
                      </span>
                    </div>
                  </div>

                  {/* Quick Direct Apply Action */}
                  <button
                    onClick={onOpenAdmission}
                    className="mt-6 w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-red-700 dark:bg-neutral-100 dark:hover:bg-red-600 dark:text-neutral-900 dark:hover:text-white text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    <span>Hoziroq o'rningizni band qiling</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
