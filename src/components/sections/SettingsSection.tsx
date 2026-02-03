import { Save, Moon, Sun, Bell, Gauge, Clock, Building2 } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';
import type { Warehouse } from '@/types';

interface SettingsSectionProps {
  warehouses: Warehouse[];
  selectedWarehouseId: string;
  onWarehouseChange: (id: string) => void;
}

export function SettingsSection({ warehouses, selectedWarehouseId, onWarehouseChange }: SettingsSectionProps) {
  const { darkMode, toggleDarkMode } = useTheme();
  const [lowStockThreshold, setLowStockThreshold] = useState(30);
  const [criticalBatteryThreshold, setCriticalBatteryThreshold] = useState(20);
  const [scanInterval, setScanInterval] = useState(30);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={cn(
          "text-2xl font-bold",
          darkMode ? "text-white" : "text-slate-900"
        )}>Settings</h2>
        <p className={cn(
          "text-sm mt-1",
          darkMode ? "text-slate-400" : "text-slate-500"
        )}>Configure dashboard preferences and alert thresholds</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance */}
        <div className={cn(
          "p-6 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center gap-3 mb-6">
            {darkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <h3 className={cn(
              "text-lg font-semibold",
              darkMode ? "text-white" : "text-slate-900"
            )}>Appearance</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={cn(
                  "font-medium",
                  darkMode ? "text-white" : "text-slate-900"
                )}>Dark Mode</p>
                <p className={cn(
                  "text-sm",
                  darkMode ? "text-slate-400" : "text-slate-500"
                )}>Switch between light and dark themes</p>
              </div>
              <button
                onClick={toggleDarkMode}
                className={cn(
                  "relative w-14 h-7 rounded-full transition-colors",
                  darkMode ? "bg-indigo-600" : "bg-gray-300"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform",
                  darkMode ? "translate-x-8" : "translate-x-1"
                )} />
              </button>
            </div>
          </div>
        </div>

        {/* Warehouse Selection */}
        <div className={cn(
          "p-6 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center gap-3 mb-6">
            <Building2 className={cn("w-5 h-5", darkMode ? "text-indigo-400" : "text-indigo-600")} />
            <h3 className={cn(
              "text-lg font-semibold",
              darkMode ? "text-white" : "text-slate-900"
            )}>Warehouse Selection</h3>
          </div>
          
          <div className="space-y-3">
            {warehouses.map((warehouse) => (
              <button
                key={warehouse.id}
                onClick={() => onWarehouseChange(warehouse.id)}
                className={cn(
                  "w-full p-4 rounded-lg border text-left transition-all",
                  selectedWarehouseId === warehouse.id
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                    : darkMode 
                      ? "border-slate-600 hover:border-slate-500" 
                      : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={cn(
                      "font-medium",
                      darkMode ? "text-white" : "text-slate-900"
                    )}>{warehouse.name}</p>
                    <p className={cn(
                      "text-sm",
                      darkMode ? "text-slate-400" : "text-slate-500"
                    )}>{warehouse.location}</p>
                  </div>
                  {selectedWarehouseId === warehouse.id && (
                    <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Alert Thresholds */}
        <div className={cn(
          "p-6 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center gap-3 mb-6">
            <Gauge className={cn("w-5 h-5", darkMode ? "text-indigo-400" : "text-indigo-600")} />
            <h3 className={cn(
              "text-lg font-semibold",
              darkMode ? "text-white" : "text-slate-900"
            )}>Alert Thresholds</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-slate-300" : "text-slate-700"
                )}>Low Stock Threshold</label>
                <span className={cn(
                  "text-sm font-semibold",
                  darkMode ? "text-white" : "text-slate-900"
                )}>{lowStockThreshold}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-gray-200 dark:bg-slate-700"
              />
              <p className={cn(
                "text-xs mt-1",
                darkMode ? "text-slate-500" : "text-slate-400"
              )}>Alert when stock falls below this level</p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={cn(
                  "text-sm font-medium",
                  darkMode ? "text-slate-300" : "text-slate-700"
                )}>Critical Battery Level</label>
                <span className={cn(
                  "text-sm font-semibold",
                  darkMode ? "text-white" : "text-slate-900"
                )}>{criticalBatteryThreshold}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={criticalBatteryThreshold}
                onChange={(e) => setCriticalBatteryThreshold(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-gray-200 dark:bg-slate-700"
              />
              <p className={cn(
                "text-xs mt-1",
                darkMode ? "text-slate-500" : "text-slate-400"
              )}>Alert when battery falls below this level</p>
            </div>
          </div>
        </div>

        {/* Scan Settings */}
        <div className={cn(
          "p-6 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center gap-3 mb-6">
            <Clock className={cn("w-5 h-5", darkMode ? "text-indigo-400" : "text-indigo-600")} />
            <h3 className={cn(
              "text-lg font-semibold",
              darkMode ? "text-white" : "text-slate-900"
            )}>Scan Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className={cn(
                "text-sm font-medium block mb-2",
                darkMode ? "text-slate-300" : "text-slate-700"
              )}>Auto-scan Interval (minutes)</label>
              <select
                value={scanInterval}
                onChange={(e) => setScanInterval(Number(e.target.value))}
                className={cn(
                  "w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500",
                  darkMode 
                    ? "bg-slate-700 border-slate-600 text-white" 
                    : "bg-white border-gray-200 text-slate-900"
                )}
              >
                <option value={15}>Every 15 minutes</option>
                <option value={30}>Every 30 minutes</option>
                <option value={60}>Every hour</option>
                <option value={120}>Every 2 hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className={cn(
          "p-6 rounded-xl border lg:col-span-2",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center gap-3 mb-6">
            <Bell className={cn("w-5 h-5", darkMode ? "text-indigo-400" : "text-indigo-600")} />
            <h3 className={cn(
              "text-lg font-semibold",
              darkMode ? "text-white" : "text-slate-900"
            )}>Notification Settings</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={cn(
                  "font-medium",
                  darkMode ? "text-white" : "text-slate-900"
                )}>Email Alerts</p>
                <p className={cn(
                  "text-sm",
                  darkMode ? "text-slate-400" : "text-slate-500"
                )}>Receive critical alerts via email</p>
              </div>
              <button
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={cn(
                  "relative w-14 h-7 rounded-full transition-colors",
                  emailAlerts ? "bg-indigo-600" : "bg-gray-300 dark:bg-slate-600"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform",
                  emailAlerts ? "translate-x-8" : "translate-x-1"
                )} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className={cn(
                  "font-medium",
                  darkMode ? "text-white" : "text-slate-900"
                )}>Push Notifications</p>
                <p className={cn(
                  "text-sm",
                  darkMode ? "text-slate-400" : "text-slate-500"
                )}>Receive alerts on your device</p>
              </div>
              <button
                onClick={() => setPushAlerts(!pushAlerts)}
                className={cn(
                  "relative w-14 h-7 rounded-full transition-colors",
                  pushAlerts ? "bg-indigo-600" : "bg-gray-300 dark:bg-slate-600"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform",
                  pushAlerts ? "translate-x-8" : "translate-x-1"
                )} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/25">
          <Save className="w-5 h-5" />
          Save Settings
        </button>
      </div>

      {/* API Info */}
      <div className={cn(
        "p-6 rounded-xl border",
        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
      )}>
        <h3 className={cn(
          "text-lg font-semibold mb-4",
          darkMode ? "text-white" : "text-slate-900"
        )}>API Configuration</h3>
        <p className={cn(
          "text-sm mb-4",
          darkMode ? "text-slate-400" : "text-slate-500"
        )}>Connect to your Google Sheets backend for real-time data</p>
        
        <div className={cn(
          "p-4 rounded-lg font-mono text-sm",
          darkMode ? "bg-slate-900 text-slate-300" : "bg-gray-50 text-slate-700"
        )}>
          <p className="text-indigo-500">// Expected API endpoint</p>
          <p>GET /api/shelves → Shelf data</p>
          <p>GET /api/robot → Robot status</p>
          <p>GET /api/alerts → Alert list</p>
          <p>POST /api/scan → Trigger scan</p>
        </div>
        
        <p className={cn(
          "text-xs mt-4",
          darkMode ? "text-slate-500" : "text-slate-400"
        )}>Fields: Timestamp, Robot ID, Shelf ID, Shelf Status, Stock Level, Battery %, Alert Type, Image URL</p>
      </div>
    </div>
  );
}
