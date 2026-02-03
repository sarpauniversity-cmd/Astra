import { Play, Square, RefreshCw, Camera, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCw, Pause, Video } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';
import type { Robot } from '@/types';

interface ControlPanelSectionProps {
  robot: Robot;
}

export function ControlPanelSection({ robot }: ControlPanelSectionProps) {
  const { darkMode } = useTheme();
  const [isScanning, setIsScanning] = useState(robot.currentAction === 'scanning');
  const [cameraView, setCameraView] = useState<'front' | 'shelf' | 'overview'>('front');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={cn(
          "text-2xl font-bold",
          darkMode ? "text-white" : "text-slate-900"
        )}>Control Panel</h2>
        <p className={cn(
          "text-sm mt-1",
          darkMode ? "text-slate-400" : "text-slate-500"
        )}>Manual robot controls and live camera feed</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scan Controls */}
        <div className={cn(
          "p-6 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <h3 className={cn(
            "text-lg font-semibold mb-4",
            darkMode ? "text-white" : "text-slate-900"
          )}>Scan Controls</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setIsScanning(true)}
              disabled={isScanning}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-medium transition-all",
                isScanning
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/25"
              )}
            >
              <Play className="w-5 h-5" />
              Start Scan
            </button>
            
            <button
              onClick={() => setIsScanning(false)}
              disabled={!isScanning}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-medium transition-all",
                !isScanning
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500"
                  : "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/25"
              )}
            >
              <Square className="w-5 h-5" />
              Stop Scan
            </button>
          </div>
          
          <button className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium border transition-colors",
            darkMode 
              ? "border-slate-600 text-slate-300 hover:bg-slate-700" 
              : "border-gray-200 text-slate-700 hover:bg-gray-50"
          )}>
            <RefreshCw className="w-5 h-5" />
            Manual Rescan Current Zone
          </button>
          
          {/* Status Indicator */}
          <div className={cn(
            "mt-6 p-4 rounded-lg",
            isScanning 
              ? "bg-emerald-50 dark:bg-emerald-900/20" 
              : "bg-gray-50 dark:bg-slate-700"
          )}>
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-3 h-3 rounded-full",
                isScanning ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
              )} />
              <span className={cn(
                "text-sm font-medium",
                isScanning 
                  ? "text-emerald-700 dark:text-emerald-400" 
                  : "text-gray-600 dark:text-slate-400"
              )}>
                {isScanning ? 'Scanning in progress...' : 'Robot idle'}
              </span>
            </div>
            {isScanning && (
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className={cn(darkMode ? "text-slate-400" : "text-slate-600")}>Progress</span>
                  <span className={cn("font-medium", darkMode ? "text-white" : "text-slate-900")}>{robot.scanProgress}%</span>
                </div>
                <div className={cn(
                  "h-2 rounded-full overflow-hidden",
                  darkMode ? "bg-slate-600" : "bg-gray-200"
                )}>
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${robot.scanProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Movement Controls */}
        <div className={cn(
          "p-6 rounded-xl border",
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        )}>
          <h3 className={cn(
            "text-lg font-semibold mb-4",
            darkMode ? "text-white" : "text-slate-900"
          )}>Movement Controls</h3>
          <p className={cn(
            "text-sm mb-4",
            darkMode ? "text-slate-400" : "text-slate-500"
          )}>Manual robot navigation (for testing)</p>
          
          <div className="flex flex-col items-center gap-2">
            {/* Up */}
            <button className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center transition-colors",
              darkMode 
                ? "bg-slate-700 hover:bg-slate-600 text-slate-300" 
                : "bg-gray-100 hover:bg-gray-200 text-slate-700"
            )}>
              <ArrowUp className="w-6 h-6" />
            </button>
            
            {/* Left, Stop, Right */}
            <div className="flex gap-2">
              <button className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center transition-colors",
                darkMode 
                  ? "bg-slate-700 hover:bg-slate-600 text-slate-300" 
                  : "bg-gray-100 hover:bg-gray-200 text-slate-700"
              )}>
                <ArrowLeft className="w-6 h-6" />
              </button>
              
              <button className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center bg-red-500 hover:bg-red-600 text-white transition-colors"
              )}>
                <Pause className="w-6 h-6" />
              </button>
              
              <button className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center transition-colors",
                darkMode 
                  ? "bg-slate-700 hover:bg-slate-600 text-slate-300" 
                  : "bg-gray-100 hover:bg-gray-200 text-slate-700"
              )}>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
            
            {/* Down */}
            <button className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center transition-colors",
              darkMode 
                ? "bg-slate-700 hover:bg-slate-600 text-slate-300" 
                : "bg-gray-100 hover:bg-gray-200 text-slate-700"
            )}>
              <ArrowDown className="w-6 h-6" />
            </button>
          </div>
          
          <p className={cn(
            "text-xs text-center mt-4",
            darkMode ? "text-slate-500" : "text-slate-400"
          )}>⚠️ Manual control disabled during active scan</p>
        </div>
      </div>

      {/* Camera Controls */}
      <div className={cn(
        "p-6 rounded-xl border",
        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
      )}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={cn(
            "text-lg font-semibold",
            darkMode ? "text-white" : "text-slate-900"
          )}>Camera Arm Controls</h3>
          
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-sm",
              darkMode ? "text-slate-400" : "text-slate-500"
            )}>Current position:</span>
            <span className={cn(
              "px-2.5 py-1 rounded-full text-xs font-semibold capitalize",
              robot.cameraArmStatus === 'rotating'
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
            )}>
              {robot.cameraArmStatus}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          <button className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-xl transition-colors",
            darkMode 
              ? "bg-slate-700 hover:bg-slate-600" 
              : "bg-gray-100 hover:bg-gray-200"
          )}>
            <ArrowUp className={cn("w-6 h-6", darkMode ? "text-slate-300" : "text-slate-700")} />
            <span className={cn("text-sm font-medium", darkMode ? "text-slate-300" : "text-slate-700")}>Arm Up</span>
          </button>
          
          <button className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-xl transition-colors",
            darkMode 
              ? "bg-slate-700 hover:bg-slate-600" 
              : "bg-gray-100 hover:bg-gray-200"
          )}>
            <ArrowDown className={cn("w-6 h-6", darkMode ? "text-slate-300" : "text-slate-700")} />
            <span className={cn("text-sm font-medium", darkMode ? "text-slate-300" : "text-slate-700")}>Arm Down</span>
          </button>
          
          <button className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-xl transition-colors",
            darkMode 
              ? "bg-slate-700 hover:bg-slate-600" 
              : "bg-gray-100 hover:bg-gray-200"
          )}>
            <RotateCw className={cn("w-6 h-6", darkMode ? "text-slate-300" : "text-slate-700")} />
            <span className={cn("text-sm font-medium", darkMode ? "text-slate-300" : "text-slate-700")}>Rotate</span>
          </button>
          
          <button className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-xl transition-colors",
            darkMode 
              ? "bg-slate-700 hover:bg-slate-600" 
              : "bg-gray-100 hover:bg-gray-200"
          )}>
            <Camera className={cn("w-6 h-6", darkMode ? "text-slate-300" : "text-slate-700")} />
            <span className={cn("text-sm font-medium", darkMode ? "text-slate-300" : "text-slate-700")}>Capture</span>
          </button>
        </div>
      </div>

      {/* Live Camera Feed */}
      <div className={cn(
        "p-6 rounded-xl border",
        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
      )}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={cn(
            "text-lg font-semibold",
            darkMode ? "text-white" : "text-slate-900"
          )}>Live Camera Feed</h3>
          
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-slate-600">
              {(['front', 'shelf', 'overview'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setCameraView(view)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                    cameraView === view
                      ? "bg-indigo-600 text-white"
                      : darkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className={cn(
          "relative aspect-video rounded-xl overflow-hidden",
          darkMode ? "bg-slate-900" : "bg-gray-900"
        )}>
          {/* Placeholder for live feed */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Video className="w-16 h-16 text-slate-600 mb-4" />
            <p className="text-slate-500 text-lg font-medium">Live Camera Feed</p>
            <p className="text-slate-600 text-sm mt-1">Camera: {cameraView.charAt(0).toUpperCase() + cameraView.slice(1)} View</p>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 text-sm font-medium">LIVE</span>
            </div>
          </div>
          
          {/* Overlay info */}
          <div className="absolute top-4 left-4 flex items-center gap-3">
            <span className={cn(
              "px-2.5 py-1 rounded text-xs font-semibold",
              "bg-black/50 text-white backdrop-blur-sm"
            )}>
              {robot.currentLocation.zone} - {robot.currentLocation.aisle}
            </span>
          </div>
          
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <span className={cn(
              "px-2.5 py-1 rounded text-xs font-medium",
              "bg-black/50 text-white backdrop-blur-sm"
            )}>
              1920x1080 @ 30fps
            </span>
          </div>
        </div>
        
        <p className={cn(
          "text-xs text-center mt-4",
          darkMode ? "text-slate-500" : "text-slate-400"
        )}>Live feed will be available when ESP32 camera module is connected</p>
      </div>
    </div>
  );
}
