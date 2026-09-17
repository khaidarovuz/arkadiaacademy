import React, { useState } from 'react';
import { 
  Course, 
  NewsItem, 
  GalleryItem, 
  Application, 
  AcademySettings,
  CourseCategory,
  ApplicationStatus,
  BranchLocation
} from '../types';
import { 
  readFileAsDataURL, 
  saveStoredCourses, 
  saveStoredNews, 
  saveStoredGallery, 
  saveStoredApplications, 
  saveStoredSettings,
  clearAllMockData
} from '../services/storage';
import { ArkadiaLogo } from './ArkadiaLogo';
import { 
  Users, 
  BookOpen, 
  Newspaper, 
  Image as ImageIcon, 
  Settings as SettingsIcon, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Check, 
  X, 
  Phone, 
  Send, 
  Download, 
  Tag,
  Search,
  Video,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  MapPin,
  Building2,
  Navigation
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  settings: AcademySettings;
  onUpdateSettings: (settings: AcademySettings) => void;
  courses: Course[];
  onUpdateCourses: (courses: Course[]) => void;
  news: NewsItem[];
  onUpdateNews: (news: NewsItem[]) => void;
  gallery: GalleryItem[];
  onUpdateGallery: (gallery: GalleryItem[]) => void;
  applications: Application[];
  onUpdateApplications: (applications: Application[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  onLogout,
  settings,
  onUpdateSettings,
  courses,
  onUpdateCourses,
  news,
  onUpdateNews,
  gallery,
  onUpdateGallery,
  applications,
  onUpdateApplications,
}) => {
  const [activeTab, setActiveTab] = useState<'applications' | 'courses' | 'news' | 'gallery' | 'branches' | 'settings'>('applications');
  const [notification, setNotification] = useState<string | null>(null);

  // Status Filter for Applications
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState<string>('all');

  // Branch (Manzil & Filiallar) Form State
  const [editingBranch, setEditingBranch] = useState<BranchLocation | null>(null);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [branchForm, setBranchForm] = useState<Partial<BranchLocation>>({
    name: '',
    address: '',
    landmark: '',
    phone: '',
    isMain: false,
  });

  // Course Form State (for creating / editing)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseForm, setCourseForm] = useState<Partial<Course>>({
    category: 'it',
    syllabus: [],
    hasDiscount: true,
  });

  // News Form State
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [newsForm, setNewsForm] = useState<Partial<NewsItem>>({
    mediaType: 'image',
    tags: [],
    author: 'Arkadia Matbuot Xizmati',
  });

  // Media Gallery Upload State
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState<Partial<GalleryItem>>({
    type: 'image',
    category: 'dars',
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<AcademySettings>({ ...settings });

  // Custom in-app Delete Confirmation State (Bypasses iframe alert/confirm issues)
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'course' | 'news' | 'gallery' | 'application' | 'branch' | 'clear_all_gallery' | 'clear_all_courses' | 'clear_all_news' | 'clear_all_applications';
    id: string;
    name: string;
  } | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- Confirm Deletion Handler ---
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'course') {
        const updated = courses.filter((c) => c.id !== deleteTarget.id);
        onUpdateCourses(updated);
        await saveStoredCourses(updated);
        showToast("Kurs muvaffaqiyatli o'chirildi!");
      } else if (deleteTarget.type === 'news') {
        const updated = news.filter((n) => n.id !== deleteTarget.id);
        onUpdateNews(updated);
        await saveStoredNews(updated);
        showToast("Yangilik muvaffaqiyatli o'chirildi!");
      } else if (deleteTarget.type === 'gallery') {
        const updated = gallery.filter((g) => g.id !== deleteTarget.id);
        onUpdateGallery(updated);
        await saveStoredGallery(updated);
        showToast("Media fayl muvaffaqiyatli o'chirildi!");
      } else if (deleteTarget.type === 'application') {
        const updated = applications.filter((a) => a.id !== deleteTarget.id);
        onUpdateApplications(updated);
        await saveStoredApplications(updated);
        showToast("Ariza muvaffaqiyatli o'chirildi!");
      } else if (deleteTarget.type === 'branch') {
        const currentBranches = settingsForm.branches || [];
        const updatedBranches = currentBranches.filter((b) => b.id !== deleteTarget.id);
        const updatedSettings: AcademySettings = {
          ...settingsForm,
          branches: updatedBranches,
          address: updatedBranches.find(b => b.isMain)?.address || updatedBranches[0]?.address || settingsForm.address,
        };
        setSettingsForm(updatedSettings);
        onUpdateSettings(updatedSettings);
        await saveStoredSettings(updatedSettings);
        showToast("Filial manzili muvaffaqiyatli o'chirildi!");
      } else if (deleteTarget.type === 'clear_all_gallery') {
        onUpdateGallery([]);
        await saveStoredGallery([]);
        showToast("Barcha galereya fayllari tozalandi!");
      } else if (deleteTarget.type === 'clear_all_courses') {
        onUpdateCourses([]);
        await saveStoredCourses([]);
        showToast("Barcha kurslar tozalandi!");
      } else if (deleteTarget.type === 'clear_all_news') {
        onUpdateNews([]);
        await saveStoredNews([]);
        showToast("Barcha yangiliklar tozalandi!");
      } else if (deleteTarget.type === 'clear_all_applications') {
        onUpdateApplications([]);
        await saveStoredApplications([]);
        showToast("Barcha arizalar tozalandi!");
      }
    } catch (err) {
      console.error("O'chirishda xatolik:", err);
      showToast("O'chirishda xatolik yuz berdi");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleClearAllCourses = () => {
    setDeleteTarget({
      type: 'clear_all_courses',
      id: 'all',
      name: `Barcha kurslar (${courses.length} ta)`,
    });
  };

  const handleClearAllNews = () => {
    setDeleteTarget({
      type: 'clear_all_news',
      id: 'all',
      name: `Barcha yangiliklar (${news.length} ta)`,
    });
  };

  const handleClearAllGallery = () => {
    setDeleteTarget({
      type: 'clear_all_gallery',
      id: 'all',
      name: `Barcha foto va video materiallar (${gallery.length} ta)`,
    });
  };

  const handleClearAllApplications = () => {
    setDeleteTarget({
      type: 'clear_all_applications',
      id: 'all',
      name: `Barcha arizalar (${applications.length} ta)`,
    });
  };

  // --- Applications CRM Handlers ---
  const handleUpdateAppStatus = async (appId: string, newStatus: ApplicationStatus) => {
    const updated = applications.map((a) => (a.id === appId ? { ...a, status: newStatus } : a));
    onUpdateApplications(updated);
    await saveStoredApplications(updated);
    showToast("Ariza holati muvaffaqiyatli yangilandi");
  };

  const handleDeleteApplication = (appId: string) => {
    const app = applications.find((a) => a.id === appId);
    setDeleteTarget({
      type: 'application',
      id: appId,
      name: app ? `${app.fullName} arizasi` : 'Ariza',
    });
  };

  const handleExportApplicationsCSV = () => {
    const headers = "ID,Ism Familiya,Telefon,Kurs,Bilim darajasi,Qulay vaqt,Holat,Sana\n";
    const rows = applications.map((a) => 
      `"${a.id}","${a.fullName}","${a.phone}","${a.courseName}","${a.knowledgeLevel}","${a.studyTime}","${a.status}","${a.createdAt}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `arkadia_arizalar_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Full System Backup (JSON Export & Import) ---
  const handleExportFullBackup = () => {
    const backupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      academy: 'ARKADIA ACADEMY',
      settings,
      courses,
      news,
      gallery,
      applications,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `arkadia_toliq_baza_zaxira_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("To'liq zaxira nusxa (JSON) muvaffaqiyatli yuklab olindi!");
  };

  const handleImportFullBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error("Noto'g'ri fayl formati");
      }

      if (parsed.settings) {
        onUpdateSettings(parsed.settings);
        await saveStoredSettings(parsed.settings);
      }
      if (Array.isArray(parsed.courses)) {
        onUpdateCourses(parsed.courses);
        await saveStoredCourses(parsed.courses);
      }
      if (Array.isArray(parsed.news)) {
        onUpdateNews(parsed.news);
        await saveStoredNews(parsed.news);
      }
      if (Array.isArray(parsed.gallery)) {
        onUpdateGallery(parsed.gallery);
        await saveStoredGallery(parsed.gallery);
      }
      if (Array.isArray(parsed.applications)) {
        onUpdateApplications(parsed.applications);
        await saveStoredApplications(parsed.applications);
      }

      showToast("Barcha ma'lumotlar zaxiradan to'liq va muvaffaqiyatli tiklandi!");
    } catch (err) {
      console.error("Zaxirani tiklashda xatolik:", err);
      alert("Zaxirani tiklashda xatolik yuz berdi. Fayl to'g'ri JSON formatida ekanligiga ishonch hosil qiling.");
    } finally {
      e.target.value = '';
    }
  };

  // --- Courses Handlers ---
  const handleOpenAddCourse = () => {
    setEditingCourse(null);
    setCourseForm({
      id: `course-${Date.now()}`,
      title: '',
      category: 'languages',
      description: '',
      duration: '4 oy',
      lessonsPerWeek: 'Haftada 3 kun, 2 soatdan',
      mentor: '',
      price: 500000,
      originalPrice: 700000,
      hasDiscount: true,
      discountBadge: '20% AKSIYA',
      syllabus: ['1-modul: Nazariy asoslar', '2-modul: Amaliy mashg\'ulotlar', '3-modul: Natija va imtihon'],
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    });
    setIsCourseModalOpen(true);
  };

  const handleOpenEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({ ...course });
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title || !courseForm.price) {
      showToast("Iltimos, kurs nomi va narxini to'ldiring");
      return;
    }

    const fullCourse: Course = {
      id: editingCourse ? editingCourse.id : `course-${Date.now()}`,
      title: courseForm.title || '',
      category: (courseForm.category as CourseCategory) || 'languages',
      description: courseForm.description || '',
      duration: courseForm.duration || '3 oy',
      lessonsPerWeek: courseForm.lessonsPerWeek || 'Haftada 3 kun',
      mentor: courseForm.mentor || "Arkadia Mutaxassisi",
      price: Number(courseForm.price) || 500000,
      originalPrice: courseForm.originalPrice ? Number(courseForm.originalPrice) : undefined,
      hasDiscount: Boolean(courseForm.hasDiscount),
      discountBadge: courseForm.discountBadge || '',
      syllabus: courseForm.syllabus && courseForm.syllabus.length > 0 ? courseForm.syllabus : ['Asosiy dastur'],
      image: courseForm.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      seatsLeft: courseForm.seatsLeft ? Number(courseForm.seatsLeft) : undefined,
    };

    let updated: Course[];
    if (editingCourse) {
      updated = courses.map((c) => (c.id === editingCourse.id ? fullCourse : c));
    } else {
      updated = [fullCourse, ...courses];
    }

    onUpdateCourses(updated);
    await saveStoredCourses(updated);
    setIsCourseModalOpen(false);
    showToast("Kurs ma'lumotlari muvaffaqiyatli saqlandi!");
  };

  const handleDeleteCourse = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    setDeleteTarget({
      type: 'course',
      id: courseId,
      name: course ? course.title : 'Ushbu kurs',
    });
  };

  // Real Image Upload (reads file into base64 Data URL)
  const handleCourseImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataURL(file);
        setCourseForm((prev) => ({ ...prev, image: dataUrl }));
        showToast("Rasm muvaffaqiyatli yuklandi!");
      } catch (err) {
        alert("Rasmni o'qishda xatolik yuz berdi: " + err);
      }
    }
  };

  // --- News Handlers ---
  const handleOpenAddNews = () => {
    setEditingNews(null);
    setNewsForm({
      id: `news-${Date.now()}`,
      title: '',
      date: new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' }),
      category: "Yangilik",
      excerpt: '',
      content: '',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
      author: 'Arkadia Matbuot Xizmati',
      tags: ['Arkadia', 'Yangiliklar'],
    });
    setIsNewsModalOpen(true);
  };

  const handleOpenEditNews = (item: NewsItem) => {
    setEditingNews(item);
    setNewsForm({ ...item });
    setIsNewsModalOpen(true);
  };

  const handleNewsMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const isVideo = file.type.startsWith('video/');
        const dataUrl = await readFileAsDataURL(file);
        setNewsForm((prev) => ({
          ...prev,
          mediaType: isVideo ? 'video' : 'image',
          mediaUrl: dataUrl,
        }));
        showToast(isVideo ? "Video muvaffaqiyatli yuklandi!" : "Rasm muvaffaqiyatli yuklandi!");
      } catch (err) {
        showToast("Faylni yuklashda xatolik yuz berdi");
      }
    }
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.content) {
      showToast("Iltimos, yangilik sarlavhasi va matnini kiriting");
      return;
    }

    const fullNews: NewsItem = {
      id: editingNews ? editingNews.id : `news-${Date.now()}`,
      title: newsForm.title || '',
      date: newsForm.date || new Date().toLocaleDateString('uz-UZ'),
      category: newsForm.category || "E'lon",
      excerpt: newsForm.excerpt || (newsForm.content ? newsForm.content.slice(0, 100) + '...' : ''),
      content: newsForm.content || '',
      mediaType: newsForm.mediaType || 'image',
      mediaUrl: newsForm.mediaUrl || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
      author: newsForm.author || 'Arkadia Matbuot Xizmati',
      tags: newsForm.tags && newsForm.tags.length > 0 ? newsForm.tags : ['Arkadia'],
      likes: newsForm.likes || 15,
    };

    let updated: NewsItem[];
    if (editingNews) {
      updated = news.map((n) => (n.id === editingNews.id ? fullNews : n));
    } else {
      updated = [fullNews, ...news];
    }

    onUpdateNews(updated);
    await saveStoredNews(updated);
    setIsNewsModalOpen(false);
    showToast("Yangilik muvaffaqiyatli saqlandi!");
  };

  const handleDeleteNews = (newsId: string) => {
    const item = news.find((n) => n.id === newsId);
    setDeleteTarget({
      type: 'news',
      id: newsId,
      name: item ? item.title : 'Ushbu yangilik',
    });
  };

  // --- Gallery Handlers (Real Photos & Videos) ---
  const handleOpenAddGallery = () => {
    setGalleryForm({
      id: `gal-${Date.now()}`,
      title: '',
      type: 'image',
      category: 'dars',
      date: new Date().toISOString().slice(0, 10),
      description: '',
      url: '',
    });
    setIsGalleryModalOpen(true);
  };

  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const isVideo = file.type.startsWith('video/');
        const dataUrl = await readFileAsDataURL(file);
        setGalleryForm((prev) => ({
          ...prev,
          type: isVideo ? 'video' : 'image',
          url: dataUrl,
          title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
        }));
        showToast(isVideo ? "Video yuklandi!" : "Rasm yuklandi!");
      } catch (err) {
        showToast("Faylni yuklashda xatolik yuz berdi");
      }
    }
  };

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.url) {
      showToast("Iltimos, rasm yoki video faylini tanlang!");
      return;
    }

    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: galleryForm.title || "Arkadia Academy",
      type: galleryForm.type || 'image',
      url: galleryForm.url,
      category: (galleryForm.category as 'dars' | 'tadbirlar' | 'yutuqlar' | 'markaz') || 'dars',
      date: galleryForm.date || new Date().toISOString().slice(0, 10),
      description: galleryForm.description || '',
    };

    const updated = [newItem, ...gallery];
    onUpdateGallery(updated);
    await saveStoredGallery(updated);
    setIsGalleryModalOpen(false);
    showToast("Galereyaga muvaffaqiyatli qo'shildi!");
  };

  const handleDeleteGallery = (galId: string) => {
    const item = gallery.find((g) => g.id === galId);
    setDeleteTarget({
      type: 'gallery',
      id: galId,
      name: item ? item.title : 'Ushbu media fayl',
    });
  };

  // --- Branch (Manzillar & Filiallar) Handlers ---
  const handleOpenAddBranch = () => {
    setEditingBranch(null);
    setBranchForm({
      id: `branch-${Date.now()}`,
      name: '',
      address: '',
      landmark: '',
      phone: settingsForm.phone,
      isMain: (settingsForm.branches?.length || 0) === 0,
    });
    setIsBranchModalOpen(true);
  };

  const handleOpenEditBranch = (branch: BranchLocation) => {
    setEditingBranch(branch);
    setBranchForm({ ...branch });
    setIsBranchModalOpen(true);
  };

  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchForm.name || !branchForm.address) {
      showToast("Iltimos, filial nomi va manzilini kiriting!");
      return;
    }

    const currentBranches = settingsForm.branches || [];
    let updatedBranches: BranchLocation[];

    if (editingBranch) {
      updatedBranches = currentBranches.map((b) => {
        if (b.id === editingBranch.id) {
          return {
            ...b,
            name: branchForm.name || b.name,
            address: branchForm.address || b.address,
            landmark: branchForm.landmark || '',
            phone: branchForm.phone || '',
            isMain: Boolean(branchForm.isMain),
          };
        }
        if (branchForm.isMain) {
          return { ...b, isMain: false };
        }
        return b;
      });
    } else {
      const newBranch: BranchLocation = {
        id: `branch-${Date.now()}`,
        name: branchForm.name || 'Yangi Filial',
        address: branchForm.address || '',
        landmark: branchForm.landmark || '',
        phone: branchForm.phone || settingsForm.phone,
        isMain: Boolean(branchForm.isMain || currentBranches.length === 0),
      };

      if (newBranch.isMain) {
        updatedBranches = currentBranches.map((b) => ({ ...b, isMain: false }));
        updatedBranches.push(newBranch);
      } else {
        updatedBranches = [...currentBranches, newBranch];
      }
    }

    const updatedSettings: AcademySettings = {
      ...settingsForm,
      branches: updatedBranches,
      address: updatedBranches.find(b => b.isMain)?.address || updatedBranches[0]?.address || settingsForm.address,
    };

    setSettingsForm(updatedSettings);
    onUpdateSettings(updatedSettings);
    await saveStoredSettings(updatedSettings);
    setIsBranchModalOpen(false);
    showToast("Filial manzili muvaffaqiyatli saqlandi!");
  };

  const handleDeleteBranch = (branch: BranchLocation) => {
    setDeleteTarget({
      type: 'branch',
      id: branch.id,
      name: branch.name,
    });
  };

  // --- Settings Handlers ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(settingsForm);
    await saveStoredSettings(settingsForm);
    showToast("Akademiya sozlamalari muvaffaqiyatli saqlandi!");
  };

  const handleCustomLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataURL(file);
        setSettingsForm((prev) => ({ ...prev, customLogoUrl: dataUrl }));
        showToast("Yangi logotip yuklandi!");
      } catch (err) {
        alert("Logotipni yuklashda xatolik: " + err);
      }
    }
  };

  // Filtered Applications for CRM Table
  const filteredApps = applications.filter((app) => {
    const matchQuery = 
      app.fullName.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.phone.includes(appSearch) ||
      app.courseName.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.id.toLowerCase().includes(appSearch.toLowerCase());
    const matchStatus = appStatusFilter === 'all' || app.status === appStatusFilter;
    return matchQuery && matchStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex bg-neutral-950/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-60 px-4 py-3 rounded-2xl bg-neutral-900 border border-emerald-500 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Panel Window */}
      <div className="w-full h-full flex flex-col bg-[#faf9f9] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-4">
            <ArkadiaLogo variant="horizontal" size="sm" customLogoUrl={settings.customLogoUrl} />
            <div className="h-5 w-px bg-neutral-200 dark:bg-neutral-700 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-[11px] font-black uppercase tracking-wider">
                Boshqaruv Paneli
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Sayt ko'rinishiga qaytish"
            >
              Saytni Ko'rish
            </button>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 text-xs font-bold transition-colors cursor-pointer"
              title="Chiqish"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chiqish</span>
            </button>
          </div>
        </header>

        {/* Workspace Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Mobile Horizontal Navigation Tabs */}
          <div className="md:hidden flex items-center overflow-x-auto gap-2 p-2.5 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
            <button
              onClick={() => setActiveTab('applications')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'applications'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Arizalar ({applications.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'courses'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Kurslar ({courses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'news'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>Yangiliklar ({news.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'gallery'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Galereya ({gallery.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('branches')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'branches'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Filiallar ({settingsForm.branches?.length || 1})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'settings'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800'
              }`}
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>Sozlamalar</span>
            </button>
          </div>

          {/* Desktop Left Navigation Sidebar */}
          <aside className="hidden md:flex md:w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex-col justify-between shrink-0 p-4">
            <div className="space-y-1.5">
              
              {/* Tab 1: Applications */}
              <button
                onClick={() => setActiveTab('applications')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'applications'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-red-50 dark:hover:bg-neutral-800 hover:text-red-700 dark:hover:text-red-400'
                }`}
                id="admin-tab-applications"
              >
                <div className="relative">
                  <Users className="w-5 h-5 shrink-0" />
                  {applications.filter(a => a.status === 'Yangi').length > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white dark:ring-neutral-900" />
                  )}
                </div>
                <span className="truncate">Arizalar (Qabul)</span>
                <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'applications' ? 'bg-red-700 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                }`}>
                  {applications.length}
                </span>
              </button>

              {/* Tab 2: Courses */}
              <button
                onClick={() => setActiveTab('courses')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'courses'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-red-50 dark:hover:bg-neutral-800 hover:text-red-700 dark:hover:text-red-400'
                }`}
                id="admin-tab-courses"
              >
                <BookOpen className="w-5 h-5 shrink-0" />
                <span className="truncate">Kurslar & Narxlar</span>
                <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'courses' ? 'bg-red-700 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                }`}>
                  {courses.length}
                </span>
              </button>

              {/* Tab 3: News */}
              <button
                onClick={() => setActiveTab('news')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'news'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-red-50 dark:hover:bg-neutral-800 hover:text-red-700 dark:hover:text-red-400'
                }`}
                id="admin-tab-news"
              >
                <Newspaper className="w-5 h-5 shrink-0" />
                <span className="truncate">Yangiliklar & Tadbirlar</span>
                <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'news' ? 'bg-red-700 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                }`}>
                  {news.length}
                </span>
              </button>

              {/* Tab 4: Gallery */}
              <button
                onClick={() => setActiveTab('gallery')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'gallery'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-red-50 dark:hover:bg-neutral-800 hover:text-red-700 dark:hover:text-red-400'
                }`}
                id="admin-tab-gallery"
              >
                <ImageIcon className="w-5 h-5 shrink-0" />
                <span className="truncate">Foto & Video Galereya</span>
                <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'gallery' ? 'bg-red-700 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                }`}>
                  {gallery.length}
                </span>
              </button>

              {/* Tab 5: Branches & Addresses */}
              <button
                onClick={() => setActiveTab('branches')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'branches'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-red-50 dark:hover:bg-neutral-800 hover:text-red-700 dark:hover:text-red-400'
                }`}
                id="admin-tab-branches"
              >
                <Building2 className="w-5 h-5 shrink-0" />
                <span className="truncate">Filiallar & Manzillar</span>
                <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'branches' ? 'bg-red-700 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                }`}>
                  {settingsForm.branches?.length || 1}
                </span>
              </button>

              {/* Tab 6: Settings */}
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-red-50 dark:hover:bg-neutral-800 hover:text-red-700 dark:hover:text-red-400'
                }`}
                id="admin-tab-settings"
              >
                <SettingsIcon className="w-5 h-5 shrink-0" />
                <span className="truncate">Sozlamalar & Aloqa</span>
              </button>
            </div>

            {/* Sidebar bottom indicator */}
            <div className="p-3 bg-red-50/60 dark:bg-neutral-800/80 rounded-2xl border border-red-100 dark:border-neutral-700 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="font-bold text-red-700 dark:text-red-400 flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Jonli Sinxronizatsiya</span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
                Kiritilgan barcha o'zgarishlar darhol saytda aks etadi.
              </p>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-neutral-50/50 dark:bg-neutral-950">
            
            {/* TAB 1: APPLICATIONS CRM */}
            {activeTab === 'applications' && (
              <div className="max-w-6xl mx-auto space-y-6">
                
                {/* CRM Controls Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-neutral-900 dark:text-white font-heading">
                      Qabul Qilingan Arizalar ({applications.length})
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Sayt orqali yozilgan barcha o'quvchilar arizalari va kontaktlari
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {applications.length > 0 && (
                      <button
                        onClick={handleClearAllApplications}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 text-xs font-bold transition-all cursor-pointer"
                        title="Barcha arizalarni tozalash"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Barchasini Tozalash</span>
                      </button>
                    )}
                    <button
                      onClick={handleExportApplicationsCSV}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-2xs cursor-pointer"
                      title="CSV formatida yuklab olish"
                    >
                      <Download className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                      <span>Excel (CSV) Yuklash</span>
                    </button>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Ism, telefon yoki kurs nomi..."
                      value={appSearch}
                      onChange={(e) => setAppSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                    {['all', 'Yangi', 'Bog\'lanildi', 'Qabul qilindi', 'Bekor qilindi'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setAppStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                          appStatusFilter === st
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        }`}
                      >
                        {st === 'all' ? 'Barchasi' : st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Applications: Desktop Table & Mobile Card List */}
                <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
                  
                  {/* Mobile Cards (Visible on screens smaller than md) */}
                  <div className="md:hidden divide-y divide-neutral-100 dark:divide-neutral-800">
                    {filteredApps.length === 0 ? (
                      <div className="py-8 text-center text-neutral-400 dark:text-neutral-500 text-xs">
                        Hech qanday ariza topilmadi
                      </div>
                    ) : (
                      filteredApps.map((app) => (
                        <div key={app.id} className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400">{app.id}</span>
                            <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{app.createdAt}</span>
                          </div>

                          <div>
                            <h4 className="font-bold text-neutral-900 dark:text-white text-base leading-snug">{app.fullName}</h4>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 font-medium">
                              Kurs: <span className="font-bold text-neutral-900 dark:text-white">{app.courseName}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/50">
                                <span>{app.studyTime === 'Ertalab' ? '🌅 Ertalab' : app.studyTime === 'Tushda' ? '☀️ Tushda' : '🌙 Kechga'}</span>
                              </span>
                              <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                                {app.knowledgeLevel}
                              </span>
                            </div>
                            {app.message && (
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 italic mt-2 bg-neutral-50 dark:bg-neutral-850 p-2 rounded-lg">
                                "{app.message}"
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-1 gap-2">
                            <select
                              value={app.status}
                              onChange={(e) => handleUpdateAppStatus(app.id, e.target.value as ApplicationStatus)}
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border focus:outline-none flex-1 ${
                                app.status === 'Yangi'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                                  : app.status === 'Bog\'lanildi'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                                  : app.status === 'Qabul qilindi'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                                  : 'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700'
                              }`}
                            >
                              <option value="Yangi">Yangi</option>
                              <option value="Bog'lanildi">Bog'lanildi</option>
                              <option value="Qabul qilindi">Qabul qilindi</option>
                              <option value="To'lov qilindi">To'lov qilindi</option>
                              <option value="Bekor qilindi">Bekor qilindi</option>
                            </select>

                            <a
                              href={`tel:${app.phone.replace(/[^\d+]/g, '')}`}
                              className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-red-600"
                              title="Qo'ng'iroq qilish"
                            >
                              <Phone className="w-4 h-4" />
                            </a>

                            <a
                              href={`https://t.me/${app.phone.replace(/[^\d]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                              title="Telegram orqali yozish"
                            >
                              <Send className="w-4 h-4" />
                            </a>

                            <button
                              onClick={() => handleDeleteApplication(app.id)}
                              className="p-2 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 cursor-pointer"
                              title="Arizani o'chirish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Desktop Table (Visible on md and up) */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-300">
                      <thead className="bg-neutral-50 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-bold">
                        <tr>
                          <th className="py-3.5 px-4">ID & Sana</th>
                          <th className="py-3.5 px-4">O'quvchi F.I.SH</th>
                          <th className="py-3.5 px-4">Telefon</th>
                          <th className="py-3.5 px-4">Kurs & Vaqt</th>
                          <th className="py-3.5 px-4">Holat</th>
                          <th className="py-3.5 px-4 text-right">Amallar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {filteredApps.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-neutral-400 dark:text-neutral-500">
                              Hech qanday ariza topilmadi
                            </td>
                          </tr>
                        ) : (
                          filteredApps.map((app) => (
                            <tr key={app.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                              <td className="py-4 px-4 whitespace-nowrap">
                                <span className="font-mono font-bold text-neutral-900 dark:text-white">{app.id}</span>
                                <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">{app.createdAt}</div>
                              </td>

                              <td className="py-4 px-4">
                                <div className="font-bold text-neutral-900 dark:text-white text-sm">{app.fullName}</div>
                                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                                  Daraja: {app.knowledgeLevel}
                                </div>
                                {app.message && (
                                  <div className="text-[11px] text-neutral-400 dark:text-neutral-500 italic mt-0.5 line-clamp-1">
                                    "{app.message}"
                                  </div>
                                )}
                              </td>

                              <td className="py-4 px-4 whitespace-nowrap">
                                <a
                                  href={`tel:${app.phone.replace(/[^\d+]/g, '')}`}
                                  className="font-mono font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>{app.phone}</span>
                                </a>
                              </td>

                              <td className="py-4 px-4">
                                <div className="font-semibold text-neutral-800 dark:text-neutral-200">{app.courseName}</div>
                                <div className="mt-1">
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/50 dark:border-amber-900/50">
                                    {app.studyTime === 'Ertalab' ? '🌅 Ertalab' : app.studyTime === 'Tushda' ? '☀️ Tushda' : '🌙 Kechga'}
                                  </span>
                                </div>
                              </td>

                              <td className="py-4 px-4 whitespace-nowrap">
                                <select
                                  value={app.status}
                                  onChange={(e) => handleUpdateAppStatus(app.id, e.target.value as ApplicationStatus)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none ${
                                    app.status === 'Yangi'
                                      ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                                      : app.status === 'Bog\'lanildi'
                                      ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                                      : app.status === 'Qabul qilindi'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                                      : 'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700'
                                  }`}
                                >
                                  <option value="Yangi">Yangi</option>
                                  <option value="Bog'lanildi">Bog'lanildi</option>
                                  <option value="Qabul qilindi">Qabul qilindi</option>
                                  <option value="To'lov qilindi">To'lov qilindi</option>
                                  <option value="Bekor qilindi">Bekor qilindi</option>
                                </select>
                              </td>

                              <td className="py-4 px-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  <a
                                    href={`https://t.me/${app.phone.replace(/[^\d]/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                                    title="Telegram orqali yozish"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                  </a>
                                  <button
                                    onClick={() => handleDeleteApplication(app.id)}
                                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors cursor-pointer"
                                    title="Arizani o'chirish"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: COURSES MANAGEMENT */}
            {activeTab === 'courses' && (
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white font-heading">
                      Kurslar Boshqaruvi ({courses.length})
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Kurslarni tahrirlash, narxlar va aksiyalar belgilash, yangi yo'nalishlar qo'shish
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {courses.length > 0 && (
                      <button
                        onClick={handleClearAllCourses}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 text-xs font-bold transition-all cursor-pointer"
                        title="Barcha kurslarni tozalash"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Barchasini Tozalash</span>
                      </button>
                    )}
                    <button
                      onClick={handleOpenAddCourse}
                      className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all cursor-pointer"
                      id="admin-add-course-btn"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Yangi Kurs Qo'shish</span>
                    </button>
                  </div>
                </div>

                {/* Empty state when no courses exist */}
                {courses.length === 0 ? (
                  <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 sm:p-12 text-center border border-neutral-200 dark:border-neutral-800">
                    <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Hozircha kurslar mavjud emas</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6 leading-relaxed">
                      Barcha soxta kurslar olib tashlandi. Markazingizning haqiqiy o'quv dasturlarini kiritish uchun quyidagi tugmani bosing.
                    </p>
                    <button
                      onClick={handleOpenAddCourse}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Birinchi Kursni Qo'shish</span>
                    </button>
                  </div>
                ) : (
                  /* Courses Grid */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative bg-neutral-950/5 dark:bg-neutral-950 flex items-center justify-center overflow-hidden border-b border-neutral-100 dark:border-neutral-800">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-auto max-h-52 object-contain block"
                          />
                          {course.hasDiscount && (
                            <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                              {course.discountBadge || 'AKSIYA'}
                            </span>
                          )}
                          <span className="absolute top-3 right-3 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                            {course.duration || '3 oy'}
                          </span>
                        </div>

                        <div className="p-5">
                          <span className="text-[10px] uppercase font-bold text-red-600 dark:text-red-400">
                            {course.category}
                          </span>
                          <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-1 leading-tight">
                            {course.title}
                          </h3>
                          {course.description && (
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-2">
                              {course.description}
                            </p>
                          )}

                          {/* Davomiyligi va Darslar jadvali */}
                          <div className="mt-3 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 text-[11px] space-y-1.5">
                            <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
                              <span className="font-semibold text-neutral-500">Davomiyligi:</span>
                              <span className="font-bold text-neutral-900 dark:text-white">{course.duration || '3 oy'}</span>
                            </div>
                            <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
                              <span className="font-semibold text-neutral-500">Darslar:</span>
                              <span className="font-bold text-neutral-900 dark:text-white">{course.lessonsPerWeek || 'Haftada 3 kun'}</span>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-baseline justify-between">
                            <div>
                              <div className="text-[10px] text-neutral-400 dark:text-neutral-500">Oylik to'lov:</div>
                              <span className="text-sm font-black text-red-600 dark:text-red-400">
                                {course.price.toLocaleString()} so'm
                              </span>
                            </div>
                            {course.originalPrice && (
                              <span className="text-xs text-neutral-400 dark:text-neutral-500 line-through">
                                {course.originalPrice.toLocaleString()} so'm
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-neutral-50 dark:bg-neutral-850 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate max-w-[150px]">
                          Mentor: {course.mentor}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditCourse(course)}
                            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                            title="Tahrirlash"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                            title="O'chirish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>
            )}

            {/* TAB 3: NEWS MANAGEMENT */}
            {activeTab === 'news' && (
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white font-heading">
                      Yangiliklar & Tadbirlar Boshqaruvi ({news.length})
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      E'lonlar, masterclasslar, ochiq eshiklar kuni va video xabarlar joylash
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {news.length > 0 && (
                      <button
                        onClick={handleClearAllNews}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 text-xs font-bold transition-all cursor-pointer"
                        title="Barcha yangiliklarni tozalash"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Barchasini Tozalash</span>
                      </button>
                    )}
                    <button
                      onClick={handleOpenAddNews}
                      className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all cursor-pointer"
                      id="admin-add-news-btn"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Yangi Xabar Qo'shish</span>
                    </button>
                  </div>
                </div>

                {news.length === 0 ? (
                  <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 sm:p-12 text-center border border-neutral-200 dark:border-neutral-800">
                    <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
                      <Newspaper className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Hozircha yangiliklar mavjud emas</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6 leading-relaxed">
                      Markaz faoliyati, yangi guruhlar ochilishi yoki tadbirlar haqida xabar qo'shishingiz mumkin.
                    </p>
                    <button
                      onClick={handleOpenAddNews}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Birinchi Yangilikni Qo'shish</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-44 bg-neutral-900 overflow-hidden">
                          {item.mediaType === 'video' ? (
                            <div className="w-full h-full flex items-center justify-center relative">
                              <video src={item.mediaUrl} className="w-full h-full object-cover opacity-70" />
                              <span className="absolute bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md top-3 left-3">
                                Video
                              </span>
                            </div>
                          ) : (
                            <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                          )}
                          <span className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                            {item.category}
                          </span>
                        </div>

                        <div className="p-5">
                          <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">
                            {item.date} • {item.author}
                          </span>
                          <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-1 leading-snug line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-2">
                            {item.excerpt || item.content}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-neutral-50 dark:bg-neutral-850 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                        <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                          {item.tags.join(', ')}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditNews(item)}
                            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                            title="Tahrirlash"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteNews(item.id)}
                            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                            title="O'chirish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>
            )}

            {/* TAB 4: REAL PHOTO & VIDEO GALLERY */}
            {activeTab === 'gallery' && (
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white font-heading">
                      Haqiqiy Foto va Video Galereya ({gallery.length})
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Fayllarni to'g'ridan-to'g'ri kompyuter yoki telefondan yuklang (tashqi link kerak emas!)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {gallery.length > 0 && (
                      <button
                        onClick={handleClearAllGallery}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 text-xs font-bold transition-all cursor-pointer"
                        title="Barcha galereyani tozalash"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Barchasini Tozalash</span>
                      </button>
                    )}
                    <button
                      onClick={handleOpenAddGallery}
                      className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all cursor-pointer"
                      id="admin-add-gallery-btn"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Rasm / Video Yuklash</span>
                    </button>
                  </div>
                </div>

                {gallery.length === 0 ? (
                  <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 sm:p-12 text-center border border-neutral-200 dark:border-neutral-800">
                    <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Galereyada fayllar mavjud emas</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6 leading-relaxed">
                      Sinf xonalari, tadbirlar yoki dars jarayonidan haqiqiy foto va videolarni yuklang.
                    </p>
                    <button
                      onClick={handleOpenAddGallery}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Fayl Yuklash</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {gallery.map((item) => (
                    <div
                      key={item.id}
                      className="group bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs relative aspect-square"
                    >
                      {item.type === 'video' ? (
                        <video src={item.url} className="w-full h-full object-cover" />
                      ) : (
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold uppercase bg-red-600 px-2 py-0.5 rounded-md">
                            {item.type}
                          </span>
                          <button
                            onClick={() => handleDeleteGallery(item.id)}
                            className="p-1.5 rounded-lg bg-black/60 hover:bg-red-600 text-white transition-colors cursor-pointer"
                            title="O'chirish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div>
                          <p className="text-xs font-bold truncate">{item.title}</p>
                          <span className="text-[10px] text-neutral-300">{item.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>
            )}

            {/* TAB 5: BRANCHES & ADDRESSES MANAGEMENT */}
            {activeTab === 'branches' && (
              <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black font-heading text-neutral-900 dark:text-white flex items-center gap-2">
                      <Building2 className="w-6 h-6 text-red-600" />
                      <span>Arkadia Academy Filiallari & Manzillari</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      O'quv markazining bir yoki bir nechta manzil / filiallarini kiriting. Saytning "Aloqa" va "Footer" bo'limlarida avtomatik chiqadi.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddBranch}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all cursor-pointer shrink-0"
                    id="admin-add-branch-btn"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Yangi Manzil / Filial Qo'shish</span>
                  </button>
                </div>

                {/* Branches List Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {(settingsForm.branches && settingsForm.branches.length > 0 ? settingsForm.branches : [
                    {
                      id: 'def-1',
                      name: 'Bosh Bino (Filial 1)',
                      address: settingsForm.address,
                      landmark: "Metro bekati yaqinida",
                      phone: settingsForm.phone,
                      isMain: true,
                    }
                  ]).map((branch, idx) => (
                    <div
                      key={branch.id || `branch-${idx}`}
                      className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-xs relative flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                              <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-base font-extrabold text-neutral-900 dark:text-white">
                                  {branch.name}
                                </h4>
                                {branch.isMain && (
                                  <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 text-[10px] font-black uppercase tracking-wider">
                                    Asosiy
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-neutral-400">
                                {idx + 1}-manzil
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditBranch(branch)}
                              className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
                              title="Tahrirlash"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBranch(branch)}
                              className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                              title="O'chirish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2 mt-4 text-xs">
                          <div>
                            <span className="text-neutral-400 uppercase font-bold text-[10px] block mb-0.5">Aniq Manzil:</span>
                            <p className="text-neutral-800 dark:text-neutral-200 font-medium leading-relaxed">
                              {branch.address}
                            </p>
                          </div>

                          {branch.landmark && (
                            <div>
                              <span className="text-neutral-400 uppercase font-bold text-[10px] block mb-0.5">Mo'ljal:</span>
                              <p className="text-red-600 dark:text-red-400 font-semibold">
                                {branch.landmark}
                              </p>
                            </div>
                          )}

                          {branch.phone && (
                            <div>
                              <span className="text-neutral-400 uppercase font-bold text-[10px] block mb-0.5">Filial Telefoni:</span>
                              <p className="text-neutral-700 dark:text-neutral-300 font-mono font-bold">
                                {branch.phone}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                        <a
                          href={`https://yandex.uz/maps/?text=${encodeURIComponent('Arkadia Academy ' + branch.address)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-red-600 dark:text-red-400 hover:underline"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Xaritada ochish</span>
                        </a>

                        <button
                          onClick={() => handleOpenEditBranch(branch)}
                          className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white cursor-pointer"
                        >
                          Tahrirlash →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: SETTINGS & CONTACTS */}
            {activeTab === 'settings' && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-neutral-900 dark:text-white font-heading">
                    Akademiya Sozlamalari & Kontaktlar
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Telefon raqamlari, Telegram va Instagram kanallari, manzil va bosh sahifa e'lonlari
                  </p>
                </div>

                <form onSubmit={handleSaveSettings} className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6">
                  
                  {/* Branding / Logo */}
                  <div className="border-b border-neutral-100 dark:border-neutral-800 pb-6">
                    <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-2">
                      Akademiya Logotipi
                    </label>
                    <div className="flex items-center gap-6">
                      <ArkadiaLogo variant="horizontal" size="md" customLogoUrl={settingsForm.customLogoUrl} />
                      <div>
                        <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-red-500 dark:hover:border-red-500 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 cursor-pointer transition-colors bg-white dark:bg-neutral-800">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Yangi logotip yuklash</span>
                          <input type="file" accept="image/*" onChange={handleCustomLogoUpload} className="hidden" />
                        </label>
                        {settingsForm.customLogoUrl && (
                          <button
                            type="button"
                            onClick={() => setSettingsForm((p) => ({ ...p, customLogoUrl: undefined }))}
                            className="block text-[11px] text-red-600 dark:text-red-400 hover:underline mt-1 cursor-pointer"
                          >
                            Standart vektor logotipga qaytarish
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Top Announcement Bar */}
                  <div className="border-b border-neutral-100 dark:border-neutral-800 pb-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                        Eng yuqoridagi E'lon / Aksiya Bari
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                        <input
                          type="checkbox"
                          checked={settingsForm.showAnnouncement}
                          onChange={(e) => setSettingsForm((p) => ({ ...p, showAnnouncement: e.target.checked }))}
                          className="rounded text-red-600 focus:ring-red-500"
                        />
                        <span>Barni ko'rsatish</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={settingsForm.announcementText}
                      onChange={(e) => setSettingsForm((p) => ({ ...p, announcementText: e.target.value }))}
                      placeholder="Masalan: 🔥 Yangi 2025-yilgi qabul boshlandi! 20% chegirma..."
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:border-red-600 outline-none"
                    />
                  </div>

                  {/* Phone numbers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-2">
                        Asosiy Telefon Raqam *
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm((p) => ({ ...p, phone: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:border-red-600 outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-2">
                        Qo'shimcha Telefon Raqam
                      </label>
                      <input
                        type="text"
                        value={settingsForm.phoneSecondary}
                        onChange={(e) => setSettingsForm((p) => ({ ...p, phoneSecondary: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:border-red-600 outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Social Networks (Telegram & Instagram) */}
                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 pb-2">
                      <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                        Ijtimoiy Tarmoqlar (Telegram & Instagram)
                      </h4>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Barcha bo'limlar va tugmalarda avtomatik yangilanadi
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                            Telegram Kanal / Guruh (@user) *
                          </label>
                          {settingsForm.telegramUrl && (
                            <a
                              href={settingsForm.telegramUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                            >
                              <span>Tekshirish</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">@</span>
                          <input
                            type="text"
                            required
                            value={settingsForm.telegramUsername?.replace(/^@/, '') || ''}
                            onChange={(e) => {
                              const raw = e.target.value.trim().replace(/^@/, '');
                              setSettingsForm((p) => ({ 
                                ...p, 
                                telegramUsername: raw ? `@${raw}` : '',
                                telegramUrl: raw ? `https://t.me/${raw}` : ''
                              }));
                            }}
                            placeholder="arkadia_academy"
                            className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:border-red-600 outline-none font-mono"
                          />
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-1 truncate">
                          Havola: <span className="text-blue-600 dark:text-blue-400 font-mono">{settingsForm.telegramUrl}</span>
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                            Instagram Sahifa (username) *
                          </label>
                          {settingsForm.instagramUrl && (
                            <a
                              href={settingsForm.instagramUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] font-bold text-pink-600 dark:text-pink-400 hover:underline inline-flex items-center gap-1"
                            >
                              <span>Tekshirish</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">@</span>
                          <input
                            type="text"
                            required
                            value={settingsForm.instagramUsername?.replace(/^@/, '') || ''}
                            onChange={(e) => {
                              const raw = e.target.value.trim().replace(/^@/, '');
                              setSettingsForm((p) => ({ 
                                ...p, 
                                instagramUsername: raw,
                                instagramUrl: raw ? `https://instagram.com/${raw}` : ''
                              }));
                            }}
                            placeholder="arkadia_academy"
                            className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:border-red-600 outline-none font-mono"
                          />
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-1 truncate">
                          Havola: <span className="text-pink-600 dark:text-pink-400 font-mono">{settingsForm.instagramUrl}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Physical Address & Multiple Branches */}
                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 pb-2">
                      <div>
                        <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-red-600" />
                          <span>Arkadia Filiallari & Manzillari ({settingsForm.branches?.length || 1})</span>
                        </h4>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          Bir nechta filial yoki o'quv binolarini boshqarish
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenAddBranch}
                        className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Yana Manzil Qo'shish</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(settingsForm.branches || []).map((b, i) => (
                        <div
                          key={b.id || i}
                          className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-750 text-xs"
                        >
                          <div className="min-w-0 pr-3">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-neutral-900 dark:text-white truncate">
                                {b.name}
                              </span>
                              {b.isMain && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 uppercase">
                                  Asosiy
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                              {b.address}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenEditBranch(b)}
                              className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                              title="Tahrirlash"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBranch(b)}
                              className="p-1.5 text-neutral-400 hover:text-red-600"
                              title="O'chirish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1">
                        Bosh Bino Standart Matni
                      </label>
                      <input
                        type="text"
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm((p) => ({ ...p, address: e.target.value }))}
                        className="w-full px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:border-red-600 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-2">
                      Ish Vaqtlari
                    </label>
                    <input
                      type="text"
                      value={settingsForm.workingHours}
                      onChange={(e) => setSettingsForm((p) => ({ ...p, workingHours: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:border-red-600 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all cursor-pointer"
                  >
                    Barcha Sozlamalarni Saqlash
                  </button>
                </form>

                {/* Database Backup & Restore Card */}
                <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/60 flex items-center justify-center text-red-600 dark:text-red-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-neutral-900 dark:text-white">
                        To'liq Zaxira Nusxa (Backup & Restore)
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Barcha kurslar, yangiliklar, galereya, arizalar va sozlamalarni JSON fayl sifatida yuklab olish yoki tiklash
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleExportFullBackup}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-800 dark:text-neutral-200 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span>Barcha Bazani Yuklab Olish (JSON)</span>
                    </button>

                    <label className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-red-500 hover:bg-red-50/30 dark:hover:bg-red-950/20 text-neutral-700 dark:text-neutral-300 text-xs font-bold transition-all cursor-pointer text-center">
                      <Upload className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span>Zaxirani Fayldan Tiklash (.json)</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportFullBackup}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* MODAL: ADD / EDIT COURSE */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-heading text-neutral-900 dark:text-white">
                {editingCourse ? "Kursni Tahrirlash" : "Yangi Kurs Qo'shish"}
              </h3>
              <button onClick={() => setIsCourseModalOpen(false)} className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">Kurs Nomi *</label>
                <input
                  type="text"
                  required
                  value={courseForm.title || ''}
                  onChange={(e) => setCourseForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Masalan: Frontend Web Dasturlash"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:border-red-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">Kategoriya</label>
                  <select
                    value={courseForm.category || 'languages'}
                    onChange={(e) => setCourseForm((p) => ({ ...p, category: e.target.value as CourseCategory }))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  >
                    <option value="languages">Xorijiy Tillar (Ingliz, Rus, Arab...)</option>
                    <option value="sciences">Aniq Fanlar & Mantiq (Matematika, Fizika...)</option>
                    <option value="dtm">DTM & Milliy Sertifikat</option>
                    <option value="kids">Bolalar & Maktabgacha ta'lim</option>
                  </select>
                </div>

                {/* Dars Davomiyligi */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase">
                      Dars Davomiyligi *
                    </label>
                  </div>
                  <input
                    type="text"
                    required
                    value={courseForm.duration || ''}
                    onChange={(e) => setCourseForm((p) => ({ ...p, duration: e.target.value }))}
                    placeholder="Masalan: 4 oy"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs mb-1.5"
                  />
                  <div className="flex flex-wrap gap-1">
                    {['1 oy', '3 oy', '4 oy', '6 oy', '9 oy', '1 yil'].map((dur) => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => setCourseForm((p) => ({ ...p, duration: dur }))}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                          courseForm.duration === dur
                            ? 'bg-red-600 text-white'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        }`}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Haftada Necha Kunligi / Darslar Jadvali */}
              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800">
                <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase mb-1">
                  Darslar Jadvali (Haftada nechi kunligi va vaqti) *
                </label>
                <input
                  type="text"
                  required
                  value={courseForm.lessonsPerWeek || ''}
                  onChange={(e) => setCourseForm((p) => ({ ...p, lessonsPerWeek: e.target.value }))}
                  placeholder="Masalan: Haftada 3 kun, 2 soatdan"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs mb-2"
                />
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Haftada 3 kun, 1.5 soatdan',
                    'Haftada 3 kun, 2 soatdan',
                    'Haftada 2 kun, 2 soatdan',
                    'Haftada 5 kun (Intensiv)',
                    'Dam olish kunlari (Shanba-Yakshanba)',
                  ].map((sched) => (
                    <button
                      key={sched}
                      type="button"
                      onClick={() => setCourseForm((p) => ({ ...p, lessonsPerWeek: sched }))}
                      className={`text-[10px] px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                        courseForm.lessonsPerWeek === sched
                          ? 'bg-red-600 text-white font-bold'
                          : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-red-400'
                      }`}
                    >
                      {sched}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">Tavsif</label>
                <textarea
                  rows={2}
                  value={courseForm.description || ''}
                  onChange={(e) => setCourseForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Kurs haqida qisqacha ma'lumot..."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">Oylik Narxi (so'm) *</label>
                  <input
                    type="number"
                    required
                    value={courseForm.price || ''}
                    onChange={(e) => setCourseForm((p) => ({ ...p, price: Number(e.target.value) }))}
                    placeholder="650000"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">Eski Narxi (Aksiya uchun)</label>
                  <input
                    type="number"
                    value={courseForm.originalPrice || ''}
                    onChange={(e) => setCourseForm((p) => ({ ...p, originalPrice: Number(e.target.value) }))}
                    placeholder="900000"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">Aksiya Badji</label>
                  <input
                    type="text"
                    value={courseForm.discountBadge || ''}
                    onChange={(e) => setCourseForm((p) => ({ ...p, discountBadge: e.target.value, hasDiscount: true }))}
                    placeholder="20% AKSIYA"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">Katta Mentor</label>
                  <input
                    type="text"
                    value={courseForm.mentor || ''}
                    onChange={(e) => setCourseForm((p) => ({ ...p, mentor: e.target.value }))}
                    placeholder="Mentor ismi"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              {/* Real Image Uploader (Cropsiz, to'liq banner preview) */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">
                  Kurs Muqova Rasmi (Banner yoki Poster) *
                </label>
                <div className="space-y-2">
                  {courseForm.image && (
                    <div className="relative w-full max-h-48 rounded-2xl bg-neutral-950 flex items-center justify-center overflow-hidden border border-neutral-200 dark:border-neutral-700 p-1">
                      <img
                        src={courseForm.image}
                        alt="Preview"
                        className="max-h-44 w-auto object-contain block rounded-xl"
                      />
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                        Kesilmasdan (Cropsiz) tushadi
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:border-red-500 dark:hover:border-red-500 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-2 cursor-pointer bg-white dark:bg-neutral-800 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>{courseForm.image ? "Boshqa rasm yuklash" : "Kompyuter yoki telefondan rasm tanlash"}</span>
                      <input type="file" accept="image/*" onChange={handleCourseImageUpload} className="hidden" />
                    </label>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Istalgan proporsiyadagi banner to'liq qamrab olinadi
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all cursor-pointer"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT NEWS */}
      {isNewsModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-heading text-neutral-900 dark:text-white">
                {editingNews ? "Yangilikni Tahrirlash" : "Yangi Xabar Qo'shish"}
              </h3>
              <button onClick={() => setIsNewsModalOpen(false)} className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">Sarlavha *</label>
                <input
                  type="text"
                  required
                  value={newsForm.title || ''}
                  onChange={(e) => setNewsForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Masalan: Bepul Ochiq Dars..."
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:border-red-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">Kategoriya</label>
                  <input
                    type="text"
                    value={newsForm.category || "E'lon"}
                    onChange={(e) => setNewsForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">Sana</label>
                  <input
                    type="text"
                    value={newsForm.date || ''}
                    onChange={(e) => setNewsForm((p) => ({ ...p, date: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">To'liq Matn *</label>
                <textarea
                  rows={4}
                  required
                  value={newsForm.content || ''}
                  onChange={(e) => setNewsForm((p) => ({ ...p, content: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs"
                />
              </div>

              {/* Real Media Upload (Image or Video) */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">
                  Haqiqiy Rasm yoki Video Yuklash *
                </label>
                <div className="flex items-center gap-4">
                  {newsForm.mediaUrl && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-black">
                      {newsForm.mediaType === 'video' ? (
                        <video src={newsForm.mediaUrl} className="w-full h-full object-cover" />
                      ) : (
                        <img src={newsForm.mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                      )}
                    </div>
                  )}
                  <label className="px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:border-red-500 dark:hover:border-red-500 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1.5 cursor-pointer bg-white dark:bg-neutral-800 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Fayl tanlash (Rasm yoki Video)</span>
                    <input type="file" accept="image/*,video/*" onChange={handleNewsMediaUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all cursor-pointer"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD TO GALLERY (PHOTO OR VIDEO) */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-heading text-neutral-900 dark:text-white">
                Galereyaga Rasm/Video Yuklash
              </h3>
              <button onClick={() => setIsGalleryModalOpen(false)} className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGallery} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">Nom / Tavsif</label>
                <input
                  type="text"
                  value={galleryForm.title || ''}
                  onChange={(e) => setGalleryForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Dars jarayonidan lavha..."
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:border-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">Kategoriya</label>
                <select
                  value={galleryForm.category || 'dars'}
                  onChange={(e) => setGalleryForm((p) => ({ ...p, category: e.target.value as any }))}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                >
                  <option value="dars">Dars Jarayoni</option>
                  <option value="yutuqlar">O'quvchilar Yutuqlari</option>
                  <option value="tadbirlar">Tadbirlar & Speaking Club</option>
                  <option value="markaz">Markazimiz Muhiti</option>
                </select>
              </div>

              {/* File Dropzone */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-2">
                  Fayl (Rasm yoki MP4 Video) *
                </label>
                <label className="w-full border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-red-500 dark:hover:border-red-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-50 dark:bg-neutral-800/50 hover:bg-red-50/40 dark:hover:bg-neutral-800">
                  {galleryForm.url ? (
                    <div className="flex flex-col items-center gap-2">
                      {galleryForm.type === 'video' ? (
                        <video src={galleryForm.url} className="w-32 h-24 object-cover rounded-lg" />
                      ) : (
                        <img src={galleryForm.url} alt="Preview" className="w-32 h-24 object-cover rounded-lg" />
                      )}
                      <span className="text-[11px] font-bold text-red-600 dark:text-red-400">Fayl tanlandi! Boshqasini tanlash uchun bosing</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-neutral-400 dark:text-neutral-500">
                      <Upload className="w-8 h-8 text-neutral-300 dark:text-neutral-600" />
                      <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Faylni tanlash uchun bosing</span>
                      <span className="text-[10px]">PNG, JPG, WEBP yoki MP4, WEBM</span>
                    </div>
                  )}
                  <input type="file" accept="image/*,video/*" onChange={handleGalleryFileUpload} className="hidden" />
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all cursor-pointer"
                >
                  Yuklash va Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT BRANCH */}
      {isBranchModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold font-heading text-neutral-900 dark:text-white">
                  {editingBranch ? "Filial Manzilini Tahrirlash" : "Yangi Filial / Manzil Qo'shish"}
                </h3>
              </div>
              <button
                onClick={() => setIsBranchModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBranch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">
                  Filial / Bino Nomi *
                </label>
                <input
                  type="text"
                  required
                  value={branchForm.name || ''}
                  onChange={(e) => setBranchForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Masalan: Bosh Bino (1-filial) yoki Chilonzor filiali"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:border-red-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">
                  Aniq Manzil *
                </label>
                <textarea
                  rows={2}
                  required
                  value={branchForm.address || ''}
                  onChange={(e) => setBranchForm((p) => ({ ...p, address: e.target.value }))}
                  placeholder="Masalan: Samarqand shahar, Registon ko'chasi 45-uy"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:border-red-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">
                    Mo'ljal (Ixtiyoriy)
                  </label>
                  <input
                    type="text"
                    value={branchForm.landmark || ''}
                    onChange={(e) => setBranchForm((p) => ({ ...p, landmark: e.target.value }))}
                    placeholder="Masalan: Markaziy bank qarshisida"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:border-red-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">
                    Filial Telefoni (Ixtiyoriy)
                  </label>
                  <input
                    type="text"
                    value={branchForm.phone || ''}
                    onChange={(e) => setBranchForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+998 90 123 45 67"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:border-red-600 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-neutral-200 dark:border-neutral-750 bg-neutral-50 dark:bg-neutral-800/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(branchForm.isMain)}
                    onChange={(e) => setBranchForm((p) => ({ ...p, isMain: e.target.checked }))}
                    className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                      Asosiy Bosh Bino qilib belgilash
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Bosh sahifada va umumiy aloqa kartasida birinchi o'rinda chiqadi
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsBranchModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all cursor-pointer"
                >
                  {editingBranch ? "O'zgarishlarni Saqlash" : "Manzilni Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM IN-APP DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-neutral-900 dark:text-white font-heading">
                  O'chirishni tasdiqlaysizmi?
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {deleteTarget.type === 'course' && "Ushbu kurs o'quv markazi ro'yxatidan butunlay o'chiriladi."}
                  {deleteTarget.type === 'news' && "Ushbu yangilik/xabar butunlay o'chiriladi."}
                  {deleteTarget.type === 'gallery' && "Ushbu foto/video fayl galereyadan o'chiriladi."}
                  {deleteTarget.type === 'application' && "Ushbu ariza CRM bazasidan o'chiriladi."}
                  {deleteTarget.type === 'branch' && "Ushbu filial manzili o'quv markazi ro'yxatidan o'chiriladi."}
                  {deleteTarget.type === 'clear_all_gallery' && "Diqqat! Barcha foto va video materiallar butunlay o'chiriladi. Bu amal ortga qaytarilmaydi."}
                  {deleteTarget.type === 'clear_all_courses' && "Diqqat! Barcha kurslar butunlay o'chiriladi. Bu amal ortga qaytarilmaydi."}
                  {deleteTarget.type === 'clear_all_news' && "Diqqat! Barcha yangiliklar butunlay o'chiriladi. Bu amal ortga qaytarilmaydi."}
                  {deleteTarget.type === 'clear_all_applications' && "Diqqat! Barcha arizalar butunlay o'chiriladi. Bu amal ortga qaytarilmaydi."}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
              <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate">
                "{deleteTarget.name}"
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deleteTarget.type.startsWith('clear_all') ? "Ha, tozalansin" : "Ha, o'chirilsin"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
