import { ptBR } from 'date-fns/locale';
import {
  Device,
  TemperatureInterval,
} from '../modules/device/shared/device.model';

export const dateDisplayOptions = {
  locale: ptBR,
  addSuffix: true,
};

export function addIntervalToDeviceConfig(
  device: Device,
  newInterval: TemperatureInterval
): void {
  device.temperatureConfig.push(newInterval);
  sortIntervals(device);
  
}

function sortIntervals(device: Device): void {
  device.temperatureConfig.sort((a, b) => a.initialTime - b.initialTime);
}