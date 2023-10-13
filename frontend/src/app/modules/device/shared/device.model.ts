export interface TemperatureInterval {
  initialTime: Date;
  finalTime: Date;
  temperature: number;
}

export interface TemperatureHistoryItem {
  temperature: number;
  time: Date;
}

export interface Device {
  id: string;
  name: string;
  actualTemperature: number;
  temperatureConfig: TemperatureInterval[];
  temperatureHistory: TemperatureHistoryItem[];
}
