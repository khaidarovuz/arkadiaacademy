import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  BookOpen, 
  Users, 
  Award, 
  Coffee, 
  Target, 
  ShieldCheck, 
  Zap
} from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Ilg'or Ta'lim Dasturlari",
      description: "Eski darsliklardan voz kechgan holda, hozirgi kunda eng samarali xalqaro metodikalar va eng yangi o'quv qo'llanmalari.",
      badge: "Metodika",
    },
    {
      icon: Users,
      title: "Kichik Guruhlar (10-12 kishi)",
      description: "Har bir o'quvchiga ustoz tomonidan to'liq individual e'tibor qaratiladi. Hech bir savol javobsiz qolmaydi.",
      badge: "Individual",
    },
    {
      icon: Award,
      title: "Kuchli va Tajribali Ustozlar",
      description: "O'z sohasida ko'p yillik real tajribaga va xalqaro sertifikatlarga ega kuchli amaliyotchi pedagoglar jamoasi.",
      badge: "Ekspertlar",
    },
    {
      icon: Target,
      title: "Muntazam Sinov & Monitoring",
      description: "Har hafta o'quvchilarning o'zlashtirish darajasi testlar orqali tekshirilib, ota-onalarga tahliliy hisobot berib boriladi.",
      badge: "Nazorat",
    },
    {
      icon: Coffee,
      title: "Bepul Coworking & Shinam Muhit",
      description: "Darsdan tashqari vaqtlarda ham markazimizda bemalol o'tirib vazifalarni bajarish, choy/qahva va shinam kutubxona.",
      badge: "Qulaylik",
    },
    {
      icon: Zap,
      title: "Maxsus Chegirmalar va Aksiya",
      description: "Intiluvchan va harakatchan yoshlar uchun o'qish xarajatlarini qulaylashtiruvchi chegirmalar va imtiyozlar tizimi.",
      badge: "Imtiyoz",
    },
  ];

  return (
    <section id="afzalliklar" className="py-20 bg-white dark:bg-neutral-950 relative overflow-hidden transition-colors duration-200">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-xs font-extrabold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NEGA AYNAN ARKADIA ACADEMY?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 dark:text-white tracking-tight font-heading leading-tight mb-4">
            Natijaga Yo'naltirilgan <span className="text-red-600 dark:text-red-500">Ta'lim Tizimi</span>
          </h2>

          <p className="text-neutral-600 dark:text-neutral-300 text-base sm:text-lg">
            Biz shunchaki dars o'tmaymiz — biz har bir o'quvchining yuqori natijaga erishishi uchun mustahkam poydevor quramiz.
          </p>
        </div>

        {/* Features 3D Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="p-8 rounded-3xl bg-neutral-50/70 dark:bg-neutral-900/80 hover:bg-white dark:hover:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-red-500/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-neutral-800 group-hover:bg-red-600 text-red-600 group-hover:text-white shadow-xs flex items-center justify-center transition-colors duration-300 border border-neutral-200/80 dark:border-neutral-700 group-hover:border-red-600">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-100/70 dark:bg-red-950/60 px-2.5 py-1 rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 font-heading group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-200/50 dark:border-neutral-800 flex items-center text-xs font-semibold text-neutral-400 dark:text-neutral-500 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-red-600 dark:text-red-400" />
                  <span>Kafolatlangan sifat</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Large Stats Bar (No hardcoded years, clean metrics) */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
            <div>
              <div className="text-3xl sm:text-5xl font-black text-red-500 font-heading mb-1">
                100%
              </div>
              <div className="text-xs sm:text-sm text-neutral-300 font-medium">
                Sifat kafolati
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-5xl font-black text-white font-heading mb-1">
                500+
              </div>
              <div className="text-xs sm:text-sm text-neutral-300 font-medium">
                Mamnun o'quvchilar
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-5xl font-black text-red-500 font-heading mb-1">
                98%
              </div>
              <div className="text-xs sm:text-sm text-neutral-300 font-medium">
                O'quv natijalari
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-5xl font-black text-white font-heading mb-1">
                15+
              </div>
              <div className="text-xs sm:text-sm text-neutral-300 font-medium">
                Tajribali ustozlar
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
