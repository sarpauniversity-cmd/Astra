import { CheckCircle, Filter, Bell } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';
import type { Alert, AlertSeverity } from '@/types';
import { formatDate, getSeverityColor, getAlertTypeIcon } from '@/utils/helpers';

interface AlertsSectionProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
}

export function AlertsSection({ alerts, onAcknowledge }: AlertsSectionProps) {
  const { darkMode } = useTheme();
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'all'>('all');
  const [showAcknowledged, setShowAcknowledged] = useState(false);
  
  const filteredAlerts = alerts
    .filter(a => showAcknowledged ? true : !a.acknowledged)
    .filter(a => severityFilter === 'all' ? true : a.severity === severityFilter);

  const alertStats = {
    critical: alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length,
    high: alerts.filter(a => a.severity === 'high' && !a.acknowledged).length,
    medium: alerts.filter(a => a.severity === 'medium' && !a.acknowledged).length,
    low: alerts.filter(a => a.severity === 'low' && !a.acknowledged).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={cn(
          "text-2xl font-bold",
          darkMode ? "text-white" : "text-slate-900"
        )}>Alerts & Notifications</h2>
        <p className={cn(
          "text-sm mt-1",
          darkMode ? "text-slate-400" : "text-slate-500"
        )}>Monitor and manage system alerts</p>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Critical', count: alertStats.critical, color: 'red' },
          { label: 'High', count: alertStats.high, color: 'orange' },
          { label: 'Medium', count: alertStats.medium, color: 'amber' },
          { label: 'Low', count: alertStats.low, color: 'blue' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={cn(
              "p-4 rounded-xl border",
              darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={cn(
                "w-3 h-3 rounded-full",
                stat.color === 'red' && "bg-red-500",
                stat.color === 'orange' && "bg-orange-500",
                stat.color === 'amber' && "bg-amber-500",
                stat.color === 'blue' && "bg-blue-500",
              )} />
              <span className={cn(
                "text-sm font-medium",
                darkMode ? "text-slate-400" : "text-slate-500"
              )}>{stat.label}</span>
            </div>
            <p className={cn(
              "text-3xl font-bold",
              darkMode ? "text-white" : "text-slate-900"
            )}>{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={cn(
        "p-4 rounded-xl border flex flex-wrap gap-4 items-center",
        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
      )}>
        <div className="flex items-center gap-2">
          <Filter className={cn("w-4 h-4", darkMode ? "text-slate-400" : "text-slate-500")} />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as AlertSeverity | 'all')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500",
              darkMode 
                ? "bg-slate-700 border-slate-600 text-white" 
                : "bg-gray-50 border-gray-200 text-slate-700"
            )}
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showAcknowledged}
            onChange={(e) => setShowAcknowledged(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className={cn(
            "text-sm",
            darkMode ? "text-slate-300" : "text-slate-600"
          )}>Show acknowledged</span>
        </label>
      </div>

      {/* Alert List */}
      <div className={cn(
        "rounded-xl border overflow-hidden",
        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
      )}>
        <div className={cn(
          "px-4 py-3 border-b",
          darkMode ? "bg-slate-900/50 border-slate-700" : "bg-gray-50 border-gray-200"
        )}>
          <div className="grid grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wider">
            <div className={cn("col-span-1", darkMode ? "text-slate-400" : "text-slate-500")}>Type</div>
            <div className={cn("col-span-5", darkMode ? "text-slate-400" : "text-slate-500")}>Message</div>
            <div className={cn("col-span-2", darkMode ? "text-slate-400" : "text-slate-500")}>Severity</div>
            <div className={cn("col-span-2", darkMode ? "text-slate-400" : "text-slate-500")}>Time</div>
            <div className={cn("col-span-2", darkMode ? "text-slate-400" : "text-slate-500")}>Action</div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-slate-700">
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className={cn("w-12 h-12 mx-auto mb-3", darkMode ? "text-slate-600" : "text-gray-300")} />
              <p className={cn("text-sm", darkMode ? "text-slate-400" : "text-slate-500")}>
                No alerts to display
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "px-4 py-3 grid grid-cols-12 gap-4 items-center transition-colors",
                  alert.acknowledged && "opacity-60",
                  darkMode ? "hover:bg-slate-700/50" : "hover:bg-gray-50"
                )}
              >
                <div className="col-span-1 text-2xl">
                  {getAlertTypeIcon(alert.type)}
                </div>
                <div className="col-span-5">
                  <p className={cn(
                    "text-sm font-medium",
                    darkMode ? "text-white" : "text-slate-900"
                  )}>{alert.message}</p>
                  {alert.shelfId && (
                    <p className={cn(
                      "text-xs mt-0.5",
                      darkMode ? "text-slate-500" : "text-slate-400"
                    )}>Shelf: {alert.shelfId}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-semibold border capitalize",
                    getSeverityColor(alert.severity)
                  )}>
                    {alert.severity}
                  </span>
                </div>
                <div className={cn(
                  "col-span-2 text-sm",
                  darkMode ? "text-slate-400" : "text-slate-500"
                )}>
                  {formatDate(alert.timestamp)}
                </div>
                <div className="col-span-2">
                  {alert.acknowledged ? (
                    <span className="flex items-center gap-1 text-emerald-500 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Acknowledged
                    </span>
                  ) : (
                    <button
                      onClick={() => onAcknowledge(alert.id)}
                      className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
