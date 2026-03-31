import React, { useState } from 'react';
import './AdminPage.css';
import ProductsSection from '../components/admin/ProductsSection';
import OrdersSection from '../components/admin/OrdersSection';
import AnalyticsSection from '../components/admin/AnalyticsSection';
import InventorySection from '../components/admin/InventorySection';
import SettingsSection from '../components/admin/SettingsSection';

function AdminPage() {
  const [activeSection, setActiveSection] = useState('products');

  const renderSection = () => {
    switch(activeSection) {
      case 'products': return <ProductsSection />;
      case 'orders': return <OrdersSection />;
      case 'analytics': return <AnalyticsSection />;
      case 'inventory': return <InventorySection />;
      case 'settings': return <SettingsSection />;
      default: return <ProductsSection />;
    }
  };

  return (
    <div className="adminLayout">
      <div className="adminSidebar">
        <h2 className="adminLogo">2MD Admin</h2>
        <nav className="adminNav">
          {[
            { id: 'products', label: '📦 Products' },
            { id: 'orders', label: '🛒 Orders' },
            { id: 'analytics', label: '📊 Analytics' },
            { id: 'inventory', label: '⚠️ Inventory' },
            
            { id: 'settings', label: '⚙️ Settings' },
          ].map(item => (
            <button
              key={item.id}
              className={`navItem ${activeSection === item.id ? 'navActive' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="adminMain">
        {renderSection()}
      </div>
    </div>
  );
}

export default AdminPage;