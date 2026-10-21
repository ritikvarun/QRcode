import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import QRListPage from './pages/QRListPage';
import ProfilePage from './pages/ProfilePage';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import CreateQRModal from './components/CreateQRModal';
import EditQRModal from './components/EditQRModal';
import QRDetailsModal from './components/QRDetailsModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import { RefreshCw } from 'lucide-react';

function DashboardApp() {
  const { isAuthenticated, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingQR, setEditingQR] = useState(null);
  const [detailsQR, setDetailsQR] = useState(null);
  const [deletingQR, setDeletingQR] = useState(null);

  // Trigger for refreshing views when QR data changes
  const [refreshKey, setRefreshKey] = useState(0);

  const showToast = (toastObj) => {
    setToast(toastObj);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-indigo-400" />
          <span className="text-xs text-slate-400">Loading Dynamic QR Studio...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  const handleQRMutationSuccess = () => {
    setRefreshKey((k) => k + 1);
  };

  const titles = {
    dashboard: 'Dashboard Overview',
    qrcodes: 'Dynamic QR Codes',
    profile: 'Admin Account & Settings',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenCreate={() => setCreateModalOpen(true)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <Navbar
          currentTabTitle={titles[currentTab] || 'Dashboard'}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenCreate={() => setCreateModalOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardPage
              key={`dash-${refreshKey}`}
              onOpenCreate={() => setCreateModalOpen(true)}
              onNavigateToList={() => setCurrentTab('qrcodes')}
              onEditQR={(qr) => setEditingQR(qr)}
              onDeleteQR={(qr) => setDeletingQR(qr)}
              onViewDetails={(qr) => setDetailsQR(qr)}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'qrcodes' && (
            <QRListPage
              key={`list-${refreshKey}`}
              onOpenCreate={() => setCreateModalOpen(true)}
              onEditQR={(qr) => setEditingQR(qr)}
              onDeleteQR={(qr) => setDeletingQR(qr)}
              onViewDetails={(qr) => setDetailsQR(qr)}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'profile' && (
            <ProfilePage onShowToast={showToast} />
          )}
        </main>
      </div>

      {/* Modals */}
      <CreateQRModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          handleQRMutationSuccess();
          setCurrentTab('qrcodes');
        }}
        onShowToast={showToast}
      />

      <EditQRModal
        qr={editingQR}
        isOpen={!!editingQR}
        onClose={() => setEditingQR(null)}
        onSuccess={handleQRMutationSuccess}
        onShowToast={showToast}
      />

      <QRDetailsModal
        qr={detailsQR}
        isOpen={!!detailsQR}
        onClose={() => setDetailsQR(null)}
        onShowToast={showToast}
      />

      <DeleteConfirmModal
        qr={deletingQR}
        isOpen={!!deletingQR}
        onClose={() => setDeletingQR(null)}
        onSuccess={handleQRMutationSuccess}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DashboardApp />
    </AuthProvider>
  );
}
