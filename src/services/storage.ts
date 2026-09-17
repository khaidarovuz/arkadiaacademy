import { Course, NewsItem, GalleryItem, Application, AcademySettings } from '../types';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const DB_NAME = 'ArkadiaAcademyDB_v2';
const DB_VERSION = 1;
const STORE_NAME = 'media_and_data';

// Helper for IndexedDB persistence (allows storing real large photos & videos)
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

export async function idbSet<T>(key: string, value: T): Promise<void> {
  // Always mirror non-huge objects to localStorage for maximum reliability across reloads
  try {
    localStorage.setItem(`arkadia_${key}`, JSON.stringify(value));
  } catch {
    // If quota exceeded due to large base64 media, that's fine; IndexedDB will handle it
  }

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(value, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn('IndexedDB write error, saved to localStorage fallback:', e);
  }
}

export async function idbGet<T>(key: string): Promise<T | null> {
  // Try IndexedDB first
  try {
    const db = await openDB();
    const result = await new Promise<T | null>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result !== undefined ? request.result : null);
      request.onerror = () => reject(request.error);
    });

    if (result !== null && result !== undefined) {
      return result;
    }
  } catch (e) {
    console.warn('IndexedDB read error, trying localStorage fallback:', e);
  }

  // Fallback to localStorage
  try {
    const item = localStorage.getItem(`arkadia_${key}`);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

// BroadcastChannel & Window event for instant real-time synchronization across all tabs and current window
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('arkadia_sync_channel');
  }
} catch (e) {
  console.log('BroadcastChannel not supported', e);
}

export function notifyDataChange(type: string, data?: unknown) {
  // Broadcast to other tabs
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type, data, timestamp: Date.now() });
    } catch {
      // ignore
    }
  }
  // Also dispatch in current window so current tab UI updates immediately without needing a reload
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('arkadia_data_change', { detail: { type, data, timestamp: Date.now() } }));
    } catch {
      // ignore
    }
  }
}

export function subscribeToDataChanges(callback: (msg: { type: string; data?: unknown }) => void) {
  const channelHandler = (event: MessageEvent) => {
    callback(event.data);
  };
  const windowHandler = (event: Event) => {
    const customEvent = event as CustomEvent;
    callback(customEvent.detail);
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', channelHandler);
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('arkadia_data_change', windowHandler);
  }

  return () => {
    broadcastChannel?.removeEventListener('message', channelHandler);
    if (typeof window !== 'undefined') {
      window.removeEventListener('arkadia_data_change', windowHandler);
    }
  };
}

// Initial Default Settings (Updated with official Arkadia channels)
export const initialSettings: AcademySettings = {
  name: 'ARKADIA ACADEMY',
  motto: "Sifatli ta'lim va yuqori natijalar maskani",
  phone: '+998 (90) 840-20-25',
  phoneSecondary: '+998 (93) 710-20-25',
  telegramUsername: 'arkadiaacademy1',
  telegramUrl: 'https://t.me/arkadiaacademy1',
  instagramUsername: 'arkadia__academy',
  instagramUrl: 'https://instagram.com/arkadia__academy',
  address: "Toshkent shahri, Yunusobod tumani, Amir Temur shoh ko'chasi 107-uy (Mo'ljal: Shahriston metro bekati yonida)",
  branches: [
    {
      id: 'branch-1',
      name: '1-Filial: Bosh Bino (Yunusobod)',
      address: "Toshkent shahri, Yunusobod tumani, Amir Temur shoh ko'chasi, 107-uy",
      landmark: "Shahriston metro bekati yonida, 3-qavat",
      phone: '+998 (90) 840-20-25',
      isMain: true,
    },
    {
      id: 'branch-2',
      name: '2-Filial: Chilonzor Markazi',
      address: "Toshkent shahri, Chilonzor tumani, Bunyodkor shoh ko'chasi, 42-uy",
      landmark: "Mirzo Ulug'bek metro bekati ro'parasida",
      phone: '+998 (93) 710-20-25',
      isMain: false,
    },
  ],
  workingHours: 'Dushanba - Shanba: 08:30 - 20:30, Yakshanba: 09:00 - 18:00',
  announcementText: "🔥 Yangi guruhlarga qabul ochiq! Yangi o'quvchilarga birinchi oy uchun 20% gacha maxsus chegirma mavjud!",
  showAnnouncement: true,
  email: 'info@arkadia-academy.uz',
};

