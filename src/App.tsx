import { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import BottomNav from './components/layout/BottomNav';
import Header from './components/layout/Header';
import ToastContainer from './components/ui/ToastContainer';
import OrderFormModal from './components/orders/OrderFormModal';
import OrderDetailsModal from './components/orders/OrderDetailsModal';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import CustomersPage from './pages/CustomersPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import type { NavPageId, Order, OrderPayload } from './types';

function WaselShell() {
  const {
    orders,
    products,
    settings,
    addOrder,
    updateOrder,
    updateOrderStatus,
  } = useApp();

  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [activePage, setActivePage] = useState<NavPageId>('dashboard');
  const [quickOrderOpen, setQuickOrderOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const handleEnterDashboard = (initialTab: NavPageId = 'dashboard') => {
    setActivePage(initialTab);
    setView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveOrder = (payload: OrderPayload) => {
    if (editingOrder) {
      updateOrder(editingOrder.id, payload);
    } else {
      addOrder(payload);
    }
    setEditingOrder(null);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={setActivePage}
            onAddOrder={() => {
              setEditingOrder(null);
              setQuickOrderOpen(true);
            }}
            onViewOrder={(order) => setViewingOrder(order)}
          />
        );
      case 'orders':
        return <OrdersPage />;
      case 'products':
        return <ProductsPage />;
      case 'customers':
        return <CustomersPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return null;
    }
  };

  if (view === 'landing') {
    return (
      <>
        <LandingPage onEnterDashboard={handleEnterDashboard} />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onBackToLanding={handleBackToLanding}
        storeName={settings.storeName}
      />

      <div className="lg:pr-64 flex flex-col min-h-screen">
        <Header
          activePage={activePage}
          storeName={settings.storeName}
          onBackToLanding={handleBackToLanding}
          onQuickAddOrder={() => {
            setEditingOrder(null);
            setQuickOrderOpen(true);
          }}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24 lg:pb-8">
          {renderPage()}
        </main>
      </div>

      <BottomNav activePage={activePage} onNavigate={setActivePage} />
      <ToastContainer />

      <OrderFormModal
        isOpen={quickOrderOpen}
        onClose={() => {
          setQuickOrderOpen(false);
          setEditingOrder(null);
        }}
        onSave={handleSaveOrder}
        products={products}
        currency={settings.currency || 'LYD'}
        initialOrder={editingOrder}
      />

      <OrderDetailsModal
        order={
          viewingOrder
            ? orders.find((o) => o.id === viewingOrder.id) || viewingOrder
            : null
        }
        isOpen={Boolean(viewingOrder)}
        onClose={() => setViewingOrder(null)}
        onChangeStatus={updateOrderStatus}
        onEdit={(ord) => {
          setEditingOrder(ord);
          setQuickOrderOpen(true);
        }}
        currency={settings.currency || 'LYD'}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <WaselShell />
      </AppProvider>
    </ToastProvider>
  );
}
