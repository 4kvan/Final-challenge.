import React, { useState, useEffect } from 'react';
import { useAuth } from '../../constext/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../constext/ToastContext';

function SettingsSection() {
  const { user,logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showStoreInfo, setShowStoreInfo] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    storeName: '',
    email: '',
    phone: '',
    address: '',
    freeShippingThreshold: 350,
    maintenanceMode: false
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

   const handleSaveSettings = async () => {
    await fetch('http://localhost:5000/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };


  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <div className="sectionHeader">
        <h2>Settings</h2>
      </div>

      
     <div className="settingsCard">
  <div className="settingsCardHeader">
    <h3>Store Information</h3>
    <button className="addBtn" onClick={() => setShowStoreInfo(!showStoreInfo)}>
      {showStoreInfo ? 'Close' : 'Edit'}
    </button>
  </div>

  {showStoreInfo && (
    <div className="settingsForm">
      <div className="settingsField">
        <label>Store Name</label>
        <input value={settings.storeName} onChange={(e) => setSettings({...settings, storeName: e.target.value})} />
      </div>
      <div className="settingsField">
        <label>Email</label>
        <input value={settings.email} onChange={(e) => setSettings({...settings, email: e.target.value})} />
      </div>
      <div className="settingsField">
        <label>Phone</label>
        <input value={settings.phone} onChange={(e) => setSettings({...settings, phone: e.target.value})} />
      </div>
      <div className="settingsField">
        <label>Address</label>
        <input value={settings.address} onChange={(e) => setSettings({...settings, address: e.target.value})} />
      </div>
      <button className="addBtn" onClick={handleSaveSettings}>
        {saved ? '✓ Saved!' : 'Save Changes'}
      </button>
    </div>
  )}
</div>

     
      <div className="settingsCard">
        <h3>Shipping Settings</h3>
        <div className="settingsForm">
          <div className="settingsField">
            <label>Free Shipping Threshold ($)</label>
            <input
              type="number"
              value={settings.freeShippingThreshold}
              onChange={(e) => setSettings({...settings, freeShippingThreshold: Number(e.target.value)})}
            />
          </div>
          <button className="addBtn" onClick={handleSaveSettings}>
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      
      <div className="settingsCard">
        <h3>Maintenance Mode</h3>
        <div className="maintenanceRow">
          <p>Take the site offline for maintenance</p>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => {
                setSettings({...settings, maintenanceMode: e.target.checked});
                fetch('http://localhost:5000/api/settings', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({...settings, maintenanceMode: e.target.checked})
                });
              }}
            />
            <span className="toggleSlider"></span>
          </label>
        </div>
        {settings.maintenanceMode && (
          <p className="maintenanceWarning">⚠️ Site is currently in maintenance mode</p>
        )}
      </div>


      
      <div className="settingsCard">
        <h3>Session</h3>
        <button className="deleteBtn" onClick={handleSignOut}>Sign Out</button>
      </div>

    </div>
  );
}
 
export default SettingsSection;