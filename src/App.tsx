import React, { useState } from 'react';
import { AppProvider } from './context';
import Dashboard from './components/Dashboard';
import AttendanceInput from './components/AttendanceInput';
import AttendanceHistory from './components/AttendanceHistory';
import StudentManagement from './components/StudentManagement';
import Reports from './components/Reports';
import BKManagement from './components/BKManagement';
import { LayoutDashboard, ClipboardCheck, History, Users, FileBarChart, BookOpen, Shield } from 'lucide-react';

type Page = 'dashboard' | 'input' | 'history' | 'students' | 'reports' | 'bk';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'input', label: 'Input Absensi', icon: <ClipboardCheck className="w-5 h-5" /> },
    { id: 'history', label: 'Riwayat Absensi', icon: <History className="w-5 h-5" /> },
    { id: 'bk', label: 'Bimbingan Konseling', icon: <Shield className="w-5 h-5" /> },
    { id: 'students', label: 'Data Mahasantri', icon: <Users className="w-5 h-5" /> },
    { id: 'reports', label: 'Laporan & Export', icon: <FileBarChart className="w-5 h-5" /> },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'input': return <AttendanceInput />;
      case 'history': return <AttendanceHistory />;
      case 'students': return <StudentManagement />;
      case 'reports': return <Reports />;
      case 'bk': return <BKManagement />;
      default: return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-gray-800 text-sm">Ma'had Aly</h1>
                  <p className="text-xs text-gray-500">Sistem Absensi Mahasantri</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    currentPage === item.id
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3">
                <p className="text-xs text-indigo-700 font-medium">Bagian Kemahasantrian</p>
                <p className="text-xs text-indigo-500 mt-0.5">Monitoring & Evaluasi</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="hidden lg:block">
                <h2 className="text-lg font-semibold text-gray-800">
                  {navItems.find(n => n.id === currentPage)?.label}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">Admin Ma'had</p>
                  <p className="text-xs text-gray-500">Bagian Kemahasantrian</p>
                </div>
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 lg:p-8">
            {renderPage()}
          </div>
        </main>
      </div>
    </AppProvider>
  );
};

export default App;
