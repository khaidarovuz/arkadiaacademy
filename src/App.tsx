/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Course, 
  NewsItem, 
  GalleryItem, 
  Application, 
  AcademySettings 
} from './types';
import { 
  getStoredSettings, 
  saveStoredSettings,
  getStoredCourses, 
  getStoredNews, 
  getStoredGallery, 
  getStoredApplications,
  subscribeToDataChanges,
  initFirestoreRealtimeListeners,
  initialSettings,
  initialCourses,
  initialNews,
  initialGallery,
  initialApplications
} from './services/storage';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CoursesSection } from './components/CoursesSection';
import { WhyUsSection } from './components/WhyUsSection';
import { AdmissionSection } from './components/AdmissionSection';
import { NewsSection } from './components/NewsSection';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPanel } from './components/AdminPanel';
import { EditSocialModal } from './components/EditSocialModal';
import { BackToTop } from './components/BackToTop';

export default function App() {
  const [settings, setSettings] = useState<AcademySettings>(initialSettings);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [applications, setApplications] = useState<Application[]>(initialApplications);

  const [isLoading, setIsLoading] = useState(true);
  const [isEditSocialModalOpen, setIsEditSocialModalOpen] = useState(false);

  // Dark / Light Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('arkadia_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('arkadia_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('arkadia_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Admin authentication and panel states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Pre-selected course for the admission section
  const [preSelectedCourseId, setPreSelectedCourseId] = useState<string | null>(null);

  // Load all data from storage
  const loadAllData = useCallback(async () => {
    try {
      const [s, c, n, g, a] = await Promise.all([
        getStoredSettings(),
        getStoredCourses(),
        getStoredNews(),
        getStoredGallery(),
        getStoredApplications(),
      ]);

      setSettings(s);
      setCourses(c);
      setNews(n);
      setGallery(g);
      setApplications(a);
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();

    // Check if admin was previously logged in in this session
    const savedAdmin = sessionStorage.getItem('arkadia_admin_authenticated');
    if (savedAdmin === 'true') {
      setIsAdminLoggedIn(true);
    }

    // Subscribe to BroadcastChannel and window events for real-time synchronization
    const unsubscribeBroadcast = subscribeToDataChanges((msg) => {
      console.log('Real-time data update received:', msg.type);
      if (msg.type === 'COURSES_UPDATED' && Array.isArray(msg.data)) {
        setCourses(msg.data as Course[]);
      } else if (msg.type === 'NEWS_UPDATED' && Array.isArray(msg.data)) {
        setNews(msg.data as NewsItem[]);
      } else if (msg.type === 'GALLERY_UPDATED' && Array.isArray(msg.data)) {
        setGallery(msg.data as GalleryItem[]);
      } else if (msg.type === 'APPLICATIONS_UPDATED' && Array.isArray(msg.data)) {
        setApplications(msg.data as Application[]);
      } else if (msg.type === 'SETTINGS_UPDATED' && msg.data) {
        setSettings(msg.data as AcademySettings);
      } else {
        loadAllData();
      }
    });

    // Subscribe to Firebase Firestore cloud real-time updates across all devices
    const unsubscribeFirestore = initFirestoreRealtimeListeners();

    return () => {
      unsubscribeBroadcast();
      unsubscribeFirestore();
    };
  }, [loadAllData]);

  // Global Keyboard Shortcut: Ctrl+Shift+A or Alt+A to open Admin Menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        if (isAdminLoggedIn) {
          setIsAdminPanelOpen(true);
        } else {
          setIsAdminLoginModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminLoggedIn]);

  // Admin Login Success Handler
  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('arkadia_admin_authenticated', 'true');
    setIsAdminLoginModalOpen(false);
    setIsAdminPanelOpen(true);
  };

  // Admin Logout Handler
  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('arkadia_admin_authenticated');
    setIsAdminPanelOpen(false);
  };

  // Scroll to Admission Form smoothly
  const scrollToAdmission = () => {
    const el = document.getElementById('qabul');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to Courses Section smoothly
  const scrollToCourses = () => {
    const el = document.getElementById('kurslar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // When a user clicks "Yozilish" on a specific course
  const handleSelectCourseForAdmission = (course: Course) => {
    setPreSelectedCourseId(course.id);
    scrollToAdmission();
  };

  // Social settings update handler
  const handleSaveSocialSettings = async (newSettings: AcademySettings) => {
    setSettings(newSettings);
    await saveStoredSettings(newSettings);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f9] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 selection:bg-red-600 selection:text-white font-sans antialiased transition-colors duration-200">
      
      {/* Navigation Bar */}
      <Navbar
        settings={settings}
        onOpenAdmission={scrollToAdmission}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Page Content */}
      <main className="flex-grow">
        {/* 1. Hero Section with 3D elements */}
        <Hero
          settings={settings}
          onOpenAdmission={scrollToAdmission}
          onExploreCourses={scrollToCourses}
        />

        {/* 2. Why Arkadia Academy Advantages */}
        <WhyUsSection />

        {/* 3. Courses Catalog with Pricing, Discounts & Syllabi */}
        <CoursesSection
          courses={courses}
          onSelectCourseForAdmission={handleSelectCourseForAdmission}
        />

        {/* 4. Student Admission Application Form */}
        <AdmissionSection
          courses={courses}
          preSelectedCourseId={preSelectedCourseId}
          onClearPreSelectedCourse={() => setPreSelectedCourseId(null)}
          onNewApplication={(newApp) => {
            setApplications((prev) => [newApp, ...prev]);
          }}
        />

        {/* 5. Real News, Events & Masterclasses */}
        <NewsSection
          news={news}
        />

        {/* 6. Real Photos & Videos Gallery Showcase */}
        <GallerySection
          gallery={gallery}
        />

        {/* 7. Contact, Social Channels & Address */}
        <ContactSection
          settings={settings}
          onOpenAdmission={scrollToAdmission}
        />
      </main>

      {/* Footer with Discreet Hidden Admin Button */}
      <Footer
        settings={settings}
        onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
      />

      {/* Hidden Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Quick Edit Social Media Modal */}
      <EditSocialModal
        isOpen={isEditSocialModalOpen}
        onClose={() => setIsEditSocialModalOpen(false)}
        settings={settings}
        onSave={handleSaveSocialSettings}
      />

      {/* Full Admin Management Panel */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        onLogout={handleAdminLogout}
        settings={settings}
        onUpdateSettings={setSettings}
        courses={courses}
        onUpdateCourses={setCourses}
        news={news}
        onUpdateNews={setNews}
        gallery={gallery}
        onUpdateGallery={setGallery}
        applications={applications}
        onUpdateApplications={setApplications}
      />

      {/* Floating Back to Top Button */}
      <BackToTop />

    </div>
  );
}