// Clean Initial Datasets (Empty by default so fake items never reappear)
export const initialCourses: Course[] = [];
export const initialNews: NewsItem[] = [];
export const initialGallery: GalleryItem[] = [];
export const initialApplications: Application[] = [];

// High-level getter & setter functions with persistent Firestore cloud guarantee
export async function getStoredSettings(): Promise<AcademySettings> {
  // 1. Check Firestore cloud first
  try {
    const docRef = doc(db, 'settings', 'academy');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const remoteData = snap.data() as AcademySettings;
      const branches = (remoteData.branches && remoteData.branches.length > 0)
        ? remoteData.branches
        : initialSettings.branches;
      
      // Auto-update to latest user specified channels if still having defaults
      let needsCloudUpdate = false;
      if (remoteData.telegramUsername === '@arkadia_Academy' || remoteData.telegramUsername === 'arkadia_Academy' || remoteData.telegramUsername === '@arkadiaacademy' || !remoteData.telegramUsername) {
        remoteData.telegramUsername = 'arkadiaacademy1';
        remoteData.telegramUrl = 'https://t.me/arkadiaacademy1';
        needsCloudUpdate = true;
      }
      if (remoteData.instagramUsername === 'arkadia_academy' || !remoteData.instagramUsername) {
        remoteData.instagramUsername = 'arkadia__academy';
        remoteData.instagramUrl = 'https://instagram.com/arkadia__academy';
        needsCloudUpdate = true;
      }
      if (remoteData.announcementText && remoteData.announcementText.includes('30%')) {
        remoteData.announcementText = remoteData.announcementText.replace('30%', '20%');
        needsCloudUpdate = true;
      }

      const merged: AcademySettings = {
        ...initialSettings,
        ...remoteData,
        branches,
      };

      if (needsCloudUpdate) {
        setDoc(docRef, merged, { merge: true }).catch(() => {});
      }

      // Keep local cache in sync
      await idbSet('settings', merged);
      return merged;
    } else {
      // Bootstrap cloud with initial settings so it persists across all devices
      await setDoc(docRef, initialSettings, { merge: true }).catch(() => {});
    }
  } catch (err) {
    console.warn('[Firebase] Settings fetch error, falling back to local storage:', err);
  }

  // 2. Fallback to local storage (IndexedDB / localStorage)
  const localData = await idbGet<AcademySettings>('settings');
  if (!localData) return initialSettings;

  if (localData.telegramUsername === '@arkadia_Academy' || localData.telegramUsername === 'arkadia_Academy') {
    localData.telegramUsername = 'arkadiaacademy1';
    localData.telegramUrl = 'https://t.me/arkadiaacademy1';
  }
  if (localData.instagramUsername === 'arkadia_academy') {
    localData.instagramUsername = 'arkadia__academy';
    localData.instagramUrl = 'https://instagram.com/arkadia__academy';
  }
  if (localData.announcementText && localData.announcementText.includes('30%')) {
    localData.announcementText = localData.announcementText.replace('30%', '20%');
  }

  const branches = (localData.branches && localData.branches.length > 0)
    ? localData.branches
    : initialSettings.branches;

  return {
    ...initialSettings,
    ...localData,
    branches,
  };
}

export async function saveStoredSettings(settings: AcademySettings): Promise<void> {
  // 1. Local storage for instant access
  await idbSet('settings', settings);

  // 2. Cloud Firestore persistence
  try {
    const docRef = doc(db, 'settings', 'academy');
    await setDoc(docRef, settings, { merge: true });
  } catch (err) {
    console.error('[Firebase] Failed to save settings to Firestore:', err);
  }

  // 3. Notify tabs/components after save is settled
  notifyDataChange('SETTINGS_UPDATED', settings);
}

export async function getStoredCourses(): Promise<Course[]> {
  try {
    const docRef = doc(db, 'courses', 'all');
    const snap = await getDoc(docRef);
    if (snap.exists() && Array.isArray(snap.data().list)) {
      const courses = snap.data().list as Course[];
      await idbSet('courses', courses);
      return courses;
    }
  } catch (err) {
    console.warn('[Firebase] Courses fetch error, falling back to local cache:', err);
  }

  const localData = await idbGet<Course[]>('courses');
  return localData !== null && Array.isArray(localData) ? localData : [];
}

export async function saveStoredCourses(courses: Course[]): Promise<void> {
  // 1. Save locally first
  await idbSet('courses', courses);

  // 2. Save to Firestore cloud
  try {
    const docRef = doc(db, 'courses', 'all');
    await setDoc(docRef, { list: courses }, { merge: true });
  } catch (err) {
    console.error('[Firebase] Failed to save courses to Firestore:', err);
  }

  // 3. Notify subscribers WITH THE ACTUAL NEW COURSES DATA
  notifyDataChange('COURSES_UPDATED', courses);
}

