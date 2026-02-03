import { Bot, MapPin, Camera, Activity, Zap, RotateCw } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';
import type { Robot } from '@/types';
import { formatTimeAgo, getBatteryColor } from '@/utils/helpers';

interface RobotStatusSectionProps {
  robot: Robot;
}

export function RobotStatusSection({ robot }: RobotStatusSectionProps) {
  const { darkMode } = useTheme();

  const actionColors = {
    scanning: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30',
    moving: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
    idle: 'text-gray-500 bg-gray-100 dark:bg-gray-800',
    charging: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30',
  };

  const cameraStatusColors = {
    up: 'text-emerald-500',
    down: 'text-gray-500',
    rotating: 'text-indigo-500',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={cn(
          "text-2xl font-bold",
          darkMode ? "text-white" : "text-slate-900"
        )}>Robot Status</h2>
        <p className={cn(
          "text-sm mt-1",
          darkMode ? "text-slate-400" : "text-slate-500"
        )}>Real-time monitoring of ASTRA robot</p>
      </div>

      {/* Robot Info Card */}
      <div className={cn(
        "p-6 rounded-2xl border",
        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
      )}>
        <div className="flex items-start gap-6">
          <div className={cn(
            "w-24 h-24 rounded-2xl flex items-center justify-center",
            darkMode ? "bg-slate-700" : "bg-indigo-50"
          )}>
            <Bot className={cn("w-12 h-12", darkMode ? "text-indigo-400" : "text-indigo-600")} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className={cn(
                "text-xl font-bold",
                darkMode ? "text-white" : "text-slate-900"
              )}>{robot.name}</h3>
              <span className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                robot.status === 'online' 
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              )}>
                {robot.status === 'online' ? '● Online' : '○ Offline'}
              </span>
            </div>
            <p className={cn(
              "text-sm mt-1",
              darkMode ? "text-slate-400" : "text-slate-500"
            )}>ID: {robot.id}</p>
            <p className={cn(
              "text-sm",
              darkMode ? "text-slate-400" : "text-slate-500"
            )}>Last scan: {formatTimeAgo(robot.lastScanTime)}</p>
          </div>
          
          <div className="text-right">
            <p className={cn(
              "text-sm",
              darkMode ? "text-slate-400" : "text-slate-500"
            )}>Battery</p>
            <p className={cn("text-3xl font-bold", getBatteryColor(robot.batteryPercentage))}>
              {robot.batteryPercentage}%
            </p>
          </div>
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Location */}
        <div className={cn(
          "p-5 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              "p-2 rounded-lg",
              darkMode ? "bg-slate-700" : "bg-blue-50"
            )}>
              <MapPin className={cn("w-5 h-5", darkMode ? "text-blue-400" : "text-blue-600")} />
            </div>
            <span className={cn(
              "text-sm font-medium",
              darkMode ? "text-slate-400" : "text-slate-500"
            )}>Current Location</span>
          </div>
          <p className={cn(
            "text-xl font-bold",
            darkMode ? "text-white" : "text-slate-900"
          )}>{robot.currentLocation.zone}</p>
          <p className={cn(
            "text-sm",
            darkMode ? "text-slate-400" : "text-slate-600"
          )}>{robot.currentLocation.aisle}</p>
        </div>

        {/* Current Action */}
        <div className={cn(
          "p-5 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              "p-2 rounded-lg",
              darkMode ? "bg-slate-700" : "bg-purple-50"
            )}>
              <Activity className={cn("w-5 h-5", darkMode ? "text-purple-400" : "text-purple-600")} />
            </div>
            <span className={cn(
              "text-sm font-medium",
              darkMode ? "text-slate-400" : "text-slate-500"
            )}>Current Action</span>
          </div>
          <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold capitalize",
            actionColors[robot.currentAction]
          )}>
            {robot.currentAction === 'scanning' && <RotateCw className="w-4 h-4 animate-spin" />}
            {robot.currentAction}
          </div>
        </div>

        {/* Camera Status */}
        <div className={cn(
          "p-5 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              "p-2 rounded-lg",
              darkMode ? "bg-slate-700" : "bg-amber-50"
            )}>
              <Camera className={cn("w-5 h-5", darkMode ? "text-amber-400" : "text-amber-600")} />
            </div>
            <span className={cn(
              "text-sm font-medium",
              darkMode ? "text-slate-400" : "text-slate-500"
            )}>Camera Arm</span>
          </div>
          <p className={cn(
            "text-xl font-bold capitalize",
            cameraStatusColors[robot.cameraArmStatus]
          )}>{robot.cameraArmStatus}</p>
          <p className={cn(
            "text-sm",
            darkMode ? "text-slate-400" : "text-slate-600"
          )}>Position status</p>
        </div>

        {/* Charging Status */}
        <div className={cn(
          "p-5 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              "p-2 rounded-lg",
              darkMode ? "bg-slate-700" : "bg-emerald-50"
            )}>
              <Zap className={cn("w-5 h-5", darkMode ? "text-emerald-400" : "text-emerald-600")} />
            </div>
            <span className={cn(
              "text-sm font-medium",
              darkMode ? "text-slate-400" : "text-slate-500"
            )}>Power Status</span>
          </div>
          <p className={cn(
            "text-xl font-bold capitalize",
            robot.chargingStatus === 'charging' ? "text-emerald-500" : 
            robot.chargingStatus === 'full' ? "text-blue-500" : "text-amber-500"
          )}>{robot.chargingStatus}</p>
          <p className={cn(
            "text-sm",
            darkMode ? "text-slate-400" : "text-slate-600"
          )}>
            {robot.chargingStatus === 'charging' ? 'Connected to charger' : 
             robot.chargingStatus === 'full' ? 'Battery full' : 'On battery power'}
          </p>
        </div>
      </div>

      {/* Scan Progress */}
      <div className={cn(
        "p-6 rounded-xl border",
        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
      )}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={cn(
            "text-lg font-semibold",
            darkMode ? "text-white" : "text-slate-900"
          )}>Current Scan Progress</h3>
          <span className={cn(
            "text-2xl font-bold",
            darkMode ? "text-indigo-400" : "text-indigo-600"
          )}>{robot.scanProgress}%</span>
        </div>
        
        <div className={cn(
          "h-4 rounded-full overflow-hidden",
          darkMode ? "bg-slate-700" : "bg-gray-200"
        )}>
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${robot.scanProgress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <p className={cn(
            "text-sm",
            darkMode ? "text-slate-400" : "text-slate-500"
          )}>Scanning {robot.currentLocation.zone} - {robot.currentLocation.aisle}</p>
          <p className={cn(
            "text-sm",
            darkMode ? "text-slate-400" : "text-slate-500"
          )}>Est. completion: ~5 min</p>
        </div>
      </div>

      {/* Robot Visualization */}
      <div className={cn(
        "p-6 rounded-xl border",
        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
      )}>
        <h3 className={cn(
          "text-lg font-semibold mb-4",
          darkMode ? "text-white" : "text-slate-900"
        )}>Warehouse Map</h3>
        
        <div className={cn(
          "relative h-64 rounded-lg overflow-hidden",
          darkMode ? "bg-slate-900" : "bg-gray-100"
        )}>
          {/* Grid */}
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1 p-2">
            {['A', 'B', 'C', 'D'].map((zone) => 
              [1, 2, 3, 4].map((aisle) => {
                const isRobotHere = robot.currentLocation.zone === `Zone ${zone}` && 
                                    robot.currentLocation.aisle === `Aisle ${aisle}`;
                return (
                  <div
                    key={`${zone}-${aisle}`}
                    className={cn(
                      "rounded-lg flex items-center justify-center text-xs font-medium transition-all",
                      isRobotHere 
                        ? "bg-indigo-500 text-white ring-4 ring-indigo-300 dark:ring-indigo-700" 
                        : darkMode ? "bg-slate-700 text-slate-400" : "bg-white text-slate-600"
                    )}
                  >
                    {isRobotHere ? (
                      <div className="text-center">
                        <Bot className="w-5 h-5 mx-auto mb-0.5" />
                        <span className="text-[10px]">ASTRA</span>
                      </div>
                    ) : (
                      <span>{zone}{aisle}</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-indigo-500" />
            <span className={cn("text-sm", darkMode ? "text-slate-400" : "text-slate-600")}>Robot Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn("w-4 h-4 rounded", darkMode ? "bg-slate-700" : "bg-white border border-gray-200")} />
            <span className={cn("text-sm", darkMode ? "text-slate-400" : "text-slate-600")}>Aisle Zone</span>
          </div>
        </div>
      </div>
    </div>
  );
}
