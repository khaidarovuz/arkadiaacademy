import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GalleryItem } from '../types';
import { Play, Sparkles, X, Image as ImageIcon, Video, Calendar, Eye } from 'lucide-react';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'dars' | 'yutuqlar' | 'tadbirlar'>('all');
  const [activeMedia, setActiveMedia] = useState<GalleryItem | null>(null);

  const filteredItems = gallery.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'image') return item.type === 'image';
    if (filter === 'video') return item.type === 'video';
    return item.category === filter;
  });

  return (
    <section id="galereya" className="py-20 bg-white dark:bg-neutral-950 relative border-t border-neutral-200/60 dark:border-neutral-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ARKADIA ACADEMY FOTO VA VIDEO ARXIVI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight font-heading">
              Akademiya Hayotidan Lavhalar
            </h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-300 text-sm max-w-lg">
              O'quvchilarimizning amaliy darslari, yutuqlari, speaking klublar va Arkadia Academyning zamonaviy muhiti.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-neutral-100/90 dark:bg-neutral-800/90 rounded-2xl border border-neutral-200/70 dark:border-neutral-700">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-neutral-700'
              }`}
            >
              Barchasi ({gallery.length})
            </button>
            <button
              onClick={() => setFilter('image')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                filter === 'image'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-neutral-700'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Rasmlar</span>
            </button>
            <button
              onClick={() => setFilter('video')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                filter === 'video'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-neutral-700'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Videolar</span>
            </button>
            <button
              onClick={() => setFilter('dars')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === 'dars'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-neutral-700'
              }`}
            >
              Dars Jarayoni
            </button>
            <button
              onClick={() => setFilter('yutuqlar')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === 'yutuqlar'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-neutral-700'
              }`}
            >
              Yutuqlar
            </button>
          </div>
        </div>

        {/* Gallery Grid or Empty State */}
        {filteredItems.length === 0 ? (
          <div className="bg-neutral-50 dark:bg-neutral-900/60 rounded-3xl p-8 sm:p-12 text-center border border-neutral-200/80 dark:border-neutral-800 max-w-xl mx-auto my-4">
            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-2 font-heading">
              Galereya Yangilanmoqda
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6">
              O'quv markazimizning dars jarayonlari, yutuqlari va tadbirlaridan olingan yangi foto hamda videolar tez kunda yuklanadi.
            </p>
            <a
              href="#qabul"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all"
            >
              <span>Qabulga Yozilish</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => setActiveMedia(item)}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 aspect-square shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer border border-neutral-200/60 dark:border-neutral-800"
                id={`gallery-item-${item.id}`}
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full relative flex items-center justify-center">
                    <video
                      src={item.url}
                      className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 ml-0.5" fill="white" />
                      </div>
                    </div>
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      <span>Video</span>
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-full relative">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
                      <ImageIcon className="w-3 h-3 text-red-400" />
                      <span>Rasm</span>
                    </span>
                  </div>
                )}

                {/* Caption Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
                  <p className="text-xs sm:text-sm font-bold truncate leading-tight">
                    {item.title}
                  </p>
                  {item.date && (
                    <p className="text-[10px] text-neutral-300 flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Calendar className="w-3 h-3 text-red-400" />
                      <span>{item.date}</span>
                    </p>
                  )}
                </div>

                {/* Hover Quick Action */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeMedia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md">
            <div className="relative max-w-4xl w-full flex flex-col items-center">
              
              {/* Close button */}
              <button
                onClick={() => setActiveMedia(null)}
                className="absolute -top-12 right-0 sm:right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Yopish"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Media viewer container */}
              <div className="w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-2xl border border-white/10 max-h-[75vh]">
                {activeMedia.type === 'video' ? (
                  <video
                    src={activeMedia.url}
                    controls
                    autoPlay
                    className="w-full max-h-[75vh] object-contain"
                  />
                ) : (
                  <img
                    src={activeMedia.url}
                    alt={activeMedia.title}
                    className="w-full max-h-[75vh] object-contain"
                  />
                )}
              </div>

              {/* Media Details */}
              <div className="w-full mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white px-2">
                <div>
                  <h3 className="text-lg font-bold">
                    {activeMedia.title}
                  </h3>
                  {activeMedia.description && (
                    <p className="text-xs text-neutral-300 mt-0.5">
                      {activeMedia.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-400">
                  <span className="bg-red-600/30 text-red-300 border border-red-500/30 px-2.5 py-0.5 rounded-full uppercase font-bold text-[10px]">
                    {activeMedia.category}
                  </span>
                  <span>{activeMedia.date}</span>
                </div>
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
