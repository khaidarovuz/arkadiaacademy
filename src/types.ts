export type CourseCategory = 'all' | 'languages' | 'sciences' | 'kids' | 'dtm';

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  description: string;
  duration: string;
  lessonsPerWeek: string;
  mentor: string;
  price: number; // e.g. 550000 som
  originalPrice?: number;
  hasDiscount?: boolean;
  discountBadge?: string;
  syllabus: string[];
  image: string;
  isPopular?: boolean;
  seatsLeft?: number;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  mediaType: 'image' | 'video';
  mediaUrl: string; // Real Data URL or asset
  author: string;
  tags: string[];
  likes?: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string; // Real Data URL or asset
  category: 'dars' | 'tadbirlar' | 'yutuqlar' | 'markaz';
  date: string;
  description?: string;
}

export type ApplicationStatus = 'Yangi' | 'Bog\'lanildi' | 'Qabul qilindi' | 'To\'lov qilindi' | 'Bekor qilindi';

export interface Application {
  id: string;
  fullName: string;
  phone: string;
  courseId: string;
  courseName: string;
  knowledgeLevel: string;
  studyTime: string;
  message?: string;
  status: ApplicationStatus;
  createdAt: string;
  notes?: string;
}

export interface BranchLocation {
  id: string;
  name: string; // Masalan: "Bosh bino (Yunusobod)", "2-filial (Chilonzor)"
  address: string; // Manzil
  landmark?: string; // Mo'ljal
  phone?: string; // Filial telefon raqami (ixtiyoriy)
  isMain?: boolean; // Asosiy filialmi
}

export interface AcademySettings {
  name: string;
  motto: string;
  foundedYear?: number;
  phone: string;
  phoneSecondary: string;
  telegramUsername: string;
  telegramUrl: string;
  instagramUsername: string;
  instagramUrl: string;
  address: string;
  branches?: BranchLocation[];
  workingHours: string;
  announcementText: string;
  showAnnouncement: boolean;
  email: string;
  customLogoUrl?: string;
}
