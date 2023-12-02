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
  actualTemperatureInfos: {
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
  if (timeToStart === 0) {
    timeToStart = 1440;
  }

  if (timeToStop === 0) {
    timeToStop = 1440;
  }

  prepareToReceiveNewInterval(device, timeToStart, timeToStop);
  device.temperatureConfig.push({ timeToStop, temperature });
  sortIntervals(device);
  mergeSameTemperatureIntervals(device);
}

function prepareToReceiveNewInterval(
  device: Device,
  timeToStart: number,
  timeToStop: number
): void {
  function handleUpdateStartInterval(): void {
    const startIndex = device.temperatureConfig.indexOf(
      initialOverwriteInterval
    );

    if (startIndex === -1) return;

    const indexBefore =
      startIndex > 0 ? startIndex - 1 : device.temperatureConfig.length - 1;

    if (device.temperatureConfig[indexBefore].timeToStop === timeToStart) {
      if (device.temperatureConfig[startIndex].timeToStop <= timeToStop) {
        device.temperatureConfig.splice(startIndex, 1);
        return;
      }

      device.temperatureConfig[startIndex].timeToStop = timeToStart;
      return;
    }

    const newStartTimeInterval = {
      temperature: initialOverwriteInterval.temperature,
      timeToStop: timeToStart,
    };

    device.temperatureConfig.push(newStartTimeInterval);
  }

  function handleUpdateFinalInterval(): void {
    const stopIndex = device.temperatureConfig.indexOf(finalOverwriteInterval);

    if (stopIndex === -1) return;

    if (device.temperatureConfig[stopIndex].timeToStop === timeToStop) {
      device.temperatureConfig.splice(stopIndex, 1);
    }
  }

  const initialOverwriteInterval = findIntervalByTime(device, timeToStart);
  const finalOverwriteInterval = findIntervalByTime(device, timeToStop);

  removeIntervalsBetween(
    device,
    device.temperatureConfig.indexOf(initialOverwriteInterval),
    device.temperatureConfig.indexOf(finalOverwriteInterval)
  );

  handleUpdateStartInterval();
  handleUpdateFinalInterval();
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
      device.temperatureConfig.length - 1
    );
    device.temperatureConfig.splice(0, indexStop - 1);
  }

  indexStart <= indexStop ? handleFinalHigher() : handleInitialHigher();
}

function mergeSameTemperatureIntervals(device: Device): void {
  const { temperatureConfig } = device;
  if (temperatureConfig.length < 2) return;

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
): void {}

export function editIntervalFromDeviceConfig(
  device: Device,
  indexToEdit: number,
  newInterval: TemperatureInterval
): void {}

function sortIntervals(device: Device): void {
  device.temperatureConfig.sort((a, b) => a.timeToStop - b.timeToStop);
}

function findIntervalIndexByTime(device: Device, time: number): number {
  if (time === 1440) {
    time = 0;
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
