export interface TemperatureInterval {
  timeToStop: number;
  temperature: number;
}

export interface TemperatureHistoryItem {
  temperature: number;
  time: number;
}

export interface Device {
  macAddress: string;
  name: string;
  actualTemperatureInfos?: {
    temperature: number;
    updatedAt: number;
  };
  temperatureConfig: TemperatureInterval[];
  temperatureHistory: TemperatureHistoryItem[];
  userId?: string;
}

export function addIntervalToDeviceConfig(
  device: Device,
  timeToStart: number,
  timeToStop: number,
  temperature: number
): void {
  if (timeToStart === 0) timeToStart = 1440;
  if (timeToStop === 0) timeToStop = 1440;

  const timeToStartInterval = findIntervalByTime(device, timeToStart);
  const timeToStopInterval = findIntervalByTime(device, timeToStop);

  let startIntervalAfterChanges = timeToStartInterval;
  let stopIntervalAfterChanges = timeToStopInterval;

  if (timeToStartInterval.timeToStop !== timeToStart) {
    const newStartIntervalToAdd: TemperatureInterval = {
      temperature: timeToStartInterval.temperature,
      timeToStop: timeToStart,
    };
    device.temperatureConfig.push(newStartIntervalToAdd);
    sortIntervals(device);

    startIntervalAfterChanges = newStartIntervalToAdd;
  }

  if (timeToStopInterval.timeToStop === timeToStop) {
    const index = device.temperatureConfig.indexOf(timeToStopInterval);
    device.temperatureConfig[index].temperature = temperature;
  } else {
    const newStopIntervalToAdd: TemperatureInterval = {
      temperature: temperature,
      timeToStop: timeToStop,
    };
    device.temperatureConfig.push(newStopIntervalToAdd);
    sortIntervals(device);
    stopIntervalAfterChanges = newStopIntervalToAdd;
  }

  removeIntervalsBetween(
    device,
    device.temperatureConfig.indexOf(startIntervalAfterChanges),
    device.temperatureConfig.indexOf(stopIntervalAfterChanges)
  );
  mergeSameTemperatureIntervals(device);
}

function removeIntervalsBetween(
  device: Device,
  indexStart: number,
  indexStop: number
) {
  function handleFinalHigher() {
    device.temperatureConfig.splice(indexStart + 1, indexStop - indexStart - 1);
  }

  function handleInitialHigher() {
    device.temperatureConfig.splice(
      indexStart + 1,
      device.temperatureConfig.length - 1 - indexStart
    );
    device.temperatureConfig.splice(0, indexStop);
  }

  indexStart <= indexStop ? handleFinalHigher() : handleInitialHigher();
}

function mergeSameTemperatureIntervals(device: Device): void {
  const { temperatureConfig } = device;
  if (temperatureConfig.length < 2) {
    device.temperatureConfig[0].timeToStop = 1440;
    return;
  }

  const mergedIntervals: TemperatureInterval[] = [temperatureConfig[0]];

  for (let i = 1; i < temperatureConfig.length; i++) {
    const current = temperatureConfig[i];
    const previous = mergedIntervals[mergedIntervals.length - 1];

    current.temperature === previous.temperature
      ? (mergedIntervals[mergedIntervals.length - 1] = current)
      : mergedIntervals.push(current);
  }

  const first = mergedIntervals[0];
  const last = mergedIntervals[mergedIntervals.length - 1];
  if (last.temperature === first.temperature && mergedIntervals.length > 1) {
    mergedIntervals.pop();
  }

  device.temperatureConfig = mergedIntervals;
}

export function removeIntervalFromDeviceConfig(
  device: Device,
  indexToRemove: number
): void {
  device.temperatureConfig.splice(indexToRemove, 1);
  mergeSameTemperatureIntervals(device);
}

export function editIntervalFromDeviceConfig(
  device: Device,
  indexToEdit: number,
  timeToStart: number,
  timeToStop: number,
  temperature: number
): void {
  removeIntervalFromDeviceConfig(device, indexToEdit);
  addIntervalToDeviceConfig(device, timeToStart, timeToStop, temperature);
}

function sortIntervals(device: Device): void {
  device.temperatureConfig.sort((a, b) => a.timeToStop - b.timeToStop);
}

function findIntervalIndexByTime(device: Device, time: number): number {
  if (time === 0) {
    time = 1440;
  }

  const index = device.temperatureConfig.findIndex(
    (interval) => time <= interval.timeToStop
  );

  return index != -1 ? index : 0;
}

function findIntervalByTime(device: Device, time: number): TemperatureInterval {
  const index = findIntervalIndexByTime(device, time);
  return device.temperatureConfig[index];
}
