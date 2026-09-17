import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Course, Application } from '../types';
import { submitNewApplication } from '../services/storage';
import { Sparkles, Send, CheckCircle, ShieldCheck, PhoneCall, Clock, User, Award } from 'lucide-react';

interface AdmissionSectionProps {
  courses: Course[];
  preSelectedCourseId?: string | null;
  onClearPreSelectedCourse?: () => void;
  onNewApplication?: (newApp: Application) => void;
}

export const AdmissionSection: React.FC<AdmissionSectionProps> = ({
  courses,
  preSelectedCourseId,
  onNewApplication,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [knowledgeLevel, setKnowledgeLevel] = useState("Noldan (Boshlang'ich)");
  const [studyTime, setStudyTime] = useState<'Ertalab' | 'Tushda' | 'Kechga'>('Ertalab');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<Application | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // When pre-selected course changes from props
  useEffect(() => {
    if (preSelectedCourseId) {
      setSelectedCourseId(preSelectedCourseId);
    } else if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
    }
  }, [preSelectedCourseId, courses, selectedCourseId]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhone(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage("Iltimos, ism va familiyangizni to'liq kiriting.");
      return;
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 9) {
      setErrorMessage("Iltimos, to'liq telefon raqamingizni kiriting (kamida 9 ta raqam).");
      return;
    }

    // Format phone nicely for consistency
    let formattedPhone = phone.trim();
    if (digitsOnly.length === 9) {
      formattedPhone = `+998 (${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2, 5)}-${digitsOnly.slice(5, 7)}-${digitsOnly.slice(7, 9)}`;
    } else if (digitsOnly.length === 12 && digitsOnly.startsWith('998')) {
      formattedPhone = `+998 (${digitsOnly.slice(3, 5)}) ${digitsOnly.slice(5, 8)}-${digitsOnly.slice(8, 10)}-${digitsOnly.slice(10, 12)}`;
    }

    const targetCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
    const courseName = targetCourse 
      ? targetCourse.title 
      : (selectedCourseId === 'languages-general' 
          ? 'Xorijiy tillar' 
          : selectedCourseId === 'sciences-general' 
          ? 'Aniq fanlar' 
          : selectedCourseId === 'dtm-general' 
          ? 'DTM tayyorlov' 
          : "Umumiy ta'lim & Maslahat olish");
    const courseId = targetCourse ? targetCourse.id : (selectedCourseId || 'course-general');

    setIsSubmitting(true);

    try {
      const saved = await submitNewApplication({
        fullName: fullName.trim(),
        phone: formattedPhone,
        courseId,
        courseName,
        knowledgeLevel,
        studyTime,
        message: message.trim(),
      });

      setSubmittedApp(saved);
      if (onNewApplication) {
        onNewApplication(saved);
      }
      setIsSubmitting(false);

      // Trigger festive celebratory confetti
      try {
        confetti({
          particleCount: 110,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#dc2626', '#ef4444', '#b91c1c', '#f87171', '#ffffff'],
        });
      } catch {
        // ignore confetti errors
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      setIsSubmitting(false);
      setErrorMessage("Arizani yuborishda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    }
  };

  const handleReset = () => {
    setSubmittedApp(null);
    setFullName('');
    setPhone('+998 ');
    setMessage('');
    setErrorMessage('');
  };

  return (
    <section id="qabul" className="py-20 relative overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 border-t border-neutral-200/60 dark:border-neutral-800">
      
      {/* Decorative backdrop glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-100/30 dark:bg-red-950/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Information & Guarantees */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ARKADIA ACADEMY O'QUV MARKAZI QABULI</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-heading leading-tight mb-4">
              Kelajak sari ilk qadamni hoziroq qo'ying
            </h2>

            <p className="text-neutral-600 dark:text-neutral-300 text-base mb-8 leading-relaxed">
              Arkadia Academy o'quv markaziga onlayn ariza qoldiring va 20% lik maxsus chegirmaga ega bo'ling. 
              Administratorimiz tez orada siz bilan bog'lanib, bepul sinov darsiga taklif qiladi.
            </p>

            {/* Feature points */}
            <div className="space-y-4">
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white text-sm">Birinchi dars bepul</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    O'quv markazimiz sifati, o'qituvchi mahorati va shinam muhitni o'zingiz sinab ko'ring.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white text-sm">Qulay vaqt tanlovi</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Ertalab, tushda yoki kechga — o'zingizga ma'qul vaqtni belgilang.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white text-sm">Rasmiy Sertifikat</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Kursni bitirgan har bir talaba rasmiy sertifikat bilan taqdirlanadi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Admission Form / Success Screen */}
          <div className="lg:col-span-7">
            <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-red-200/70 dark:border-red-900/50 shadow-2xl relative">
              
              {submittedApp ? (
                /* Success Confirmation State */
                <div className="py-8 text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-950/60 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 flex items-center justify-center mb-6 shadow-md">
                    <CheckCircle className="w-10 h-10" />
                  </div>

                  <span className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-3 py-1 rounded-full mb-2">
                    ARIZA MUVOFAQIYATLI QABUL QILINDI
                  </span>

                  <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white font-heading mb-2">
                    Tabriklaymiz, {submittedApp.fullName}!
                  </h3>

                  <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-md mb-6 leading-relaxed">
                    Sizning arizangiz Arkadia Academy tizimiga muvaffaqiyatli qabul qilindi.
                    Tez orada administratorimiz siz bilan ko'rsatilgan telefon raqami orqali bog'lanadi.
                  </p>

                  {/* Summary Card */}
                  <div className="w-full max-w-md bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-5 text-left mb-6 space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-500 dark:text-neutral-400">Ariza ID raqami:</span>
                      <span className="font-extrabold text-red-600 dark:text-red-400 font-mono text-sm">{submittedApp.id}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-500 dark:text-neutral-400">Tanlangan kurs:</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-100">{submittedApp.courseName}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-500 dark:text-neutral-400">Telefon raqam:</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-100">{submittedApp.phone}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-500 dark:text-neutral-400">Qulay vaqt:</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-100">{submittedApp.studyTime}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-500 dark:text-neutral-400">Aksiya holati:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">20% Chegirma band qilindi</span>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white dark:text-neutral-900 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    Boshqa o'quvchi uchun ariza topshirish
                  </button>
                </div>
              ) : (
                /* Application Input Form */
                <form onSubmit={handleSubmit} className="space-y-5" id="admission-form">
                  <div className="border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-2">
                    <h3 className="text-2xl font-black text-neutral-900 dark:text-white font-heading">
                      Online Qabul Anketasi
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Ma'lumotlaringizni to'ldiring va birinchi bepul sinov darsiga yoziling
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold animate-in fade-in duration-200">
                      {errorMessage}
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-2">
                      F.I.SH (Ism va Familiyangiz) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Masalan: Sardorbek Alimov"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all"
                        id="admission-input-fullname"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-2">
                      Telefon raqamingiz *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500">
                        <PhoneCall className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="+998 (90) 123-45-67"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all font-mono"
                        id="admission-input-phone"
                      />
                    </div>
                  </div>

                  {/* Course Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-2">
                        Qaysi kursga qiziqyapsiz? *
                      </label>
                      <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        id="admission-select-course"
                      >
                        {courses.length > 0 ? (
                          courses.map((course) => (
                            <option key={course.id} value={course.id}>
                              {course.title} {course.hasDiscount ? `(${course.discountBadge})` : ''}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="general-consultation">Umumiy ta'lim & Maslahat olish</option>
                            <option value="languages-general">Xorijiy tillar (Ingliz, Rus...)</option>
                            <option value="sciences-general">Aniq fanlar (Matematika, Fizika...)</option>
                            <option value="dtm-general">DTM & Milliy Sertifikat</option>
                          </>
                        )}
                      </select>
                    </div>

                    {/* Knowledge Level */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-2">
                        Bilim darajangiz *
                      </label>
                      <select
                        value={knowledgeLevel}
                        onChange={(e) => setKnowledgeLevel(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                        id="admission-select-level"
                      >
                        <option value="Noldan (Boshlang'ich)">Noldan (Umuman bilmayman)</option>
                        <option value="Boshlang'ich (Elementary / A1)">Boshlang'ich (A1/A2)</option>
                        <option value="O'rta (Intermediate / B1-B2)">O'rta daraja (B1 / B2)</option>
                        <option value="Kuchli (Advanced)">Kuchli daraja</option>
                      </select>
                    </div>
                  </div>

                  {/* Time Preferences: Ertalab, Tushda yoki Kechga */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                        Qulay o'qish vaqti (Ertalab / Tushda / Kechga) *
                      </label>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Tanlandi: <strong className="text-red-600 dark:text-red-400">{studyTime}</strong>
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2.5">
                      {(['Ertalab', 'Tushda', 'Kechga'] as const).map((timeOption) => {
                        const isSelected = studyTime === timeOption;
                        return (
                          <button
                            type="button"
                            key={timeOption}
                            onClick={() => setStudyTime(timeOption)}
                            className={`relative py-3 px-3 rounded-2xl border text-xs font-bold text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                              isSelected
                                ? 'bg-gradient-to-r from-red-600 to-red-700 border-red-600 text-white shadow-lg shadow-red-600/25 ring-2 ring-red-500/40'
                                : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:border-red-300 dark:hover:border-red-700'
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-white">
                                <CheckCircle className="w-3.5 h-3.5" />
                              </div>
                            )}
                            <span className="text-xl">
                              {timeOption === 'Ertalab' ? '🌅' : timeOption === 'Tushda' ? '☀️' : '🌙'}
                            </span>
                            <span className="font-extrabold">{timeOption}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Optional Message */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-2">
                      Qo'shimcha savol yoki istaklar (ixtiyoriy)
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Masalan: Do'stim bilan birga yozilmoqchiman..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:border-red-600 focus:ring-2 focus:ring-red-600/20 outline-none transition-all resize-none"
                      id="admission-input-message"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-base shadow-lg shadow-red-600/25 hover:shadow-xl hover:shadow-red-600/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    id="admission-submit-btn"
                  >
                    {isSubmitting ? (
                      <span>Ariza yuborilmoqda...</span>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Arizani Topshirish va 20% Chegirma Olish</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-neutral-400 dark:text-neutral-500">
                    Ma'lumotlaringiz maxfiy saqlanadi va uchinchi shaxslarga berilmaydi.
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
