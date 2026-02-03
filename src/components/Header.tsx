import { Bell, Moon, Sun, Wifi, WifiOff, ChevronDown } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import type { Robot, Warehouse, Alert } from '@/types';
import { cn } from '@/utils/cn';

interface HeaderProps {
  robot: Robot;
  warehouse: Warehouse;
  warehouses: Warehouse[];
  alerts: Alert[];
  onWarehouseChange: (id: string) => void;
}

export function Header({ robot, warehouse, warehouses, alerts, onWarehouseChange }: HeaderProps) {
  const { darkMode, toggleDarkMode } = useTheme();
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;

  return (
    <header className={cn(
      "sticky top-0 z-50 border-b px-6 py-4",
      darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className={cn(
                "text-xl font-bold tracking-tight",
                darkMode ? "text-white" : "text-slate-900"
              )}>
                ASTRA
              </h1>
              <p className={cn(
                "text-xs",
                darkMode ? "text-slate-400" : "text-slate-500"
              )}>AI Warehouse Monitoring</p>
            </div>
          </div>
          
          <div className={cn(
            "h-8 w-px",
            darkMode ? "bg-slate-700" : "bg-gray-200"
          )} />
          
          <div className="relative">
            <select
              value={warehouse.id}
              onChange={(e) => onWarehouseChange(e.target.value)}
              className={cn(
                "appearance-none pl-4 pr-10 py-2 rounded-lg text-sm font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500",
                darkMode 
                  ? "bg-slate-800 border-slate-600 text-white" 
                  : "bg-gray-50 border-gray-200 text-slate-700"
              )}
            >
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
            <ChevronDown className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none",
              darkMode ? "text-slate-400" : "text-slate-500"
            )} />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
            robot.wifiConnected 
              ? (darkMode ? "bg-emerald-900/50 text-emerald-400" : "bg-emerald-50 text-emerald-700")
              : (darkMode ? "bg-red-900/50 text-red-400" : "bg-red-50 text-red-700")
          )}>
            {robot.wifiConnected ? (
              <Wifi className="w-4 h-4" />
            ) : (
              <WifiOff className="w-4 h-4" />
            )}
            <span>{robot.wifiConnected ? 'Connected' : 'Offline'}</span>
          </div>
          
          <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <Bell className={cn("w-5 h-5", darkMode ? "text-slate-400" : "text-slate-600")} />
            {unacknowledgedAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unacknowledgedAlerts}
              </span>
            )}
          </button>
          
          <button
            onClick={toggleDarkMode}
            className={cn(
              "p-2 rounded-lg transition-colors",
              darkMode ? "hover:bg-slate-800" : "hover:bg-gray-100"
            )}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-slate-700">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">OP</span>
            </div>
            <div className="hidden sm:block">
              <p className={cn(
                "text-sm font-medium",
                darkMode ? "text-white" : "text-slate-900"
              )}>Operator</p>
              <p className={cn(
                "text-xs",
                darkMode ? "text-slate-400" : "text-slate-500"
              )}>Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
