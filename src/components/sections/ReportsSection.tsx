import { BarChart3, Download, Calendar, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';
import type { ScanReport, Shelf } from '@/types';

interface ReportsSectionProps {
  scanReports: ScanReport[];
  stockTrendData: { date: string; zoneA: number; zoneB: number; zoneC: number; zoneD: number }[];
  shelves: Shelf[];
}

export function ReportsSection({ scanReports, stockTrendData, shelves }: ReportsSectionProps) {
  const { darkMode } = useTheme();

  const problemShelves = shelves
    .filter(s => s.status === 'empty' || s.status === 'low-stock')
    .sort((a, b) => a.stockLevel - b.stockLevel)
    .slice(0, 5);

  const totalScans = scanReports.reduce((acc, r) => acc + r.totalScans, 0);
  const totalIssues = scanReports.reduce((acc, r) => acc + r.issuesFound, 0);
  const avgStockLevel = Math.round(scanReports.reduce((acc, r) => acc + r.avgStockLevel, 0) / scanReports.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={cn(
            "text-2xl font-bold",
            darkMode ? "text-white" : "text-slate-900"
          )}>Reports & Analytics</h2>
          <p className={cn(
            "text-sm mt-1",
            darkMode ? "text-slate-400" : "text-slate-500"
          )}>Scan reports and stock analytics</p>
        </div>
        
        <div className="flex gap-3">
          <button className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors",
            darkMode 
              ? "border-slate-600 text-slate-300 hover:bg-slate-800" 
              : "border-gray-200 text-slate-700 hover:bg-gray-50"
          )}>
            <Calendar className="w-4 h-4" />
            This Week
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={cn(
          "p-6 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className={cn("w-5 h-5", darkMode ? "text-indigo-400" : "text-indigo-600")} />
            <span className={cn("text-sm", darkMode ? "text-slate-400" : "text-slate-500")}>
              Total Scans (Week)
            </span>
          </div>
          <p className={cn("text-3xl font-bold", darkMode ? "text-white" : "text-slate-900")}>
            {totalScans.toLocaleString()}
          </p>
          <p className="text-sm text-emerald-500 mt-1">↑ 12% from last week</p>
        </div>

        <div className={cn(
          "p-6 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className={cn("w-5 h-5", darkMode ? "text-amber-400" : "text-amber-600")} />
            <span className={cn("text-sm", darkMode ? "text-slate-400" : "text-slate-500")}>
              Issues Found
            </span>
          </div>
          <p className={cn("text-3xl font-bold", darkMode ? "text-white" : "text-slate-900")}>
            {totalIssues}
          </p>
          <p className="text-sm text-emerald-500 mt-1">↓ 8% from last week</p>
        </div>

        <div className={cn(
          "p-6 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className={cn("w-5 h-5", darkMode ? "text-emerald-400" : "text-emerald-600")} />
            <span className={cn("text-sm", darkMode ? "text-slate-400" : "text-slate-500")}>
              Avg. Stock Level
            </span>
          </div>
          <p className={cn("text-3xl font-bold", darkMode ? "text-white" : "text-slate-900")}>
            {avgStockLevel}%
          </p>
          <p className="text-sm text-emerald-500 mt-1">↑ 3% from last week</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Scans */}
        <div className={cn(
          "p-6 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <h3 className={cn(
            "text-lg font-semibold mb-6",
            darkMode ? "text-white" : "text-slate-900"
          )}>Daily Scan Activity</h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scanReports}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e5e7eb'} />
                <XAxis dataKey="date" stroke={darkMode ? '#94a3b8' : '#6b7280'} fontSize={12} />
                <YAxis stroke={darkMode ? '#94a3b8' : '#6b7280'} fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                    border: darkMode ? '1px solid #334155' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="totalScans" fill="#6366f1" radius={[4, 4, 0, 0]} name="Total Scans" />
                <Bar dataKey="issuesFound" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Issues Found" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Trends */}
        <div className={cn(
          "p-6 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <h3 className={cn(
            "text-lg font-semibold mb-6",
            darkMode ? "text-white" : "text-slate-900"
          )}>Stock Trends by Zone</h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stockTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e5e7eb'} />
                <XAxis dataKey="date" stroke={darkMode ? '#94a3b8' : '#6b7280'} fontSize={12} />
                <YAxis stroke={darkMode ? '#94a3b8' : '#6b7280'} fontSize={12} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                    border: darkMode ? '1px solid #334155' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="zoneA" stroke="#6366f1" strokeWidth={2} name="Zone A" />
                <Line type="monotone" dataKey="zoneB" stroke="#10b981" strokeWidth={2} name="Zone B" />
                <Line type="monotone" dataKey="zoneC" stroke="#f59e0b" strokeWidth={2} name="Zone C" />
                <Line type="monotone" dataKey="zoneD" stroke="#ef4444" strokeWidth={2} name="Zone D" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Problem Shelves */}
      <div className={cn(
        "p-6 rounded-xl border",
        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
      )}>
        <h3 className={cn(
          "text-lg font-semibold mb-4",
          darkMode ? "text-white" : "text-slate-900"
        )}>Critical Shelves - Needs Attention</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn(
                "border-b",
                darkMode ? "border-slate-700" : "border-gray-200"
              )}>
                <th className={cn(
                  "text-left py-3 px-4 text-sm font-semibold",
                  darkMode ? "text-slate-400" : "text-slate-600"
                )}>Shelf ID</th>
                <th className={cn(
                  "text-left py-3 px-4 text-sm font-semibold",
                  darkMode ? "text-slate-400" : "text-slate-600"
                )}>Zone</th>
                <th className={cn(
                  "text-left py-3 px-4 text-sm font-semibold",
                  darkMode ? "text-slate-400" : "text-slate-600"
                )}>Aisle</th>
                <th className={cn(
                  "text-left py-3 px-4 text-sm font-semibold",
                  darkMode ? "text-slate-400" : "text-slate-600"
                )}>Status</th>
                <th className={cn(
                  "text-left py-3 px-4 text-sm font-semibold",
                  darkMode ? "text-slate-400" : "text-slate-600"
                )}>Stock Level</th>
              </tr>
            </thead>
            <tbody>
              {problemShelves.map((shelf) => (
                <tr key={shelf.id} className={cn(
                  "border-b",
                  darkMode ? "border-slate-700" : "border-gray-100"
                )}>
                  <td className={cn(
                    "py-3 px-4 text-sm font-medium",
                    darkMode ? "text-white" : "text-slate-900"
                  )}>{shelf.id}</td>
                  <td className={cn(
                    "py-3 px-4 text-sm",
                    darkMode ? "text-slate-300" : "text-slate-600"
                  )}>{shelf.zone}</td>
                  <td className={cn(
                    "py-3 px-4 text-sm",
                    darkMode ? "text-slate-300" : "text-slate-600"
                  )}>{shelf.aisle}</td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-semibold",
                      shelf.status === 'empty' 
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    )}>
                      {shelf.status === 'empty' ? 'Empty' : 'Low Stock'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-20 h-2 rounded-full overflow-hidden",
                        darkMode ? "bg-slate-700" : "bg-gray-200"
                      )}>
                        <div
                          className={cn(
                            "h-full rounded-full",
                            shelf.stockLevel === 0 ? "bg-red-500" : "bg-amber-500"
                          )}
                          style={{ width: `${shelf.stockLevel}%` }}
                        />
                      </div>
                      <span className={cn(
                        "text-sm font-medium",
                        darkMode ? "text-slate-300" : "text-slate-700"
                      )}>{shelf.stockLevel}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