export async function getStoredNews(): Promise<NewsItem[]> {
  try {
    const docRef = doc(db, 'news', 'all');
    const snap = await getDoc(docRef);
    if (snap.exists() && Array.isArray(snap.data().list)) {
      const news = snap.data().list as NewsItem[];
      await idbSet('news', news);
      return news;
    }
  } catch (err) {
    console.warn('[Firebase] News fetch error, falling back to local cache:', err);
  }

  const localData = await idbGet<NewsItem[]>('news');
  return localData !== null && Array.isArray(localData) ? localData : [];
}

export async function saveStoredNews(news: NewsItem[]): Promise<void> {
  // 1. Save locally first
  await idbSet('news', news);

  // 2. Save to Firestore cloud
  try {
    const docRef = doc(db, 'news', 'all');
    await setDoc(docRef, { list: news }, { merge: true });
  } catch (err) {
    console.error('[Firebase] Failed to save news to Firestore:', err);
  }

  // 3. Notify subscribers WITH THE ACTUAL NEW NEWS DATA
  notifyDataChange('NEWS_UPDATED', news);
}

export async function getStoredGallery(): Promise<GalleryItem[]> {
  try {
    const docRef = doc(db, 'gallery', 'all');
    const snap = await getDoc(docRef);
    if (snap.exists() && Array.isArray(snap.data().list)) {
      const gallery = snap.data().list as GalleryItem[];
      await idbSet('gallery', gallery);
      return gallery;
    }
  } catch (err) {
    console.warn('[Firebase] Gallery fetch error, falling back to local cache:', err);
  }

  const localData = await idbGet<GalleryItem[]>('gallery');
  return localData !== null && Array.isArray(localData) ? localData : [];
}

export async function saveStoredGallery(gallery: GalleryItem[]): Promise<void> {
  // 1. Save locally first
  await idbSet('gallery', gallery);

  // 2. Save to Firestore cloud
  try {
    const docRef = doc(db, 'gallery', 'all');
    await setDoc(docRef, { list: gallery }, { merge: true });
  } catch (err) {
    console.error('[Firebase] Failed to save gallery to Firestore:', err);
  }

  // 3. Notify subscribers WITH THE ACTUAL NEW GALLERY DATA
  notifyDataChange('GALLERY_UPDATED', gallery);
}

export async function getStoredApplications(): Promise<Application[]> {
  try {
    const docRef = doc(db, 'applications', 'all');
    const snap = await getDoc(docRef);
    if (snap.exists() && Array.isArray(snap.data().list)) {
      const applications = snap.data().list as Application[];
      await idbSet('applications', applications);
      return applications;
    }
  } catch (err) {
    console.warn('[Firebase] Applications fetch error, falling back to local cache:', err);
  }

  const localData = await idbGet<Application[]>('applications');
  return localData !== null && Array.isArray(localData) ? localData : [];
}

export async function saveStoredApplications(applications: Application[]): Promise<void> {
  // 1. Save locally first
  await idbSet('applications', applications);

  // 2. Save to Firestore cloud
  try {
    const docRef = doc(db, 'applications', 'all');
    await setDoc(docRef, { list: applications }, { merge: true });
  } catch (err) {
    console.error('[Firebase] Failed to save applications to Firestore:', err);
  }

  // 3. Notify subscribers WITH THE ACTUAL NEW APPLICATIONS DATA
  notifyDataChange('APPLICATIONS_UPDATED', applications);
}

// Clear all demo/fake mock data across cloud and local storage
export async function clearAllMockData(): Promise<void> {
  await saveStoredCourses([]);
  await saveStoredNews([]);
  await saveStoredGallery([]);
  await saveStoredApplications([]);
}

// Force purge all courses and news across Firestore, IndexedDB and localStorage
export async function forcePurgeCoursesAndNews(): Promise<void> {
  try {
    const coursesRef = doc(db, 'courses', 'all');
    await setDoc(coursesRef, { list: [] }, { merge: true });
  } catch (e) {
    console.error('Failed to clear courses in Firestore:', e);
  }

  try {
    const newsRef = doc(db, 'news', 'all');
    await setDoc(newsRef, { list: [] }, { merge: true });
  } catch (e) {
    console.error('Failed to clear news in Firestore:', e);
  }

  await idbSet('courses', []);
  await idbSet('news', []);
  
  try {
    localStorage.setItem('arkadia_courses', JSON.stringify([]));
    localStorage.setItem('arkadia_news', JSON.stringify([]));
    localStorage.setItem('arkadia_courses_news_wiped_v1', 'true');
  } catch {
    // ignore
  }

  notifyDataChange('COURSES_UPDATED', []);
  notifyDataChange('NEWS_UPDATED', []);
}

