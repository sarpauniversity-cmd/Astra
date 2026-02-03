import type { Shelf, Alert, Robot, Warehouse, BatteryDataPoint, ScanReport, AIInsight } from '@/types';

export const mockWarehouses: Warehouse[] = [
  { id: 'wh-001', name: 'Central Distribution Hub', location: 'Building A, Floor 1', totalShelves: 248, systemHealth: 94 },
  { id: 'wh-002', name: 'East Wing Storage', location: 'Building B, Floor 2', totalShelves: 156, systemHealth: 88 },
  { id: 'wh-003', name: 'Cold Storage Facility', location: 'Building C, Basement', totalShelves: 92, systemHealth: 97 },
];

export const mockRobot: Robot = {
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

export const mockShelves: Shelf[] = [
  { id: 'SH-A001', zone: 'Zone A', aisle: 'Aisle 1', status: 'fully-stocked', stockLevel: 95, lastUpdated: new Date(Date.now() - 1000 * 60 * 5).toISOString(), imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop' },
  { id: 'SH-A002', zone: 'Zone A', aisle: 'Aisle 1', status: 'low-stock', stockLevel: 32, lastUpdated: new Date(Date.now() - 1000 * 60 * 8).toISOString(), imageUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=300&fit=crop' },
  { id: 'SH-A003', zone: 'Zone A', aisle: 'Aisle 2', status: 'empty', stockLevel: 0, lastUpdated: new Date(Date.now() - 1000 * 60 * 15).toISOString(), imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=300&fit=crop' },
  { id: 'SH-B001', zone: 'Zone B', aisle: 'Aisle 1', status: 'fully-stocked', stockLevel: 88, lastUpdated: new Date(Date.now() - 1000 * 60 * 20).toISOString(), imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop' },
  { id: 'SH-B002', zone: 'Zone B', aisle: 'Aisle 2', status: 'misplaced', stockLevel: 65, lastUpdated: new Date(Date.now() - 1000 * 60 * 25).toISOString(), imageUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=300&fit=crop' },
  { id: 'SH-C001', zone: 'Zone C', aisle: 'Aisle 1', status: 'low-stock', stockLevel: 18, lastUpdated: new Date(Date.now() - 1000 * 60 * 30).toISOString(), imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=300&fit=crop' },
  { id: 'SH-C002', zone: 'Zone C', aisle: 'Aisle 2', status: 'fully-stocked', stockLevel: 100, lastUpdated: new Date(Date.now() - 1000 * 60 * 35).toISOString(), imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop' },
  { id: 'SH-D001', zone: 'Zone D', aisle: 'Aisle 1', status: 'empty', stockLevel: 0, lastUpdated: new Date(Date.now() - 1000 * 60 * 40).toISOString(), imageUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=300&fit=crop' },
];

export const mockAlerts: Alert[] = [
  { id: 'al-001', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), type: 'empty-shelf', severity: 'critical', message: 'Shelf SH-A003 is completely empty', shelfId: 'SH-A003', acknowledged: false },
  { id: 'al-002', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), type: 'low-stock', severity: 'high', message: 'Low stock detected on Shelf SH-A002 (32%)', shelfId: 'SH-A002', acknowledged: false },
  { id: 'al-003', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), type: 'misplaced-items', severity: 'medium', message: 'Misplaced items detected on Shelf SH-B002', shelfId: 'SH-B002', acknowledged: true },
  { id: 'al-004', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), type: 'low-battery', severity: 'medium', message: 'Robot battery at 25% - charging recommended', acknowledged: true },
  { id: 'al-005', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), type: 'camera-error', severity: 'low', message: 'Camera calibration needed - minor focus issue detected', acknowledged: true },
  { id: 'al-006', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), type: 'empty-shelf', severity: 'critical', message: 'Shelf SH-D001 is completely empty', shelfId: 'SH-D001', acknowledged: true },
  { id: 'al-007', timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), type: 'low-stock', severity: 'high', message: 'Critical low stock on Shelf SH-C001 (18%)', shelfId: 'SH-C001', acknowledged: false },
];

export const mockBatteryHistory: BatteryDataPoint[] = [
  { time: '08:00', percentage: 100 },
  { time: '09:00', percentage: 95 },
  { time: '10:00', percentage: 88 },
  { time: '11:00', percentage: 82 },
  { time: '12:00', percentage: 75 },
  { time: '13:00', percentage: 68 },
  { time: '14:00', percentage: 73 },
  { time: '15:00', percentage: 85 },
  { time: '16:00', percentage: 78 },
  { time: '17:00', percentage: 73 },
];

export const mockScanReports: ScanReport[] = [
  { date: 'Mon', totalScans: 145, issuesFound: 12, avgStockLevel: 78 },
  { date: 'Tue', totalScans: 162, issuesFound: 8, avgStockLevel: 82 },
  { date: 'Wed', totalScans: 138, issuesFound: 15, avgStockLevel: 75 },
  { date: 'Thu', totalScans: 171, issuesFound: 6, avgStockLevel: 85 },
  { date: 'Fri', totalScans: 156, issuesFound: 11, avgStockLevel: 79 },
  { date: 'Sat', totalScans: 89, issuesFound: 4, avgStockLevel: 88 },
  { date: 'Sun', totalScans: 52, issuesFound: 2, avgStockLevel: 91 },
];

export const mockAIInsights: AIInsight[] = [
  { id: 'ai-001', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), issue: 'Product misalignment detected - bottles facing wrong direction', confidence: 94.5, shelfId: 'SH-B002', beforeImageUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=300&fit=crop', afterImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop', resolved: false },
  { id: 'ai-002', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), issue: 'Empty space pattern suggests restocking needed soon', confidence: 87.2, shelfId: 'SH-A002', beforeImageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=300&fit=crop', afterImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop', resolved: false },
  { id: 'ai-003', timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), issue: 'Price tag obscured by product placement', confidence: 78.8, shelfId: 'SH-C002', beforeImageUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=300&fit=crop', afterImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop', resolved: true },
  { id: 'ai-004', timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(), issue: 'Product category mixing detected in Zone A', confidence: 91.3, shelfId: 'SH-A001', beforeImageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=300&fit=crop', afterImageUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=300&fit=crop', resolved: true },
];

export const stockTrendData = [
  { date: 'Week 1', zoneA: 85, zoneB: 78, zoneC: 92, zoneD: 70 },
  { date: 'Week 2', zoneA: 82, zoneB: 81, zoneC: 88, zoneD: 75 },
  { date: 'Week 3', zoneA: 78, zoneB: 76, zoneC: 85, zoneD: 72 },
  { date: 'Week 4', zoneA: 88, zoneB: 82, zoneC: 90, zoneD: 68 },
];
