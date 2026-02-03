import { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  AlertTriangle, 
  Bot, 
  Battery, 
  BarChart3, 
  Brain, 
  Gamepad2, 
  Settings,
  Bell,
  Wifi,
  WifiOff,
  Activity,
  CheckCircle,
  XCircle,
  Shuffle,
  MapPin,
  Clock,
  Zap,
  TrendingDown,
  Camera,
  Play,
  Square,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Pause,
  Video,
  Save,
  Building2,
  Gauge,
  Menu,
  X,
  ChevronDown,
  Filter,
  Download,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { cn } from '@/utils/cn';

// ===== TYPES =====
type ShelfStatus = 'fully-stocked' | 'low-stock' | 'empty' | 'misplaced';
type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
type AlertType = 'low-stock' | 'empty-shelf' | 'low-battery' | 'robot-error' | 'camera-error' | 'misplaced-items';
type RobotStatus = 'online' | 'offline' | 'maintenance';
type RobotAction = 'scanning' | 'moving' | 'idle' | 'charging';

interface Shelf {
  id: string;
  zone: string;
  aisle: string;
  status: ShelfStatus;
  stockLevel: number;
  lastUpdated: string;
  imageUrl: string;
}

interface Alert {
  id: string;
  timestamp: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  shelfId?: string;
  acknowledged: boolean;
}

interface Robot {
  id: string;
  name: string;
  status: RobotStatus;
  batteryPercentage: number;
  wifiConnected: boolean;
  lastScanTime: string;
  currentLocation: { zone: string; aisle: string };
  currentAction: RobotAction;
  cameraArmStatus: 'up' | 'down' | 'rotating';
  scanProgress: number;
  chargingStatus: 'charging' | 'discharging' | 'full';
}

interface Warehouse {
  id: string;
  name: string;
  location: string;
  totalShelves: number;
  systemHealth: number;
}

// ===== MOCK DATA =====
const mockWarehouses: Warehouse[] = [
  { id: 'wh-001', name: 'Central Distribution Hub', location: 'Building A, Floor 1', totalShelves: 248, systemHealth: 94 },
  { id: 'wh-002', name: 'East Wing Storage', location: 'Building B, Floor 2', totalShelves: 156, systemHealth: 88 },
];

const mockRobot: Robot = {
  id: 'ASTRA-001',
  name: 'ASTRA Prime',
  status: 'online',
  batteryPercentage: 73,
  wifiConnected: true,
  lastScanTime: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  currentLocation: { zone: 'Zone A', aisle: 'Aisle 3' },
  currentAction: 'scanning',
  cameraArmStatus: 'rotating',
  scanProgress: 67,
  chargingStatus: 'discharging',
};

const mockShelves: Shelf[] = [
  { id: 'SH-A001', zone: 'Zone A', aisle: 'Aisle 1', status: 'fully-stocked', stockLevel: 95, lastUpdated: new Date(Date.now() - 1000 * 60 * 5).toISOString(), imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop' },
  { id: 'SH-A002', zone: 'Zone A', aisle: 'Aisle 1', status: 'low-stock', stockLevel: 32, lastUpdated: new Date(Date.now() - 1000 * 60 * 8).toISOString(), imageUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=300&fit=crop' },
  { id: 'SH-A003', zone: 'Zone A', aisle: 'Aisle 2', status: 'empty', stockLevel: 0, lastUpdated: new Date(Date.now() - 1000 * 60 * 15).toISOString(), imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=300&fit=crop' },
  { id: 'SH-B001', zone: 'Zone B', aisle: 'Aisle 1', status: 'fully-stocked', stockLevel: 88, lastUpdated: new Date(Date.now() - 1000 * 60 * 20).toISOString(), imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop' },
  { id: 'SH-B002', zone: 'Zone B', aisle: 'Aisle 2', status: 'misplaced', stockLevel: 65, lastUpdated: new Date(Date.now() - 1000 * 60 * 25).toISOString(), imageUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=300&fit=crop' },
  { id: 'SH-C001', zone: 'Zone C', aisle: 'Aisle 1', status: 'low-stock', stockLevel: 18, lastUpdated: new Date(Date.now() - 1000 * 60 * 30).toISOString(), imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=300&fit=crop' },
];

const mockAlerts: Alert[] = [
  { id: 'al-001', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), type: 'empty-shelf', severity: 'critical', message: 'Shelf SH-A003 is completely empty', shelfId: 'SH-A003', acknowledged: false },
  { id: 'al-002', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), type: 'low-stock', severity: 'high', message: 'Low stock detected on Shelf SH-A002 (32%)', shelfId: 'SH-A002', acknowledged: false },
  { id: 'al-003', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), type: 'misplaced-items', severity: 'medium', message: 'Misplaced items detected on Shelf SH-B002', shelfId: 'SH-B002', acknowledged: true },
  { id: 'al-004', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), type: 'low-battery', severity: 'medium', message: 'Robot battery at 25% - charging recommended', acknowledged: true },
];

const batteryHistory = [
  { time: '08:00', percentage: 100 },
  { time: '10:00', percentage: 88 },
  { time: '12:00', percentage: 75 },
  { time: '14:00', percentage: 85 },
  { time: '16:00', percentage: 73 },
];

const scanReports = [
  { date: 'Mon', totalScans: 145, issuesFound: 12 },
  { date: 'Tue', totalScans: 162, issuesFound: 8 },
  { date: 'Wed', totalScans: 138, issuesFound: 15 },
  { date: 'Thu', totalScans: 171, issuesFound: 6 },
  { date: 'Fri', totalScans: 156, issuesFound: 11 },
];

const stockTrendData = [
  { date: 'Week 1', zoneA: 85, zoneB: 78, zoneC: 92 },
  { date: 'Week 2', zoneA: 82, zoneB: 81, zoneC: 88 },
  { date: 'Week 3', zoneA: 78, zoneB: 76, zoneC: 85 },
  { date: 'Week 4', zoneA: 88, zoneB: 82, zoneC: 90 },
];

// ===== HELPER FUNCTIONS =====
function formatTimeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

function getBatteryColor(percentage: number): string {
  if (percentage > 60) return '#059669';
  if (percentage > 30) return '#D97706';
  return '#DC2626';
}

function getStatusColor(status: ShelfStatus): { bg: string; text: string } {
  switch (status) {
    case 'fully-stocked': return { bg: '#059669', text: '#059669' };
    case 'low-stock': return { bg: '#D97706', text: '#D97706' };
    case 'empty': return { bg: '#DC2626', text: '#DC2626' };
    case 'misplaced': return { bg: '#7C3AED', text: '#7C3AED' };
    default: return { bg: '#6B7280', text: '#6B7280' };
  }
}

function getStatusLabel(status: ShelfStatus): string {
  switch (status) {
    case 'fully-stocked': return 'Fully Stocked';
    case 'low-stock': return 'Low Stock';
    case 'empty': return 'Empty';
    case 'misplaced': return 'Misplaced';
    default: return 'Unknown';
  }
}

// ===== COMPONENTS =====

// Logo Component
function AstraLogo({ className = '' }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div className="w-12 h-12 rounded-2xl neu-extruded-sm flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6C63FF] to-[#8B84FF] opacity-90" />
        <div className="relative z-10 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white rounded-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Navigation Items
const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'shelves', label: 'Shelves', icon: Package },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'robot', label: 'Robot', icon: Bot },
  { id: 'battery', label: 'Power', icon: Battery },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'ai', label: 'AI Insights', icon: Brain },
  { id: 'control', label: 'Control', icon: Gamepad2 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

// Main App Component
export function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(mockWarehouses[0]);
  const [alerts, setAlerts] = useState(mockAlerts);

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;

  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  return (
    <div className="min-h-screen bg-[#E0E5EC]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#E0E5EC] px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo & Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-3 rounded-2xl neu-btn"
            >
              {sidebarOpen ? <X className="w-5 h-5 text-[#3D4852]" /> : <Menu className="w-5 h-5 text-[#3D4852]" />}
            </button>
            
            <div className="flex items-center gap-3">
              <AstraLogo />
              <div>
                <h1 className="font-display font-extrabold text-xl tracking-tight text-[#3D4852]">
                  ASTRA
                </h1>
                <p className="text-xs text-[#6B7280] font-medium">
                  AI Warehouse Monitoring
                </p>
              </div>
            </div>
          </div>

          {/* Right: Status & Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Warehouse Selector */}
            <div className="hidden md:block relative">
              <select
                value={selectedWarehouse.id}
                onChange={(e) => setSelectedWarehouse(mockWarehouses.find(w => w.id === e.target.value) || mockWarehouses[0])}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-2xl neu-input text-sm font-medium text-[#3D4852] cursor-pointer focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 focus:ring-offset-[#E0E5EC]"
              >
                {mockWarehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
            </div>

            {/* WiFi Status */}
            <div className={cn(
              "hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl neu-extruded-sm",
              mockRobot.wifiConnected ? "text-[#059669]" : "text-[#DC2626]"
            )}>
              {mockRobot.wifiConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span className="text-sm font-semibold">{mockRobot.wifiConnected ? 'Online' : 'Offline'}</span>
            </div>

            {/* Notifications */}
            <button className="relative p-3 rounded-2xl neu-btn">
              <Bell className="w-5 h-5 text-[#3D4852]" />
              {unacknowledgedAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#DC2626] text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unacknowledgedAlerts}
                </span>
              )}
            </button>

            {/* User Avatar */}
            <div className="w-10 h-10 rounded-2xl neu-extruded-sm flex items-center justify-center bg-gradient-to-br from-[#6C63FF] to-[#8B84FF]">
              <span className="text-white font-bold text-sm">OP</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed md:sticky top-[72px] left-0 z-40 h-[calc(100vh-72px)] w-64 bg-[#E0E5EC] p-4 transition-transform duration-300 ease-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold neu-transition",
                    isActive
                      ? "neu-inset text-[#6C63FF]"
                      : "neu-extruded-sm text-[#6B7280] hover:text-[#3D4852] hover:-translate-y-0.5"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* System Status Card */}
          <div className="mt-8 p-5 rounded-[32px] neu-extruded">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-pulse" />
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">System Status</span>
            </div>
            <p className="text-sm font-bold text-[#3D4852]">All Systems Operational</p>
            <p className="text-xs text-[#6B7280] mt-1">Last check: 2 min ago</p>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 min-h-[calc(100vh-72px)]">
          {activeSection === 'overview' && (
            <OverviewSection 
              robot={mockRobot} 
              warehouse={selectedWarehouse} 
              shelves={mockShelves}
              alerts={alerts}
            />
          )}
          {activeSection === 'shelves' && <ShelfSection shelves={mockShelves} />}
          {activeSection === 'alerts' && <AlertsSection alerts={alerts} onAcknowledge={handleAcknowledge} />}
          {activeSection === 'robot' && <RobotSection robot={mockRobot} />}
          {activeSection === 'battery' && <BatterySection robot={mockRobot} />}
          {activeSection === 'reports' && <ReportsSection />}
          {activeSection === 'ai' && <AISection />}
          {activeSection === 'control' && <ControlSection robot={mockRobot} />}
          {activeSection === 'settings' && <SettingsSection warehouses={mockWarehouses} selectedWarehouse={selectedWarehouse} onWarehouseChange={setSelectedWarehouse} />}
        </main>
      </div>
    </div>
  );
}

// ===== OVERVIEW SECTION =====
function OverviewSection({ robot, warehouse, shelves, alerts }: { 
  robot: Robot; 
  warehouse: Warehouse; 
  shelves: Shelf[];
  alerts: Alert[];
}) {
  const shelfStats = {
    fullyStocked: shelves.filter(s => s.status === 'fully-stocked').length,
    lowStock: shelves.filter(s => s.status === 'low-stock').length,
    empty: shelves.filter(s => s.status === 'empty').length,
    misplaced: shelves.filter(s => s.status === 'misplaced').length,
  };
  
  const activeAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="p-6 md:p-8 rounded-[32px] neu-extruded">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight text-[#3D4852]">
              {warehouse.name}
            </h2>
            <p className="text-sm text-[#6B7280] mt-1">
              {warehouse.location} • {warehouse.totalShelves} Total Shelves
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#059669] animate-pulse" />
            <span className="text-sm font-semibold text-[#059669]">Active Monitoring</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Robot Status */}
        <div className="p-5 md:p-6 rounded-[32px] neu-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Robot Status</p>
              <p className="text-xl md:text-2xl font-bold text-[#3D4852] mt-2">
                {robot.status === 'online' ? 'Online' : 'Offline'}
              </p>
              <p className="text-xs text-[#6B7280] mt-1">Last: {formatTimeAgo(robot.lastScanTime)}</p>
            </div>
            <div className="p-3 rounded-2xl neu-icon-well">
              <Activity className={cn("w-5 h-5", robot.status === 'online' ? "text-[#059669]" : "text-[#DC2626]")} />
            </div>
          </div>
        </div>

        {/* Battery Level */}
        <div className="p-5 md:p-6 rounded-[32px] neu-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Battery</p>
              <p className="text-xl md:text-2xl font-bold mt-2" style={{ color: getBatteryColor(robot.batteryPercentage) }}>
                {robot.batteryPercentage}%
              </p>
              <p className="text-xs text-[#6B7280] mt-1 capitalize">{robot.chargingStatus}</p>
            </div>
            <div className="p-3 rounded-2xl neu-icon-well">
              <Battery className="w-5 h-5" style={{ color: getBatteryColor(robot.batteryPercentage) }} />
            </div>
          </div>
        </div>

        {/* WiFi Status */}
        <div className="p-5 md:p-6 rounded-[32px] neu-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Connection</p>
              <p className="text-xl md:text-2xl font-bold text-[#3D4852] mt-2">
                {robot.wifiConnected ? 'Connected' : 'Offline'}
              </p>
              <p className="text-xs text-[#6B7280] mt-1">IoT Network</p>
            </div>
            <div className="p-3 rounded-2xl neu-icon-well">
              {robot.wifiConnected ? (
                <Wifi className="w-5 h-5 text-[#059669]" />
              ) : (
                <WifiOff className="w-5 h-5 text-[#DC2626]" />
              )}
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="p-5 md:p-6 rounded-[32px] neu-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Health</p>
              <p className="text-xl md:text-2xl font-bold text-[#059669] mt-2">{warehouse.systemHealth}%</p>
              <p className="text-xs text-[#6B7280] mt-1">All nominal</p>
            </div>
            <div className="p-3 rounded-2xl neu-icon-well">
              <CheckCircle className="w-5 h-5 text-[#059669]" />
            </div>
          </div>
        </div>
      </div>

      {/* Shelf Status & Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shelf Status Overview */}
        <div className="p-6 md:p-8 rounded-[32px] neu-extruded">
          <h3 className="font-display font-bold text-lg text-[#3D4852] mb-6">Shelf Status Overview</h3>
          
          <div className="space-y-5">
            {[
              { label: 'Fully Stocked', count: shelfStats.fullyStocked, icon: Package, color: '#059669' },
              { label: 'Low Stock', count: shelfStats.lowStock, icon: AlertTriangle, color: '#D97706' },
              { label: 'Empty', count: shelfStats.empty, icon: XCircle, color: '#DC2626' },
              { label: 'Misplaced', count: shelfStats.misplaced, icon: Shuffle, color: '#7C3AED' },
            ].map((item) => {
              const Icon = item.icon;
              const percentage = (item.count / shelves.length) * 100;
              
              return (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl neu-icon-well">
                    <Icon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-[#3D4852]">{item.label}</span>
                      <span className="text-sm font-bold text-[#3D4852]">{item.count}</span>
                    </div>
                    <div className="h-2 rounded-full neu-progress-track overflow-hidden">
                      <div
                        className="h-full neu-progress-fill"
                        style={{ width: `${percentage}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Alerts */}
        <div className="p-6 md:p-8 rounded-[32px] neu-extruded">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-lg text-[#3D4852]">Active Alerts</h3>
            {activeAlerts.length > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-[#DC2626]">
                {activeAlerts.length} Active
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            {activeAlerts.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl neu-icon-well flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-[#059669]" />
                </div>
                <p className="text-sm font-medium text-[#6B7280]">All clear! No active alerts.</p>
              </div>
            ) : (
              activeAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-2xl neu-inset-sm flex items-start gap-3"
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                    alert.severity === 'critical' && "bg-[#DC2626]",
                    alert.severity === 'high' && "bg-[#EA580C]",
                    alert.severity === 'medium' && "bg-[#D97706]",
                    alert.severity === 'low' && "bg-[#6C63FF]"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#3D4852] truncate">{alert.message}</p>
                    <p className="text-xs text-[#6B7280] mt-1">{formatTimeAgo(alert.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Robot Quick Status */}
      <div className="p-6 md:p-8 rounded-[32px] neu-extruded">
        <h3 className="font-display font-bold text-lg text-[#3D4852] mb-6">Robot Quick Status</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl neu-inset">
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Location</p>
            <p className="text-lg font-bold text-[#3D4852]">{robot.currentLocation.zone}</p>
            <p className="text-sm text-[#6B7280]">{robot.currentLocation.aisle}</p>
          </div>
          
          <div className="p-4 rounded-2xl neu-inset">
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Action</p>
            <p className="text-lg font-bold text-[#6C63FF] capitalize">{robot.currentAction}</p>
            <p className="text-sm text-[#6B7280]">Camera: {robot.cameraArmStatus}</p>
          </div>
          
          <div className="p-4 rounded-2xl neu-inset">
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Scan Progress</p>
            <p className="text-lg font-bold text-[#3D4852]">{robot.scanProgress}%</p>
            <div className="h-1.5 rounded-full neu-progress-track mt-2 overflow-hidden">
              <div 
                className="h-full bg-[#6C63FF] rounded-full"
                style={{ width: `${robot.scanProgress}%` }}
              />
            </div>
          </div>
          
          <div className="p-4 rounded-2xl neu-inset">
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Battery</p>
            <div className="flex items-center gap-2">
              <Battery className="w-5 h-5" style={{ color: getBatteryColor(robot.batteryPercentage) }} />
              <span className="text-lg font-bold" style={{ color: getBatteryColor(robot.batteryPercentage) }}>
                {robot.batteryPercentage}%
              </span>
            </div>
            <div className="h-1.5 rounded-full neu-progress-track mt-2 overflow-hidden">
              <div 
                className="h-full rounded-full"
                style={{ width: `${robot.batteryPercentage}%`, backgroundColor: getBatteryColor(robot.batteryPercentage) }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== SHELF SECTION =====
function ShelfSection({ shelves }: { shelves: Shelf[] }) {
  const [filter, setFilter] = useState<ShelfStatus | 'all'>('all');
  const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);
  
  const filteredShelves = filter === 'all' ? shelves : shelves.filter(s => s.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl tracking-tight text-[#3D4852]">Shelf Monitoring</h2>
          <p className="text-sm text-[#6B7280] mt-1">Real-time shelf status and stock levels</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-[#6B7280]" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as ShelfStatus | 'all')}
            className="px-4 py-2.5 rounded-2xl neu-input text-sm font-medium text-[#3D4852]"
          >
            <option value="all">All Shelves</option>
            <option value="fully-stocked">Fully Stocked</option>
            <option value="low-stock">Low Stock</option>
            <option value="empty">Empty</option>
            <option value="misplaced">Misplaced</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredShelves.map((shelf) => (
          <div
            key={shelf.id}
            onClick={() => setSelectedShelf(shelf)}
            className="p-4 rounded-[32px] neu-card cursor-pointer"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 neu-inset">
              <img
                src={shelf.imageUrl}
                alt={`Shelf ${shelf.id}`}
                className="w-full h-full object-cover"
              />
              <div 
                className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: getStatusColor(shelf.status).bg }}
              >
                {getStatusLabel(shelf.status)}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#3D4852]">{shelf.id}</h3>
                <span className="text-xs text-[#6B7280]">{shelf.zone}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-3.5 h-3.5 text-[#6B7280]" />
                <span className="text-[#6B7280]">{shelf.aisle}</span>
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[#6B7280]">Stock Level</span>
                  <span className="font-bold text-[#3D4852]">{shelf.stockLevel}%</span>
                </div>
                <div className="h-2 rounded-full neu-progress-track overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ 
                      width: `${shelf.stockLevel}%`,
                      backgroundColor: getStatusColor(shelf.status).bg
                    }}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                <Clock className="w-3 h-3" />
                <span>Updated {formatTimeAgo(shelf.lastUpdated)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedShelf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30" onClick={() => setSelectedShelf(null)}>
          <div 
            className="w-full max-w-2xl p-6 md:p-8 rounded-[32px] bg-[#E0E5EC] neu-extruded-hover"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-display font-bold text-xl text-[#3D4852]">{selectedShelf.id}</h3>
                <p className="text-sm text-[#6B7280]">{selectedShelf.zone} • {selectedShelf.aisle}</p>
              </div>
              <button onClick={() => setSelectedShelf(null)} className="p-2 rounded-xl neu-btn">
                <X className="w-5 h-5 text-[#3D4852]" />
              </button>
            </div>
            
            <img
              src={selectedShelf.imageUrl}
              alt={`Shelf ${selectedShelf.id}`}
              className="w-full h-48 object-cover rounded-2xl mb-6 neu-inset"
            />
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-2xl neu-inset">
                <p className="text-sm text-[#6B7280]">Status</p>
                <p className="font-bold mt-1" style={{ color: getStatusColor(selectedShelf.status).text }}>
                  {getStatusLabel(selectedShelf.status)}
                </p>
              </div>
              <div className="p-4 rounded-2xl neu-inset">
                <p className="text-sm text-[#6B7280]">Stock Level</p>
                <p className="text-2xl font-bold text-[#3D4852] mt-1">{selectedShelf.stockLevel}%</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="flex-1 py-3 rounded-2xl neu-btn-primary font-semibold">
                Request Restock
              </button>
              <button className="flex-1 py-3 rounded-2xl neu-btn font-semibold text-[#3D4852]">
                Manual Scan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== ALERTS SECTION =====
function AlertsSection({ alerts, onAcknowledge }: { alerts: Alert[]; onAcknowledge: (id: string) => void }) {
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
      <div>
        <h2 className="font-display font-extrabold text-2xl tracking-tight text-[#3D4852]">Alerts & Notifications</h2>
        <p className="text-sm text-[#6B7280] mt-1">Monitor and manage system alerts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Critical', count: alertStats.critical, color: '#DC2626' },
          { label: 'High', count: alertStats.high, color: '#EA580C' },
          { label: 'Medium', count: alertStats.medium, color: '#D97706' },
          { label: 'Low', count: alertStats.low, color: '#6C63FF' },
        ].map((stat) => (
          <div key={stat.label} className="p-5 rounded-[32px] neu-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }} />
              <span className="text-sm font-semibold text-[#6B7280]">{stat.label}</span>
            </div>
            <p className="text-3xl font-bold text-[#3D4852]">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl neu-extruded flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#6B7280]" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as AlertSeverity | 'all')}
            className="px-3 py-2 rounded-xl neu-input text-sm font-medium text-[#3D4852]"
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
          />
          <span className="text-sm font-medium text-[#6B7280]">Show acknowledged</span>
        </label>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 rounded-[32px] neu-extruded text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl neu-icon-well flex items-center justify-center">
              <Bell className="w-8 h-8 text-[#6B7280]" />
            </div>
            <p className="text-sm font-medium text-[#6B7280]">No alerts to display</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                "p-5 rounded-2xl flex items-center gap-4 neu-transition",
                alert.acknowledged ? "neu-inset opacity-60" : "neu-extruded"
              )}
            >
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ 
                  backgroundColor: 
                    alert.severity === 'critical' ? '#DC2626' :
                    alert.severity === 'high' ? '#EA580C' :
                    alert.severity === 'medium' ? '#D97706' : '#6C63FF'
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#3D4852]">{alert.message}</p>
                <p className="text-xs text-[#6B7280] mt-1">{formatTimeAgo(alert.timestamp)}</p>
              </div>
              {alert.acknowledged ? (
                <span className="flex items-center gap-1 text-[#059669] text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Done
                </span>
              ) : (
                <button
                  onClick={() => onAcknowledge(alert.id)}
                  className="px-4 py-2 rounded-xl neu-btn-primary text-sm font-semibold"
                >
                  Acknowledge
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ===== ROBOT SECTION =====
function RobotSection({ robot }: { robot: Robot }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-extrabold text-2xl tracking-tight text-[#3D4852]">Robot Status</h2>
        <p className="text-sm text-[#6B7280] mt-1">Real-time monitoring of ASTRA robot</p>
      </div>

      {/* Robot Info Card */}
      <div className="p-6 md:p-8 rounded-[32px] neu-extruded">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-20 h-20 rounded-[32px] neu-icon-well-deep flex items-center justify-center">
            <Bot className="w-10 h-10 text-[#6C63FF]" />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h3 className="font-display font-bold text-xl text-[#3D4852]">{robot.name}</h3>
              <span className={cn(
                "px-3 py-1 rounded-full text-sm font-bold",
                robot.status === 'online' ? "text-[#059669] neu-extruded-sm" : "text-[#DC2626] neu-extruded-sm"
              )}>
                {robot.status === 'online' ? '● Online' : '○ Offline'}
              </span>
            </div>
            <p className="text-sm text-[#6B7280]">ID: {robot.id}</p>
            <p className="text-sm text-[#6B7280]">Last scan: {formatTimeAgo(robot.lastScanTime)}</p>
          </div>
          
          <div className="text-left md:text-right">
            <p className="text-sm text-[#6B7280]">Battery</p>
            <p className="text-3xl font-bold" style={{ color: getBatteryColor(robot.batteryPercentage) }}>
              {robot.batteryPercentage}%
            </p>
          </div>
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-[32px] neu-card">
          <div className="p-3 rounded-xl neu-icon-well w-fit mb-4">
            <MapPin className="w-5 h-5 text-[#6C63FF]" />
          </div>
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Location</p>
          <p className="text-xl font-bold text-[#3D4852] mt-1">{robot.currentLocation.zone}</p>
          <p className="text-sm text-[#6B7280]">{robot.currentLocation.aisle}</p>
        </div>

        <div className="p-5 rounded-[32px] neu-card">
          <div className="p-3 rounded-xl neu-icon-well w-fit mb-4">
            <Activity className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Action</p>
          <p className="text-xl font-bold text-[#7C3AED] capitalize mt-1">{robot.currentAction}</p>
        </div>

        <div className="p-5 rounded-[32px] neu-card">
          <div className="p-3 rounded-xl neu-icon-well w-fit mb-4">
            <Camera className="w-5 h-5 text-[#D97706]" />
          </div>
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Camera</p>
          <p className="text-xl font-bold text-[#D97706] capitalize mt-1">{robot.cameraArmStatus}</p>
        </div>

        <div className="p-5 rounded-[32px] neu-card">
          <div className="p-3 rounded-xl neu-icon-well w-fit mb-4">
            <Zap className="w-5 h-5 text-[#059669]" />
          </div>
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Power</p>
          <p className="text-xl font-bold text-[#059669] capitalize mt-1">{robot.chargingStatus}</p>
        </div>
      </div>

      {/* Scan Progress */}
      <div className="p-6 md:p-8 rounded-[32px] neu-extruded">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg text-[#3D4852]">Scan Progress</h3>
          <span className="text-2xl font-bold text-[#6C63FF]">{robot.scanProgress}%</span>
        </div>
        
        <div className="h-4 rounded-full neu-progress-track overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#6C63FF] to-[#8B84FF] rounded-full neu-transition"
            style={{ width: `${robot.scanProgress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-[#6B7280]">Scanning {robot.currentLocation.zone} - {robot.currentLocation.aisle}</p>
          <p className="text-sm text-[#6B7280]">Est. ~5 min</p>
        </div>
      </div>

      {/* Warehouse Map */}
      <div className="p-6 md:p-8 rounded-[32px] neu-extruded">
        <h3 className="font-display font-bold text-lg text-[#3D4852] mb-6">Warehouse Map</h3>
        
        <div className="relative aspect-[2/1] rounded-2xl neu-inset-deep p-4">
          <div className="absolute inset-4 grid grid-cols-4 grid-rows-3 gap-2">
            {['A', 'B', 'C'].map((zone) =>
              [1, 2, 3, 4].map((aisle) => {
                const isRobotHere = robot.currentLocation.zone === `Zone ${zone}` && 
                                    robot.currentLocation.aisle === `Aisle ${aisle}`;
                return (
                  <div
                    key={`${zone}-${aisle}`}
                    className={cn(
                      "rounded-xl flex items-center justify-center text-xs font-semibold neu-transition",
                      isRobotHere 
                        ? "bg-[#6C63FF] text-white neu-extruded-sm animate-pulse-glow" 
                        : "neu-extruded-sm text-[#6B7280]"
                    )}
                  >
                    {isRobotHere ? (
                      <div className="text-center">
                        <Bot className="w-4 h-4 mx-auto" />
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
      </div>
    </div>
  );
}

// ===== BATTERY SECTION =====
function BatterySection({ robot }: { robot: Robot }) {
  const avgDrainRate = 5.2;
  const estimatedRuntime = Math.round(robot.batteryPercentage / avgDrainRate);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-extrabold text-2xl tracking-tight text-[#3D4852]">Battery & Power</h2>
        <p className="text-sm text-[#6B7280] mt-1">Monitor battery status and power consumption</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-[32px] neu-card">
          <Battery className="w-8 h-8 mb-4" style={{ color: getBatteryColor(robot.batteryPercentage) }} />
          <p className="text-4xl font-bold" style={{ color: getBatteryColor(robot.batteryPercentage) }}>
            {robot.batteryPercentage}%
          </p>
          <p className="text-sm text-[#6B7280] mt-1">Current Level</p>
          <div className="h-3 rounded-full neu-progress-track mt-4 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${robot.batteryPercentage}%`, backgroundColor: getBatteryColor(robot.batteryPercentage) }}
            />
          </div>
        </div>

        <div className="p-6 rounded-[32px] neu-card">
          <div className="p-3 rounded-xl neu-icon-well w-fit mb-4">
            <Zap className={cn("w-6 h-6", robot.chargingStatus === 'charging' ? "text-[#059669]" : "text-[#6B7280]")} />
          </div>
          <p className="text-2xl font-bold text-[#3D4852] capitalize">{robot.chargingStatus}</p>
          <p className="text-sm text-[#6B7280] mt-1">Power Status</p>
        </div>

        <div className="p-6 rounded-[32px] neu-card">
          <div className="p-3 rounded-xl neu-icon-well w-fit mb-4">
            <Clock className="w-6 h-6 text-[#6C63FF]" />
          </div>
          <p className="text-2xl font-bold text-[#3D4852]">{estimatedRuntime}h</p>
          <p className="text-sm text-[#6B7280] mt-1">Est. Runtime</p>
        </div>

        <div className="p-6 rounded-[32px] neu-card">
          <div className="p-3 rounded-xl neu-icon-well w-fit mb-4">
            <TrendingDown className="w-6 h-6 text-[#D97706]" />
          </div>
          <p className="text-2xl font-bold text-[#3D4852]">{avgDrainRate}%/h</p>
          <p className="text-sm text-[#6B7280] mt-1">Drain Rate</p>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 md:p-8 rounded-[32px] neu-extruded">
        <h3 className="font-display font-bold text-lg text-[#3D4852] mb-6">Battery History</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={batteryHistory}>
              <defs>
                <linearGradient id="batteryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6C63FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#A3B1C6" strokeOpacity={0.3} />
              <XAxis dataKey="time" stroke="#6B7280" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="#6B7280" fontSize={12} tickFormatter={(v) => `${v}%`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#E0E5EC', 
                  border: 'none', 
                  borderRadius: '16px',
                  boxShadow: '5px 5px 10px rgb(163,177,198,0.6), -5px -5px 10px rgba(255,255,255,0.5)'
                }} 
              />
              <Area type="monotone" dataKey="percentage" stroke="#6C63FF" strokeWidth={2} fill="url(#batteryGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Health & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 md:p-8 rounded-[32px] neu-extruded">
          <h3 className="font-display font-bold text-lg text-[#3D4852] mb-4">Battery Health</h3>
          <div className="space-y-4">
            {[
              { label: 'Overall Health', value: '94%' },
              { label: 'Charge Cycles', value: '127' },
              { label: 'Temperature', value: '32°C' },
              { label: 'Capacity', value: '96%' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-xl neu-inset">
                <span className="text-sm text-[#6B7280]">{item.label}</span>
                <span className="text-sm font-bold text-[#3D4852]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8 rounded-[32px] neu-extruded">
          <h3 className="font-display font-bold text-lg text-[#3D4852] mb-4">Recommendations</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-xl neu-inset">
              <p className="text-sm font-medium text-[#6C63FF]">💡 Schedule charging during low-activity periods</p>
            </div>
            <div className="p-4 rounded-xl neu-inset">
              <p className="text-sm font-medium text-[#059669]">✓ Battery performing optimally</p>
            </div>
            <div className="p-4 rounded-xl neu-inset">
              <p className="text-sm font-medium text-[#D97706]">⚠️ Consider replacing at 500 cycles</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== REPORTS SECTION =====
function ReportsSection() {
  const totalScans = scanReports.reduce((acc, r) => acc + r.totalScans, 0);
  const totalIssues = scanReports.reduce((acc, r) => acc + r.issuesFound, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl tracking-tight text-[#3D4852]">Reports & Analytics</h2>
          <p className="text-sm text-[#6B7280] mt-1">Scan reports and stock analytics</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl neu-btn text-sm font-semibold text-[#3D4852]">
            <Calendar className="w-4 h-4" />
            This Week
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl neu-btn-primary text-sm font-semibold">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-[32px] neu-card">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-[#6C63FF]" />
            <span className="text-sm text-[#6B7280]">Total Scans (Week)</span>
          </div>
          <p className="text-3xl font-bold text-[#3D4852]">{totalScans.toLocaleString()}</p>
          <p className="text-sm text-[#059669] mt-1">↑ 12% from last week</p>
        </div>

        <div className="p-6 rounded-[32px] neu-card">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-[#D97706]" />
            <span className="text-sm text-[#6B7280]">Issues Found</span>
          </div>
          <p className="text-3xl font-bold text-[#3D4852]">{totalIssues}</p>
          <p className="text-sm text-[#059669] mt-1">↓ 8% from last week</p>
        </div>

        <div className="p-6 rounded-[32px] neu-card">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-[#059669]" />
            <span className="text-sm text-[#6B7280]">Avg. Stock Level</span>
          </div>
          <p className="text-3xl font-bold text-[#3D4852]">82%</p>
          <p className="text-sm text-[#059669] mt-1">↑ 3% from last week</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 md:p-8 rounded-[32px] neu-extruded">
          <h3 className="font-display font-bold text-lg text-[#3D4852] mb-6">Daily Scan Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scanReports}>
                <CartesianGrid strokeDasharray="3 3" stroke="#A3B1C6" strokeOpacity={0.3} />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#E0E5EC', 
                    border: 'none', 
                    borderRadius: '16px',
                    boxShadow: '5px 5px 10px rgb(163,177,198,0.6), -5px -5px 10px rgba(255,255,255,0.5)'
                  }} 
                />
                <Bar dataKey="totalScans" fill="#6C63FF" radius={[8, 8, 0, 0]} name="Scans" />
                <Bar dataKey="issuesFound" fill="#D97706" radius={[8, 8, 0, 0]} name="Issues" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 md:p-8 rounded-[32px] neu-extruded">
          <h3 className="font-display font-bold text-lg text-[#3D4852] mb-6">Stock Trends by Zone</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stockTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#A3B1C6" strokeOpacity={0.3} />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#E0E5EC', 
                    border: 'none', 
                    borderRadius: '16px',
                    boxShadow: '5px 5px 10px rgb(163,177,198,0.6), -5px -5px 10px rgba(255,255,255,0.5)'
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="zoneA" stroke="#6C63FF" strokeWidth={2} name="Zone A" />
                <Line type="monotone" dataKey="zoneB" stroke="#059669" strokeWidth={2} name="Zone B" />
                <Line type="monotone" dataKey="zoneC" stroke="#D97706" strokeWidth={2} name="Zone C" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== AI SECTION =====
function AISection() {
  const insights = [
    { id: '1', issue: 'Product misalignment detected', confidence: 94.5, shelfId: 'SH-B002', resolved: false },
    { id: '2', issue: 'Empty space pattern suggests restocking', confidence: 87.2, shelfId: 'SH-A002', resolved: false },
    { id: '3', issue: 'Price tag obscured by product', confidence: 78.8, shelfId: 'SH-C002', resolved: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-extrabold text-2xl tracking-tight text-[#3D4852]">AI Insights</h2>
        <p className="text-sm text-[#6B7280] mt-1">AI-powered shelf analysis and detection</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-[32px] neu-card">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-5 h-5 text-[#6C63FF]" />
            <span className="text-sm text-[#6B7280]">Detections</span>
          </div>
          <p className="text-2xl font-bold text-[#3D4852]">{insights.length}</p>
        </div>

        <div className="p-5 rounded-[32px] neu-card">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-[#D97706]" />
            <span className="text-sm text-[#6B7280]">Active</span>
          </div>
          <p className="text-2xl font-bold text-[#3D4852]">{insights.filter(i => !i.resolved).length}</p>
        </div>

        <div className="p-5 rounded-[32px] neu-card">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-[#059669]" />
            <span className="text-sm text-[#6B7280]">Resolved</span>
          </div>
          <p className="text-2xl font-bold text-[#3D4852]">{insights.filter(i => i.resolved).length}</p>
        </div>

        <div className="p-5 rounded-[32px] neu-card">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-[#7C3AED]" />
            <span className="text-sm text-[#6B7280]">Avg. Confidence</span>
          </div>
          <p className="text-2xl font-bold text-[#3D4852]">
            {Math.round(insights.reduce((acc, i) => acc + i.confidence, 0) / insights.length)}%
          </p>
        </div>
      </div>

      {/* Insights List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <div key={insight.id} className={cn(
            "p-6 rounded-[32px] neu-transition cursor-pointer",
            insight.resolved ? "neu-inset opacity-70" : "neu-card"
          )}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className={cn("w-5 h-5", insight.resolved ? "text-[#6B7280]" : "text-[#6C63FF]")} />
                <span className="text-sm font-medium text-[#6B7280]">Shelf {insight.shelfId}</span>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-bold",
                insight.resolved ? "text-[#059669] neu-extruded-sm" : "text-[#D97706] neu-extruded-sm"
              )}>
                {insight.resolved ? 'Resolved' : 'Active'}
              </span>
            </div>
            
            <p className="text-sm font-semibold text-[#3D4852] mb-3">{insight.issue}</p>
            
            <div className={cn(
              "px-3 py-1.5 rounded-xl w-fit text-xs font-bold",
              insight.confidence > 90 ? "text-[#059669]" : insight.confidence > 80 ? "text-[#6C63FF]" : "text-[#D97706]"
            )} style={{ background: '#E0E5EC' }}>
              {insight.confidence}% confidence
            </div>
          </div>
        ))}
      </div>

      {/* Accuracy Metrics */}
      <div className="p-6 md:p-8 rounded-[32px] neu-extruded">
        <h3 className="font-display font-bold text-lg text-[#3D4852] mb-6">Detection Accuracy</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Accuracy', value: '96.8%', color: '#059669' },
            { label: 'Precision', value: '94.2%', color: '#6C63FF' },
            { label: 'Recall', value: '92.5%', color: '#7C3AED' },
            { label: 'F1 Score', value: '93.3%', color: '#6C63FF' },
          ].map((metric) => (
            <div key={metric.label} className="p-4 rounded-2xl neu-inset text-center">
              <p className="text-sm font-medium text-[#6B7280] mb-1">{metric.label}</p>
              <p className="text-2xl font-bold" style={{ color: metric.color }}>{metric.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== CONTROL SECTION =====
function ControlSection({ robot }: { robot: Robot }) {
  const [isScanning, setIsScanning] = useState(robot.currentAction === 'scanning');
  const [cameraView, setCameraView] = useState<'front' | 'shelf' | 'overview'>('front');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-extrabold text-2xl tracking-tight text-[#3D4852]">Control Panel</h2>
        <p className="text-sm text-[#6B7280] mt-1">Manual robot controls and live camera</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scan Controls */}
        <div className="p-6 md:p-8 rounded-[32px] neu-extruded">
          <h3 className="font-display font-bold text-lg text-[#3D4852] mb-6">Scan Controls</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setIsScanning(true)}
              disabled={isScanning}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-4 rounded-2xl font-semibold neu-transition",
                isScanning ? "neu-inset text-[#6B7280]" : "neu-btn-primary"
              )}
            >
              <Play className="w-5 h-5" />
              Start
            </button>
            
            <button
              onClick={() => setIsScanning(false)}
              disabled={!isScanning}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-4 rounded-2xl font-semibold neu-transition",
                !isScanning ? "neu-inset text-[#6B7280]" : "bg-[#DC2626] text-white neu-extruded-sm hover:-translate-y-0.5"
              )}
            >
              <Square className="w-5 h-5" />
              Stop
            </button>
          </div>
          
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl neu-btn font-semibold text-[#3D4852]">
            <RefreshCw className="w-5 h-5" />
            Manual Rescan Zone
          </button>
          
          {isScanning && (
            <div className="mt-6 p-4 rounded-2xl neu-inset">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-[#059669] animate-pulse" />
                <span className="text-sm font-medium text-[#059669]">Scanning in progress...</span>
              </div>
              <div className="h-2 rounded-full neu-progress-track overflow-hidden">
                <div className="h-full bg-[#059669] rounded-full" style={{ width: `${robot.scanProgress}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Movement Controls */}
        <div className="p-6 md:p-8 rounded-[32px] neu-extruded">
          <h3 className="font-display font-bold text-lg text-[#3D4852] mb-2">Movement</h3>
          <p className="text-sm text-[#6B7280] mb-6">Manual navigation (testing)</p>
          
          <div className="flex flex-col items-center gap-2">
            <button className="w-14 h-14 rounded-2xl neu-btn flex items-center justify-center">
              <ArrowUp className="w-6 h-6 text-[#3D4852]" />
            </button>
            
            <div className="flex gap-2">
              <button className="w-14 h-14 rounded-2xl neu-btn flex items-center justify-center">
                <ArrowLeft className="w-6 h-6 text-[#3D4852]" />
              </button>
              <button className="w-14 h-14 rounded-2xl bg-[#DC2626] text-white neu-extruded-sm flex items-center justify-center">
                <Pause className="w-6 h-6" />
              </button>
              <button className="w-14 h-14 rounded-2xl neu-btn flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-[#3D4852]" />
              </button>
            </div>
            
            <button className="w-14 h-14 rounded-2xl neu-btn flex items-center justify-center">
              <ArrowDown className="w-6 h-6 text-[#3D4852]" />
            </button>
          </div>
          
          <p className="text-xs text-center text-[#6B7280] mt-4">⚠️ Disabled during active scan</p>
        </div>
      </div>

      {/* Camera Controls */}
      <div className="p-6 md:p-8 rounded-[32px] neu-extruded">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-lg text-[#3D4852]">Camera Arm</h3>
          <span className="px-3 py-1 rounded-full text-xs font-bold text-[#6C63FF] neu-extruded-sm capitalize">
            {robot.cameraArmStatus}
          </span>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: ArrowUp, label: 'Up' },
            { icon: ArrowDown, label: 'Down' },
            { icon: RotateCw, label: 'Rotate' },
            { icon: Camera, label: 'Capture' },
          ].map((control) => (
            <button key={control.label} className="flex flex-col items-center gap-2 p-4 rounded-2xl neu-btn">
              <control.icon className="w-6 h-6 text-[#3D4852]" />
              <span className="text-sm font-semibold text-[#3D4852]">{control.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Live Feed */}
      <div className="p-6 md:p-8 rounded-[32px] neu-extruded">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-lg text-[#3D4852]">Live Camera</h3>
          <div className="flex rounded-2xl overflow-hidden neu-inset-sm">
            {(['front', 'shelf', 'overview'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setCameraView(view)}
                className={cn(
                  "px-4 py-2 text-sm font-semibold capitalize neu-transition",
                  cameraView === view ? "bg-[#6C63FF] text-white" : "text-[#6B7280]"
                )}
              >
                {view}
              </button>
            ))}
          </div>
        </div>
        
        <div className="relative aspect-video rounded-2xl neu-inset-deep overflow-hidden flex flex-col items-center justify-center">
          <Video className="w-16 h-16 text-[#6B7280] mb-4" />
          <p className="text-lg font-medium text-[#6B7280]">Live Camera Feed</p>
          <p className="text-sm text-[#A0AEC0] mt-1 capitalize">{cameraView} View</p>
          <div className="flex items-center gap-2 mt-4">
            <div className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
            <span className="text-[#DC2626] text-sm font-bold">LIVE</span>
          </div>
          
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-black/50 backdrop-blur-sm">
            {robot.currentLocation.zone} - {robot.currentLocation.aisle}
          </div>
        </div>
        
        <p className="text-xs text-center text-[#6B7280] mt-4">
          Live feed available when ESP32 camera is connected
        </p>
      </div>
    </div>
  );
}

// ===== SETTINGS SECTION =====
function SettingsSection({ warehouses, selectedWarehouse, onWarehouseChange }: {
  warehouses: Warehouse[];
  selectedWarehouse: Warehouse;
  onWarehouseChange: (w: Warehouse) => void;
}) {
  const [lowStockThreshold, setLowStockThreshold] = useState(30);
  const [batteryThreshold, setBatteryThreshold] = useState(20);
  const [scanInterval, setScanInterval] = useState(30);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-extrabold text-2xl tracking-tight text-[#3D4852]">Settings</h2>
        <p className="text-sm text-[#6B7280] mt-1">Configure dashboard preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Warehouse Selection */}
        <div className="p-6 md:p-8 rounded-[32px] neu-extruded">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-5 h-5 text-[#6C63FF]" />
            <h3 className="font-display font-bold text-lg text-[#3D4852]">Warehouse</h3>
          </div>
          
          <div className="space-y-3">
            {warehouses.map((warehouse) => (
              <button
                key={warehouse.id}
                onClick={() => onWarehouseChange(warehouse)}
                className={cn(
                  "w-full p-4 rounded-2xl text-left neu-transition",
                  selectedWarehouse.id === warehouse.id ? "neu-inset" : "neu-extruded-sm"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#3D4852]">{warehouse.name}</p>
                    <p className="text-sm text-[#6B7280]">{warehouse.location}</p>
                  </div>
                  {selectedWarehouse.id === warehouse.id && (
                    <div className="w-6 h-6 rounded-full bg-[#6C63FF] flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Alert Thresholds */}
        <div className="p-6 md:p-8 rounded-[32px] neu-extruded">
          <div className="flex items-center gap-3 mb-6">
            <Gauge className="w-5 h-5 text-[#6C63FF]" />
            <h3 className="font-display font-bold text-lg text-[#3D4852]">Thresholds</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-[#3D4852]">Low Stock Threshold</label>
                <span className="text-sm font-bold text-[#6C63FF]">{lowStockThreshold}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-[#3D4852]">Battery Alert Level</label>
                <span className="text-sm font-bold text-[#6C63FF]">{batteryThreshold}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={batteryThreshold}
                onChange={(e) => setBatteryThreshold(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Scan Settings */}
        <div className="p-6 md:p-8 rounded-[32px] neu-extruded">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-[#6C63FF]" />
            <h3 className="font-display font-bold text-lg text-[#3D4852]">Scan Settings</h3>
          </div>
          
          <div>
            <label className="text-sm font-medium text-[#3D4852] block mb-3">Auto-scan Interval</label>
            <select
              value={scanInterval}
              onChange={(e) => setScanInterval(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl neu-input text-sm font-medium text-[#3D4852]"
            >
              <option value={15}>Every 15 minutes</option>
              <option value={30}>Every 30 minutes</option>
              <option value={60}>Every hour</option>
              <option value={120}>Every 2 hours</option>
            </select>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 md:p-8 rounded-[32px] neu-extruded">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-[#6C63FF]" />
            <h3 className="font-display font-bold text-lg text-[#3D4852]">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#3D4852]">Email Alerts</p>
                <p className="text-sm text-[#6B7280]">Critical alerts via email</p>
              </div>
              <ToggleSwitch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#3D4852]">Push Notifications</p>
                <p className="text-sm text-[#6B7280]">Device notifications</p>
              </div>
              <ToggleSwitch defaultChecked />
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl neu-btn-primary font-semibold">
          <Save className="w-5 h-5" />
          Save Settings
        </button>
      </div>

      {/* API Info */}
      <div className="p-6 md:p-8 rounded-[32px] neu-extruded">
        <h3 className="font-display font-bold text-lg text-[#3D4852] mb-4">API Configuration</h3>
        <p className="text-sm text-[#6B7280] mb-4">Connect to Google Sheets backend</p>
        
        <div className="p-4 rounded-2xl neu-inset-deep font-mono text-sm">
          <p className="text-[#6C63FF]">// Expected API endpoints</p>
          <p className="text-[#3D4852]">GET /api/shelves → Shelf data</p>
          <p className="text-[#3D4852]">GET /api/robot → Robot status</p>
          <p className="text-[#3D4852]">GET /api/alerts → Alert list</p>
          <p className="text-[#3D4852]">POST /api/scan → Trigger scan</p>
        </div>
      </div>
    </div>
  );
}

// Toggle Switch Component
function ToggleSwitch({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  
  return (
    <button
      onClick={() => setChecked(!checked)}
      className={cn(
        "relative w-14 h-7 rounded-full neu-transition",
        checked ? "neu-toggle active" : "neu-toggle"
      )}
    >
      <div className={cn(
        "absolute top-1 w-5 h-5 neu-toggle-knob neu-transition",
        checked ? "translate-x-8" : "translate-x-1"
      )} />
    </button>
  );
}