// Force purge all gallery items across Firestore, IndexedDB and localStorage
export async function forcePurgeGallery(): Promise<void> {
  try {
    const galleryRef = doc(db, 'gallery', 'all');
    await setDoc(galleryRef, { list: [] }, { merge: true });
  } catch (e) {
    console.error('Failed to clear gallery in Firestore:', e);
  }

  await idbSet('gallery', []);

  try {
    localStorage.setItem('arkadia_gallery', JSON.stringify([]));
    localStorage.setItem('arkadia_gallery_wiped_v2', 'true');
  } catch {
    // ignore
  }

  notifyDataChange('GALLERY_UPDATED', []);
}

// Listen to real-time changes from Firestore cloud across all devices
export function initFirestoreRealtimeListeners(): () => void {
  const unsubSettings = onSnapshot(doc(db, 'settings', 'academy'), (snap) => {
    if (snap.exists()) {
      const remoteData = snap.data() as AcademySettings;
      idbSet('settings', remoteData);
      notifyDataChange('SETTINGS_UPDATED', remoteData);
    }
  }, (err) => console.log('[Firebase] Settings listener standby:', err.message));

  const unsubCourses = onSnapshot(doc(db, 'courses', 'all'), (snap) => {
    if (snap.exists() && Array.isArray(snap.data().list)) {
      const list = snap.data().list as Course[];
      idbSet('courses', list);
      notifyDataChange('COURSES_UPDATED', list);
    }
  }, (err) => console.log('[Firebase] Courses listener standby:', err.message));

  const unsubNews = onSnapshot(doc(db, 'news', 'all'), (snap) => {
    if (snap.exists() && Array.isArray(snap.data().list)) {
      const list = snap.data().list as NewsItem[];
      idbSet('news', list);
      notifyDataChange('NEWS_UPDATED', list);
    }
  }, (err) => console.log('[Firebase] News listener standby:', err.message));

  const unsubGallery = onSnapshot(doc(db, 'gallery', 'all'), (snap) => {
    if (snap.exists() && Array.isArray(snap.data().list)) {
      const list = snap.data().list as GalleryItem[];
      idbSet('gallery', list);
      notifyDataChange('GALLERY_UPDATED', list);
    }
  }, (err) => console.log('[Firebase] Gallery listener standby:', err.message));

  const unsubApplications = onSnapshot(doc(db, 'applications', 'all'), (snap) => {
    if (snap.exists() && Array.isArray(snap.data().list)) {
      const list = snap.data().list as Application[];
      idbSet('applications', list);
      notifyDataChange('APPLICATIONS_UPDATED', list);
    }
  }, (err) => console.log('[Firebase] Applications listener standby:', err.message));

  return () => {
    unsubSettings();
    unsubCourses();
    unsubNews();
    unsubGallery();
    unsubApplications();
  };
}

export async function submitNewApplication(appData: Omit<Application, 'id' | 'createdAt' | 'status'>): Promise<Application> {
  const current = await getStoredApplications();
  const randomNum = Math.floor(100 + Math.random() * 900);
  const newApp: Application = {
    ...appData,
    id: `ARK-${randomNum}`,
    status: 'Yangi',
    createdAt: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) + ', Bugun',
  };
  const updated = [newApp, ...current];
  await saveStoredApplications(updated);
  return newApp;
}

// Convert a File (image or video) directly to Base64 data URL with automatic image compression
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it is a video, read directly
    if (file.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
      return;
    }

    // For images, automatically compress & resize to prevent exceeding Firestore 1MB document limit
    const reader = new FileReader();
    reader.onload = (e) => {
      const resultStr = e.target?.result as string;
      if (!resultStr) {
        resolve('');
        return;
      }
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Compress to JPEG with 0.82 quality (reduces 5MB images to ~60-90KB)
            const compressedUrl = canvas.toDataURL('image/jpeg', 0.82);
            resolve(compressedUrl);
          } else {
            resolve(resultStr);
          }
        } catch {
          resolve(resultStr);
        }
      };
      img.onerror = () => resolve(resultStr);
      img.src = resultStr;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
