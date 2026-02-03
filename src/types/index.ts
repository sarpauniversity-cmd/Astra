export type ShelfStatus = 'fully-stocked' | 'low-stock' | 'empty' | 'misplaced';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertType = 'low-stock' | 'empty-shelf' | 'low-battery' | 'robot-error' | 'camera-error' | 'misplaced-items';
export type RobotStatus = 'online' | 'offline' | 'maintenance';
export type RobotAction = 'scanning' | 'moving' | 'idle' | 'charging';
export type CameraArmStatus = 'up' | 'down' | 'rotating';
export type ChargingStatus = 'charging' | 'discharging' | 'full';

export interface Shelf {
  id: string;
  zone: string;
  aisle: string;
  status: ShelfStatus;
  stockLevel: number;
  lastUpdated: string;
  imageUrl: string;
}

export interface Alert {
  id: string;
  timestamp: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  shelfId?: string;
  acknowledged: boolean;
}

export interface Robot {
  id: string;
  name: string;
  status: RobotStatus;
  batteryPercentage: number;
  wifiConnected: boolean;
  lastScanTime: string;
  currentLocation: {
    zone: string;
    aisle: string;
  };
  currentAction: RobotAction;
  cameraArmStatus: CameraArmStatus;
  scanProgress: number;
  chargingStatus: ChargingStatus;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  totalShelves: number;
  systemHealth: number;
}

export interface BatteryDataPoint {
  time: string;
  percentage: number;
}

export interface ScanReport {
  date: string;
  totalScans: number;
  issuesFound: number;
  avgStockLevel: number;
}

export interface AIInsight {
  id: string;
  timestamp: string;
  issue: string;
  confidence: number;
  shelfId: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  resolved: boolean;
}

export interface Settings {
  lowStockThreshold: number;
  criticalBatteryThreshold: number;
  scanInterval: number;
  darkMode: boolean;
  selectedWarehouseId: string;
}
