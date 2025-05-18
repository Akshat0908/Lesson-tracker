import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Sun, Moon, Bell, Shield, User, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to a backend
    alert('Profile saved successfully!');
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-text-light mb-6">Customize your learning experience</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div>
          <div className="card overflow-hidden">
            <div className="flex flex-col">
              <button className="flex items-center gap-3 p-3 bg-primary/10 text-primary font-medium">
                <SettingsIcon size={18} />
                <span>General</span>
              </button>
              
              <button className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Bell size={18} />
                <span>Notifications</span>
              </button>
              
              <button className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Shield size={18} />
                <span>Privacy & Security</span>
              </button>
              
              <button className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                <User size={18} />
                <span>Account</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Settings Content */}
        <div className="md:col-span-2">
          <div className="card mb-6">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-medium">Appearance</h3>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium mb-1">Theme</h4>
                  <p className="text-sm text-text-light">
                    Choose your preferred theme mode
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={theme === 'dark' ? toggleTheme : undefined}
                    className={`p-2 rounded-md ${
                      theme === 'light' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-text-light dark:bg-gray-800'
                    }`}
                  >
                    <Sun size={18} />
                  </button>
                  
                  <button
                    onClick={theme === 'light' ? toggleTheme : undefined}
                    className={`p-2 rounded-md ${
                      theme === 'dark' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-text-light dark:bg-gray-800'
                    }`}
                  >
                    <Moon size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card mb-6">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-medium">Notifications</h3>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium mb-1">Enable Notifications</h4>
                  <p className="text-sm text-text-light">
                    Receive reminders about upcoming lessons
                  </p>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notificationsEnabled}
                    onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className={notificationsEnabled ? '' : 'opacity-50 pointer-events-none'}>
                <h4 className="font-medium mb-2">Reminder Time</h4>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="input"
                  disabled={!notificationsEnabled}
                />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-medium">Profile Information</h3>
            </div>
            
            <div className="p-4">
              <form onSubmit={handleSaveProfile}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="name">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="input w-full"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input w-full"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <button type="submit" className="btn-primary">
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;