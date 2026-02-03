import { 
  Activity, 
  Battery, 
  Wifi, 
  CheckCircle, 
  AlertCircle,
  Package,
  AlertTriangle,
  XCircle,
  Shuffle
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';
import type { Robot, Warehouse, Shelf, Alert } from '@/types';
import { formatTimeAgo, getBatteryColor, getBatteryBgColor } from '@/utils/helpers';

interface OverviewSectionProps {
  robot: Robot;
  warehouse: Warehouse;
  shelves: Shelf[];
  alerts: Alert[];
}

export function OverviewSection({ robot, warehouse, shelves, alerts }: OverviewSectionProps) {
  const { darkMode } = useTheme();
  
  const shelfStats = {
    fullyStocked: shelves.filter(s => s.status === 'fully-stocked').length,
    lowStock: shelves.filter(s => s.status === 'low-stock').length,
    empty: shelves.filter(s => s.status === 'empty').length,
    misplaced: shelves.filter(s => s.status === 'misplaced').length,
  };
  
  const activeAlerts = alerts.filter(a => !a.acknowledged).length;

  const statCards = [
    {
      label: 'Robot Status',
      value: robot.status === 'online' ? 'Online' : 'Offline',
      icon: Activity,
      color: robot.status === 'online' ? 'emerald' : 'red',
      subtext: `Last scan: ${formatTimeAgo(robot.lastScanTime)}`,
    },
    {
      label: 'Battery Level',
      value: `${robot.batteryPercentage}%`,
      icon: Battery,
      color: robot.batteryPercentage > 60 ? 'emerald' : robot.batteryPercentage > 30 ? 'amber' : 'red',
      subtext: robot.chargingStatus === 'charging' ? 'Charging...' : 'Discharging',
    },
    {
      label: 'WiFi Status',
      value: robot.wifiConnected ? 'Connected' : 'Disconnected',
      icon: Wifi,
      color: robot.wifiConnected ? 'emerald' : 'red',
      subtext: 'IoT Network',
    },
    {
      label: 'System Health',
      value: `${warehouse.systemHealth}%`,
      icon: CheckCircle,
      color: warehouse.systemHealth > 80 ? 'emerald' : warehouse.systemHealth > 60 ? 'amber' : 'red',
      subtext: 'All systems nominal',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Warehouse Info */}
      <div className={cn(
        "p-6 rounded-2xl border",
        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
      )}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={cn(
              "text-2xl font-bold",
              darkMode ? "text-white" : "text-slate-900"
            )}>{warehouse.name}</h2>
            <p className={cn(
              "text-sm mt-1",
              darkMode ? "text-slate-400" : "text-slate-500"
            )}>{warehouse.location} • {warehouse.totalShelves} Total Shelves</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className={cn(
              "text-sm font-medium",
              darkMode ? "text-emerald-400" : "text-emerald-600"
            )}>Active Monitoring</span>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const colorClasses = {
            emerald: darkMode ? 'text-emerald-400 bg-emerald-900/30' : 'text-emerald-600 bg-emerald-50',
            amber: darkMode ? 'text-amber-400 bg-amber-900/30' : 'text-amber-600 bg-amber-50',
            red: darkMode ? 'text-red-400 bg-red-900/30' : 'text-red-600 bg-red-50',
          };
          
          return (
            <div
              key={card.label}
              className={cn(
                "p-5 rounded-xl border",
                darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className={cn(
                    "text-sm font-medium",
                    darkMode ? "text-slate-400" : "text-slate-500"
                  )}>{card.label}</p>
                  <p className={cn(
                    "text-2xl font-bold mt-1",
                    darkMode ? "text-white" : "text-slate-900"
                  )}>{card.value}</p>
                  <p className={cn(
                    "text-xs mt-1",
                    darkMode ? "text-slate-500" : "text-slate-400"
                  )}>{card.subtext}</p>
                </div>
                <div className={cn(
                  "p-2.5 rounded-lg",
                  colorClasses[card.color as keyof typeof colorClasses]
                )}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shelf Status Overview & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shelf Status */}
        <div className={cn(
          "p-6 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <h3 className={cn(
            "text-lg font-semibold mb-4",
            darkMode ? "text-white" : "text-slate-900"
          )}>Shelf Status Overview</h3>
          
          <div className="space-y-4">
            {[
              { label: 'Fully Stocked', count: shelfStats.fullyStocked, icon: Package, color: 'emerald' },
              { label: 'Low Stock', count: shelfStats.lowStock, icon: AlertTriangle, color: 'amber' },
              { label: 'Empty', count: shelfStats.empty, icon: XCircle, color: 'red' },
              { label: 'Misplaced Items', count: shelfStats.misplaced, icon: Shuffle, color: 'purple' },
            ].map((item) => {
              const Icon = item.icon;
              const percentage = (item.count / shelves.length) * 100;
              const bgColors = {
                emerald: 'bg-emerald-500',
                amber: 'bg-amber-500',
                red: 'bg-red-500',
                purple: 'bg-purple-500',
              };
              
              return (
                <div key={item.label} className="flex items-center gap-4">
                  <div className={cn(
                    "p-2 rounded-lg",
                    darkMode ? "bg-slate-700" : "bg-gray-100"
                  )}>
                    <Icon className={cn(
                      "w-4 h-4",
                      item.color === 'emerald' && (darkMode ? "text-emerald-400" : "text-emerald-600"),
                      item.color === 'amber' && (darkMode ? "text-amber-400" : "text-amber-600"),
                      item.color === 'red' && (darkMode ? "text-red-400" : "text-red-600"),
                      item.color === 'purple' && (darkMode ? "text-purple-400" : "text-purple-600"),
                    )} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn(
                        "text-sm font-medium",
                        darkMode ? "text-slate-300" : "text-slate-700"
                      )}>{item.label}</span>
                      <span className={cn(
                        "text-sm font-semibold",
                        darkMode ? "text-white" : "text-slate-900"
                      )}>{item.count}</span>
                    </div>
                    <div className={cn(
                      "h-2 rounded-full overflow-hidden",
                      darkMode ? "bg-slate-700" : "bg-gray-200"
                    )}>
                      <div
                        className={cn("h-full rounded-full transition-all", bgColors[item.color as keyof typeof bgColors])}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Alerts */}
        <div className={cn(
          "p-6 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={cn(
              "text-lg font-semibold",
              darkMode ? "text-white" : "text-slate-900"
            )}>Active Alerts</h3>
            {activeAlerts > 0 && (
              <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                {activeAlerts} Active
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            {alerts.filter(a => !a.acknowledged).slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "p-3 rounded-lg border-l-4 flex items-start gap-3",
                  alert.severity === 'critical' && (darkMode ? "bg-red-900/20 border-red-500" : "bg-red-50 border-red-500"),
                  alert.severity === 'high' && (darkMode ? "bg-orange-900/20 border-orange-500" : "bg-orange-50 border-orange-500"),
                  alert.severity === 'medium' && (darkMode ? "bg-amber-900/20 border-amber-500" : "bg-amber-50 border-amber-500"),
                  alert.severity === 'low' && (darkMode ? "bg-blue-900/20 border-blue-500" : "bg-blue-50 border-blue-500"),
                )}
              >
                <AlertCircle className={cn(
                  "w-5 h-5 mt-0.5 flex-shrink-0",
                  alert.severity === 'critical' && "text-red-500",
                  alert.severity === 'high' && "text-orange-500",
                  alert.severity === 'medium' && "text-amber-500",
                  alert.severity === 'low' && "text-blue-500",
                )} />
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium truncate",
                    darkMode ? "text-white" : "text-slate-900"
                  )}>{alert.message}</p>
                  <p className={cn(
                    "text-xs mt-0.5",
                    darkMode ? "text-slate-400" : "text-slate-500"
                  )}>{formatTimeAgo(alert.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Robot Quick Status */}
      <div className={cn(
        "p-6 rounded-xl border",
        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
      )}>
        <h3 className={cn(
          "text-lg font-semibold mb-4",
          darkMode ? "text-white" : "text-slate-900"
        )}>Robot Quick Status</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={cn(
            "p-4 rounded-lg",
            darkMode ? "bg-slate-700" : "bg-gray-50"
          )}>
            <p className={cn(
              "text-xs font-medium uppercase tracking-wider mb-1",
              darkMode ? "text-slate-400" : "text-slate-500"
            )}>Location</p>
            <p className={cn(
              "text-lg font-semibold",
              darkMode ? "text-white" : "text-slate-900"
            )}>{robot.currentLocation.zone}</p>
            <p className={cn(
              "text-sm",
              darkMode ? "text-slate-400" : "text-slate-600"
            )}>{robot.currentLocation.aisle}</p>
          </div>
          
          <div className={cn(
            "p-4 rounded-lg",
            darkMode ? "bg-slate-700" : "bg-gray-50"
          )}>
            <p className={cn(
              "text-xs font-medium uppercase tracking-wider mb-1",
              darkMode ? "text-slate-400" : "text-slate-500"
            )}>Current Action</p>
            <p className={cn(
              "text-lg font-semibold capitalize",
              darkMode ? "text-white" : "text-slate-900"
            )}>{robot.currentAction}</p>
            <p className={cn(
              "text-sm",
              darkMode ? "text-slate-400" : "text-slate-600"
            )}>Camera: {robot.cameraArmStatus}</p>
          </div>
          
          <div className={cn(
            "p-4 rounded-lg",
            darkMode ? "bg-slate-700" : "bg-gray-50"
          )}>
            <p className={cn(
              "text-xs font-medium uppercase tracking-wider mb-1",
              darkMode ? "text-slate-400" : "text-slate-500"
            )}>Scan Progress</p>
            <p className={cn(
              "text-lg font-semibold",
              darkMode ? "text-white" : "text-slate-900"
            )}>{robot.scanProgress}%</p>
            <div className={cn(
              "h-1.5 rounded-full mt-2 overflow-hidden",
              darkMode ? "bg-slate-600" : "bg-gray-200"
            )}>
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${robot.scanProgress}%` }}
              />
            </div>
          </div>
          
          <div className={cn(
            "p-4 rounded-lg",
            darkMode ? "bg-slate-700" : "bg-gray-50"
          )}>
            <p className={cn(
              "text-xs font-medium uppercase tracking-wider mb-1",
              darkMode ? "text-slate-400" : "text-slate-500"
            )}>Battery</p>
            <div className="flex items-center gap-2">
              <Battery className={cn("w-6 h-6", getBatteryColor(robot.batteryPercentage))} />
              <span className={cn(
                "text-lg font-semibold",
                darkMode ? "text-white" : "text-slate-900"
              )}>{robot.batteryPercentage}%</span>
            </div>
            <div className={cn(
              "h-1.5 rounded-full mt-2 overflow-hidden",
              darkMode ? "bg-slate-600" : "bg-gray-200"
            )}>
              <div
                className={cn("h-full rounded-full transition-all", getBatteryBgColor(robot.batteryPercentage))}
                style={{ width: `${robot.batteryPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
