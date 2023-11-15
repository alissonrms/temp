export interface TemperatureInterval {
  initialTime: number;
  finalTime: number;
  temperature: number;
}

export interface TemperatureHistoryItem {
  temperature: number;
  time: number;
}

export interface Device {
  macAddress: string;
  name: string;
  actualTemperatureInfos: {
    temperature: number;
    updatedAt: number;
  };
  temperatureConfig: TemperatureInterval[];
  temperatureHistory: TemperatureHistoryItem[];
  userId?: string;
}
