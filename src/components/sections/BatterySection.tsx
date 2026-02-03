import { Battery, Zap, Clock, TrendingDown } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';
import type { Robot, BatteryDataPoint } from '@/types';
import { getBatteryColor, getBatteryBgColor } from '@/utils/helpers';

interface BatterySectionProps {
  robot: Robot;
  batteryHistory: BatteryDataPoint[];
}

export function BatterySection({ robot, batteryHistory }: BatterySectionProps) {
  const { darkMode } = useTheme();

  const avgDrainRate = 5.2; // % per hour
  const estimatedRuntime = Math.round(robot.batteryPercentage / avgDrainRate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={cn(
          "text-2xl font-bold",
          darkMode ? "text-white" : "text-slate-900"
        )}>Battery & Power</h2>
        <p className={cn(
          "text-sm mt-1",
          darkMode ? "text-slate-400" : "text-slate-500"
        )}>Monitor battery status and power consumption</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Battery */}
        <div className={cn(
          "p-6 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center justify-between mb-4">
            <Battery className={cn("w-8 h-8", getBatteryColor(robot.batteryPercentage))} />
            <span className={cn(
              "px-2.5 py-1 rounded-full text-xs font-semibold",
              robot.chargingStatus === 'charging' 
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
            )}>
              {robot.chargingStatus === 'charging' ? '⚡ Charging' : 'On Battery'}
            </span>
          </div>
          <p className={cn(
            "text-4xl font-bold",
            getBatteryColor(robot.batteryPercentage)
          )}>{robot.batteryPercentage}%</p>
          <p className={cn(
            "text-sm mt-1",
            darkMode ? "text-slate-400" : "text-slate-500"
          )}>Current Level</p>
          
          {/* Battery Bar */}
          <div className={cn(
            "h-3 rounded-full overflow-hidden mt-4",
            darkMode ? "bg-slate-700" : "bg-gray-200"
          )}>
            <div
              className={cn("h-full rounded-full transition-all", getBatteryBgColor(robot.batteryPercentage))}
              style={{ width: `${robot.batteryPercentage}%` }}
            />
          </div>
        </div>

        {/* Charging Status */}
        <div className={cn(
          "p-6 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center gap-3 mb-4">
            <div className={cn(
              "p-2 rounded-lg",
              robot.chargingStatus === 'charging'
                ? "bg-emerald-100 dark:bg-emerald-900/30"
                : "bg-gray-100 dark:bg-gray-800"
            )}>
              <Zap className={cn(
                "w-6 h-6",
                robot.chargingStatus === 'charging' ? "text-emerald-500" : "text-gray-500"
              )} />
            </div>
          </div>
          <p className={cn(
            "text-2xl font-bold capitalize",
            darkMode ? "text-white" : "text-slate-900"
          )}>{robot.chargingStatus}</p>
          <p className={cn(
            "text-sm mt-1",
            darkMode ? "text-slate-400" : "text-slate-500"
          )}>Power Status</p>
        </div>

        {/* Estimated Runtime */}
        <div className={cn(
          "p-6 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center gap-3 mb-4">
            <div className={cn(
              "p-2 rounded-lg",
              darkMode ? "bg-slate-700" : "bg-blue-50"
            )}>
              <Clock className={cn("w-6 h-6", darkMode ? "text-blue-400" : "text-blue-600")} />
            </div>
          </div>
          <p className={cn(
            "text-2xl font-bold",
            darkMode ? "text-white" : "text-slate-900"
          )}>{estimatedRuntime}h</p>
          <p className={cn(
            "text-sm mt-1",
            darkMode ? "text-slate-400" : "text-slate-500"
          )}>Estimated Runtime</p>
        </div>

        {/* Drain Rate */}
        <div className={cn(
          "p-6 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center gap-3 mb-4">
            <div className={cn(
              "p-2 rounded-lg",
              darkMode ? "bg-slate-700" : "bg-amber-50"
            )}>
              <TrendingDown className={cn("w-6 h-6", darkMode ? "text-amber-400" : "text-amber-600")} />
            </div>
          </div>
          <p className={cn(
            "text-2xl font-bold",
            darkMode ? "text-white" : "text-slate-900"
          )}>{avgDrainRate}%/h</p>
          <p className={cn(
            "text-sm mt-1",
            darkMode ? "text-slate-400" : "text-slate-500"
          )}>Avg. Drain Rate</p>
        </div>
      </div>

      {/* Battery History Chart */}
      <div className={cn(
        "p-6 rounded-xl border",
        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
      )}>
        <h3 className={cn(
          "text-lg font-semibold mb-6",
          darkMode ? "text-white" : "text-slate-900"
        )}>Battery Level Over Time</h3>
        
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={batteryHistory}>
              <defs>
                <linearGradient id="batteryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e5e7eb'} />
              <XAxis 
                dataKey="time" 
                stroke={darkMode ? '#94a3b8' : '#6b7280'}
                fontSize={12}
              />
              <YAxis 
                domain={[0, 100]} 
                stroke={darkMode ? '#94a3b8' : '#6b7280'}
                fontSize={12}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                  border: darkMode ? '1px solid #334155' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: darkMode ? '#f1f5f9' : '#1e293b' }}
              />
              <Area 
                type="monotone" 
                dataKey="percentage" 
                stroke="#6366f1" 
                strokeWidth={2}
                fill="url(#batteryGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Battery Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={cn(
          "p-6 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <h3 className={cn(
            "text-lg font-semibold mb-4",
            darkMode ? "text-white" : "text-slate-900"
          )}>Battery Health</h3>
          
          <div className="space-y-4">
            {[
              { label: 'Overall Health', value: 94, status: 'Good' },
              { label: 'Charge Cycles', value: 127, status: 'Normal' },
              { label: 'Temperature', value: 32, status: '32°C' },
              { label: 'Capacity', value: 96, status: '96%' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className={cn(
                  "text-sm",
                  darkMode ? "text-slate-400" : "text-slate-600"
                )}>{item.label}</span>
                <span className={cn(
                  "text-sm font-semibold",
                  darkMode ? "text-white" : "text-slate-900"
                )}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={cn(
          "p-6 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <h3 className={cn(
            "text-lg font-semibold mb-4",
            darkMode ? "text-white" : "text-slate-900"
          )}>Power Recommendations</h3>
          
          <div className="space-y-3">
            <div className={cn(
              "p-3 rounded-lg",
              darkMode ? "bg-slate-700" : "bg-blue-50"
            )}>
              <p className={cn(
                "text-sm font-medium",
                darkMode ? "text-blue-400" : "text-blue-700"
              )}>💡 Schedule charging during low-activity periods</p>
            </div>
            <div className={cn(
              "p-3 rounded-lg",
              darkMode ? "bg-slate-700" : "bg-emerald-50"
            )}>
              <p className={cn(
                "text-sm font-medium",
                darkMode ? "text-emerald-400" : "text-emerald-700"
              )}>✓ Battery performing optimally</p>
            </div>
            <div className={cn(
              "p-3 rounded-lg",
              darkMode ? "bg-slate-700" : "bg-amber-50"
            )}>
              <p className={cn(
                "text-sm font-medium",
                darkMode ? "text-amber-400" : "text-amber-700"
              )}>⚠️ Consider replacing battery at 500 cycles</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
