import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Course, CourseCategory } from '../types';
import { Sparkles, Clock, Calendar, UserCheck, CheckCircle2, ArrowRight, Tag, Info, X, Search, RotateCcw } from 'lucide-react';

interface CoursesSectionProps {
  courses: Course[];
  onSelectCourseForAdmission: (course: Course) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  courses,
  onSelectCourseForAdmission,
}) => {
  const [activeCategory, setActiveCategory] = useState<CourseCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState<Course | null>(null);

  const categories = [
    { id: 'all', label: 'Barcha Kurslar' },
    { id: 'languages', label: 'Xorijiy Tillar' },
    { id: 'sciences', label: 'Aniq Fanlar & Mantiq' },
    { id: 'dtm', label: 'DTM & Sertifikatlar' },
    { id: 'kids', label: 'Bolalar uchun' },
  ];

  const categoryLabelsMap: Record<string, string> = {
    languages: "xorijiy tillar ingliz tili rus tili nemis tili koreys tili arab tili xitoy tili language english",
    sciences: "aniq fanlar matematika fizika mantiq mental arifmetika math physics",
    dtm: "dtm sertifikat cefr ielts milliy sertifikat abituriyent imtihon test",
    kids: "bolalar uchun robototexnika mental arifmetika savodxonlik bolakay",
    it: "it dasturlash kompyuter savodxonligi dasturchi web",
  };

  const filteredCourses = courses.filter((course) => {
    // 1. Kategoriya bo'yicha tekshirish
    const matchesCategory = activeCategory === 'all' || course.category === activeCategory;

    // 2. Qidiruv so'zi bo'yicha tekshirish
    if (!searchQuery.trim()) {
      return matchesCategory;
    }

    const query = searchQuery.toLowerCase().trim();
    const categoryKeywords = (categoryLabelsMap[course.category] || '') + ' ' + course.category;

    const matchesSearch =
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      course.mentor.toLowerCase().includes(query) ||
      categoryKeywords.toLowerCase().includes(query) ||
      (course.syllabus && course.syllabus.some((item) => item.toLowerCase().includes(query)));

    return matchesCategory && matchesSearch;
  });

  const formatPrice = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + " so'm";
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
  };

  return (
    <section id="kurslar" className="py-20 bg-white/70 dark:bg-neutral-900/50 relative border-t border-neutral-200/50 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-xs font-extrabold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ARKADIA ACADEMY TA'LIM DASTURLARI</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-heading">
                Talabgir Kurslarimiz
              </h2>
              <p className="mt-3 text-neutral-600 dark:text-neutral-300 text-base max-w-2xl leading-relaxed">
                Eng yangi xalqaro metodikalar va samarali dasturlar asosida o'tiladigan kurslar. 
                Tajribali ustozlar va kafolatlangan yuqori natijalar.
              </p>
            </div>

            {/* Quick stats indicator */}
            <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium shrink-0 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Jami {courses.length} ta yo'nalish bo'yicha qabul ochiq</span>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-3xl p-4 sm:p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-xs mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            
            {/* Real-time Search Input Field */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="courses-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kurs nomi, fan, mentor yoki yo'nalish bo'yicha qidiring (masalan: Ingliz tili, Matematika, IELTS)..."
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-xs sm:text-sm placeholder:text-neutral-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all shadow-xs"
                aria-label="Kurslarni qidirish"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer"
                  title="Qidiruvni tozalash"
                  aria-label="Qidiruvni tozalash"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results count badge */}
            <div className="hidden sm:flex items-center px-4 py-2.5 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-300 whitespace-nowrap shrink-0">
              <span>Topildi:</span>
              <span className="ml-1.5 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 font-extrabold text-[11px]">
                {filteredCourses.length} ta kurs
              </span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mr-1 hidden sm:inline">
              Kategoriya:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as CourseCategory)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-800 hover:border-red-300 dark:hover:border-red-900 hover:text-red-600 dark:hover:text-red-400'
                }`}
                id={`filter-cat-${cat.id}`}
              >
                {cat.label}
              </button>
            ))}

            {/* Active search or filter reset button */}
            {(searchQuery.trim() !== '' || activeCategory !== 'all') && (
              <button
                onClick={handleResetFilters}
                className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                title="Barcha filtrlarni tozalash"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Filtrlarni tozalash</span>
              </button>
            )}
          </div>
        </div>

        {/* Empty State when no courses or no search results */}
        {courses.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 sm:p-12 text-center border border-neutral-200 dark:border-neutral-800 max-w-xl mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-2 font-heading">
              Yangi O'quv Dasturlari Tayyorlanmoqda
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6">
              Arkadia Academy ning yangi guruhlari va dars jadvali shakllantirilmoqda. Tez orada barcha o'quv dasturlari shu yerda e'lon qilinadi.
            </p>
            <a
              href="#qabul"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all"
            >
              <span>Oldindan Maslahat Olish</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-10 text-center border border-neutral-200 dark:border-neutral-800 max-w-xl mx-auto my-8">
            <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 font-heading">
              Hech qanday kurs topilmadi
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6">
              {searchQuery ? `"${searchQuery}" so'rovi bo'yicha kurs topilmadi.` : "Ushbu kategoriyada hozircha kurs mavjud emas."} So'z imlosini tekshirib ko'ring yoki barcha kurslarni ko'ring.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Barcha kurslarni ko'rsatish</span>
            </button>
          </div>
        ) : null}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <motion.div
              key={course.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="group rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-red-500/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative"
              id={`course-card-${course.id}`}
            >
              {/* Course Image Container (Un-cropped, displays full banner smoothly) */}
              <div className="relative w-full bg-neutral-950/5 dark:bg-neutral-950 flex items-center justify-center overflow-hidden border-b border-neutral-100 dark:border-neutral-800">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-auto max-h-72 object-contain block transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                />

                {/* Discount Badge */}
                {course.hasDiscount && (
                  <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-black text-xs shadow-md">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{course.discountBadge || 'AKSIYA'}</span>
                  </div>
                )}

                {/* Popular or Seats left */}
                {course.seatsLeft && (
                  <div className="absolute top-3 right-3 z-10 inline-flex items-center px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10">
                    {course.seatsLeft} ta joy qoldi
                  </div>
                )}
              </div>

              {/* Body Content */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Category & Title */}
                  <div className="mb-3">
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-2.5 py-1 rounded-lg border border-red-100 dark:border-red-900/40">
                      {course.category === 'languages' ? 'Xorijiy Til' : course.category === 'sciences' ? 'Aniq Fan' : course.category === 'dtm' ? 'DTM / Sertifikat' : 'Bolalar uchun'}
                    </span>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mt-2 leading-snug font-heading">
                      {course.title}
                    </h3>
                  </div>

                  {course.description && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 mb-4 leading-relaxed">
                      {course.description}
                    </p>
                  )}

                  {/* Course Details Info: Davomiyligi va Darslar jadvali */}
                  <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 space-y-2.5 mb-5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                        <Clock className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">Davomiyligi:</span>
                      </div>
                      <span className="font-bold text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 px-2.5 py-0.5 rounded-lg border border-neutral-200/70 dark:border-neutral-700">
                        {course.duration || '3 oy'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                        <Calendar className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">Darslar jadvali:</span>
                      </div>
                      <span className="font-bold text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 px-2.5 py-0.5 rounded-lg border border-neutral-200/70 dark:border-neutral-700 text-right">
                        {course.lessonsPerWeek || 'Haftada 3 kun'}
                      </span>
                    </div>

                    {course.mentor && (
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-200/50 dark:border-neutral-700/50">
                        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                          <UserCheck className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                          <span className="font-semibold text-neutral-800 dark:text-neutral-200">Mentor:</span>
                        </div>
                        <span className="font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[150px]">
                          {course.mentor}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price & Action Section */}
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[11px] text-neutral-400 font-medium">Oylik to'lov:</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-red-600 dark:text-red-400">
                        {formatPrice(course.price)}
                      </span>
                      {course.originalPrice && course.hasDiscount && (
                        <span className="text-xs text-neutral-400 line-through">
                          {formatPrice(course.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedCourseForDetail(course)}
                      className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-colors"
                      title="Kurs rejasi va ma'lumot"
                      aria-label="Kurs ma'lumotlari"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onSelectCourseForAdmission(course)}
                      className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer group"
                      id={`apply-course-btn-${course.id}`}
                    >
                      <span>Yozilish</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Course Detail Syllabus Modal */}
      <AnimatePresence>
        {selectedCourseForDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-neutral-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-100 dark:border-neutral-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-2.5 py-1 rounded-md">
                    Kurs Dasturi & Tafsilotlar
                  </span>
                  <h3 className="text-2xl font-black text-neutral-900 dark:text-white mt-2 font-heading">
                    {selectedCourseForDetail.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCourseForDetail(null)}
                  className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
                {selectedCourseForDetail.description}
              </p>

              <div className="bg-neutral-50 dark:bg-neutral-800/70 rounded-2xl p-4 mb-6 space-y-2 border border-neutral-200/60 dark:border-neutral-700">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500 dark:text-neutral-400 font-medium">Davomiyligi:</span>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">{selectedCourseForDetail.duration}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500 dark:text-neutral-400 font-medium">Haftalik yuklama:</span>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">{selectedCourseForDetail.lessonsPerWeek}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500 dark:text-neutral-400 font-medium">Katta mentor:</span>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">{selectedCourseForDetail.mentor}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500 dark:text-neutral-400 font-medium">Oylik to'lov:</span>
                  <span className="font-bold text-red-600 dark:text-red-400 text-sm">{formatPrice(selectedCourseForDetail.price)}</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span>Dastur davomida nimalarni o'rganasiz:</span>
                </h4>
                <div className="space-y-2.5">
                  {selectedCourseForDetail.syllabus.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800/90 p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-700/60">
                      <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="leading-snug pt-0.5">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedCourseForDetail(null)}
                  className="flex-1 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  Yopish
                </button>
                <button
                  onClick={() => {
                    const c = selectedCourseForDetail;
                    setSelectedCourseForDetail(null);
                    onSelectCourseForAdmission(c);
                  }}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20"
                >
                  Ushbu kursga yozilish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
