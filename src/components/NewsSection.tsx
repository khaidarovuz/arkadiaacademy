import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NewsItem } from '../types';
import { Calendar, User, Tag, ArrowRight, Play, X, Sparkles, Heart } from 'lucide-react';

interface NewsSectionProps {
  news: NewsItem[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({ news }) => {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="yangiliklar" className="py-20 bg-neutral-50/70 dark:bg-neutral-900/40 border-t border-neutral-200/60 dark:border-neutral-800 relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ARKADIA ACADEMY HAYOTI VA XABARLARI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-heading">
              So'nggi Yangiliklar & Tadbirlar
            </h2>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-md">
            O'quv markazimizdagi eng so'nggi musobaqalar, ochiq darslar va yutuqlar haqida doimiy xabardor bo'ling.
          </p>
        </div>

        {/* News Cards Grid or Empty State */}
        {news.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 sm:p-12 text-center border border-neutral-200/80 dark:border-neutral-800 max-w-xl mx-auto my-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-2 font-heading">
              Yangiliklar Tez Kunda
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6">
              O'quv markazimizning navbatdagi tadbirlari, master-klasslari va natijalari haqidagi xabarlar tez orada shu yerda e'lon qilinadi.
            </p>
            <a
              href="#qabul"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all"
            >
              <span>Qabulga Yozilish</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => {
            const isLiked = likedIds[item.id];
            const displayLikes = (item.likes || 12) + (isLiked ? 1 : 0);

            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelectedNews(item)}
                className="group bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 hover:border-red-500/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
                id={`news-card-${item.id}`}
              >
                {/* Media (Image or Video preview) */}
                <div className="relative w-full bg-neutral-950/5 dark:bg-neutral-950 flex items-center justify-center overflow-hidden border-b border-neutral-100 dark:border-neutral-800">
                  {item.mediaType === 'video' ? (
                    <div className="relative w-full h-48 flex items-center justify-center bg-black">
                      <video
                        src={item.mediaUrl}
                        className="w-full h-full object-cover opacity-80"
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 ml-0.5" fill="white" />
                        </div>
                      </div>
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                        Video
                      </span>
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-center">
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        className="w-full h-auto max-h-60 object-contain block transition-transform duration-500 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 bg-neutral-900/85 backdrop-blur-xs text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                        {item.category || 'Yangilik'}
                      </span>
                    </div>
                  )}

                  {/* Like button */}
                  <button
                    onClick={(e) => toggleLike(item.id, e)}
                    className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-bold ${
                      isLiked
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-black/40 hover:bg-black/60 text-white'
                    }`}
                    title="Yoqdi"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
                    <span>{displayLikes}</span>
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-neutral-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                        <span>{item.date}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 truncate">
                        <User className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{item.author}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors mb-3 line-clamp-2 font-heading">
                      {item.title}
                    </h3>

                    <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed mb-4">
                      {item.excerpt || item.content}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    {/* Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <span className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Batafsil</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
        )}

      </div>

      {/* News Full View Modal */}
      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-neutral-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-100 dark:border-neutral-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-2.5 py-0.5 rounded-full">
                      {selectedNews.category}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {selectedNews.date}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-neutral-900 dark:text-white leading-snug font-heading">
                    {selectedNews.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedNews(null)}
                  className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Media viewer */}
              <div className="rounded-2xl overflow-hidden mb-6 bg-neutral-900">
                {selectedNews.mediaType === 'video' ? (
                  <video
                    src={selectedNews.mediaUrl}
                    controls
                    autoPlay
                    className="w-full max-h-96 object-contain"
                  />
                ) : (
                  <img
                    src={selectedNews.mediaUrl}
                    alt={selectedNews.title}
                    className="w-full max-h-96 object-cover"
                  />
                )}
              </div>

              {/* Content text */}
              <div className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed space-y-4 mb-6 whitespace-pre-line">
                {selectedNews.content}
              </div>

              {/* Tags & Close */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Tag className="w-3.5 h-3.5 text-neutral-400" />
                  {selectedNews.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedNews(null)}
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold hover:bg-neutral-800 dark:hover:bg-white transition-colors cursor-pointer"
                >
                  Yopish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
