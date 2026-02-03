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
  type LucideIcon
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'shelves', label: 'Shelf Monitoring', icon: Package },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'robot', label: 'Robot Status', icon: Bot },
  { id: 'battery', label: 'Battery & Power', icon: Battery },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'ai', label: 'AI Insights', icon: Brain },
  { id: 'control', label: 'Control Panel', icon: Gamepad2 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { darkMode } = useTheme();

  return (
    <aside className={cn(
      "w-64 border-r min-h-[calc(100vh-73px)] p-4",
      darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"
    )}>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : darkMode
                    ? "text-slate-400 hover:text-white hover:bg-slate-800"
                    : "text-slate-600 hover:text-slate-900 hover:bg-gray-100"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
      
      <div className={cn(
        "mt-8 p-4 rounded-xl border",
        darkMode ? "bg-slate-800 border-slate-700" : "bg-indigo-50 border-indigo-100"
      )}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className={cn(
            "text-xs font-medium",
            darkMode ? "text-slate-400" : "text-indigo-700"
          )}>System Status</span>
        </div>
        <p className={cn(
          "text-sm font-semibold",
          darkMode ? "text-white" : "text-indigo-900"
        )}>All Systems Operational</p>
        <p className={cn(
          "text-xs mt-1",
          darkMode ? "text-slate-500" : "text-indigo-600"
        )}>Last check: 2 min ago</p>
      </div>
    </aside>
  );
}
