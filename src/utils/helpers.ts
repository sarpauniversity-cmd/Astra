import type { ShelfStatus, AlertSeverity, AlertType } from '@/types';

export function formatTimeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusColor(status: ShelfStatus): string {
  switch (status) {
    case 'fully-stocked': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    case 'low-stock': return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'empty': return 'text-red-600 bg-red-50 border-red-200';
    case 'misplaced': return 'text-purple-600 bg-purple-50 border-purple-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function getStatusLabel(status: ShelfStatus): string {
  switch (status) {
    case 'fully-stocked': return 'Fully Stocked';
    case 'low-stock': return 'Low Stock';
    case 'empty': return 'Empty';
    case 'misplaced': return 'Misplaced Items';
    default: return 'Unknown';
  }
}

export function getSeverityColor(severity: AlertSeverity): string {
  switch (severity) {
    case 'critical': return 'text-red-700 bg-red-100 border-red-300';
    case 'high': return 'text-orange-700 bg-orange-100 border-orange-300';
    case 'medium': return 'text-amber-700 bg-amber-100 border-amber-300';
    case 'low': return 'text-blue-700 bg-blue-100 border-blue-300';
    default: return 'text-gray-700 bg-gray-100 border-gray-300';
  }
}

export function getAlertTypeIcon(type: AlertType): string {
  switch (type) {
    case 'low-stock': return '📦';
    case 'empty-shelf': return '🚨';
    case 'low-battery': return '🔋';
    case 'robot-error': return '🤖';
    case 'camera-error': return '📷';
    case 'misplaced-items': return '🔀';
    default: return '⚠️';
  }
}

export function getBatteryColor(percentage: number): string {
  if (percentage > 60) return 'text-emerald-500';
  if (percentage > 30) return 'text-amber-500';
  return 'text-red-500';
}

export function getBatteryBgColor(percentage: number): string {
  if (percentage > 60) return 'bg-emerald-500';
  if (percentage > 30) return 'bg-amber-500';
  return 'bg-red-500';
}

export function getStockLevelColor(level: number): string {
  if (level > 70) return 'bg-emerald-500';
  if (level > 30) return 'bg-amber-500';
  return 'bg-red-500';
}
