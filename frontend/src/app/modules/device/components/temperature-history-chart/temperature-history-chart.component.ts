import { Component, Input, OnInit } from '@angular/core';
import { Device } from '../../shared/device.model';
import { ptBR } from 'date-fns/locale';
import 'chartjs-adapter-date-fns';

@Component({
  selector: 'app-temperature-history-chart',
  templateUrl: './temperature-history-chart.component.html',
  styleUrls: ['./temperature-history-chart.component.scss'],
})
export class TemperatureHistoryChartComponent implements OnInit {
  device: Device;
  @Input() hideHistoryLine: boolean = false;

  data: any;
  options: any;

  constructor() {
    this.device = {
      id: 'asdasldkjf1223',
      name: 'Device 1',
      actualTemperature: 25,
      temperatureConfig: [
        {
          initialTime: new Date('2023-06-28T00:00:00'),
          finalTime: new Date('2023-06-28T05:00:00'),
          temperature: 40,
        },
        {
          initialTime: new Date('2023-06-28T05:00:00'),
          finalTime: new Date('2023-06-28T10:00:00'),
          temperature: 10,
        },
        {
          initialTime: new Date('2023-06-28T10:00:00'),
          finalTime: new Date('2023-06-28T15:30:00'),
          temperature: 0,
        },
        {
          initialTime: new Date('2023-06-28T15:30:00'),
          finalTime: new Date('2023-06-28T24:00:00'),
          temperature: 0,
        },
      ],
      temperatureHistory: [
        { temperature: 39, time: new Date('2023-06-28T00:00:00') },
        { temperature: 12, time: new Date('2023-06-28T06:00:00') },
        { temperature: 9, time: new Date('2023-06-28T09:00:00') },
        { temperature: -4, time: new Date('2023-06-28T10:00:00') },
        { temperature: -6, time: new Date('2023-06-28T11:30:00') },
        { temperature: 2, time: new Date('2023-06-28T12:00:00') },
      ],
    };
  }

  ngOnInit(): void {
    this.createChart();
  }

  createChart(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const textColorDanger = documentStyle.getPropertyValue(
      '--text-color-danger'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: this.createDayLabels(),
      datasets: [
        {
          label: 'Temperatura Interna',
          data: this.createTemperatureHistoryData(),
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          tension: 0.4,
        },
        {
          label: 'Temperatura Desejada',
          data: this.createConfigTemperatureBasedOnHistoryTemperature(),
          fill: false,
          borderColor: documentStyle.getPropertyValue('--red-500'),
          tension: 0,
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 1.5,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          type: 'time',
          adapters: {
            date: {
              locale: ptBR,
            },
          },
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorDanger,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  createDayLabels(): Date[] {
    const createHoursArray = () => {
      return [...Array(25).keys()];
    };

    return createHoursArray().map((hour) => {
      const date = new Date();
      date.setHours(hour);
      return date;
    });
  }

  createTemperatureHistoryData(): Array<{ x: Date; y: number }> {
    if (this.hideHistoryLine) return [];
    return this.device.temperatureHistory.map((temperatureHistoryItem) => {
      return {
        x: temperatureHistoryItem.time,
        y: temperatureHistoryItem.temperature,
      };
    });
  }

  createConfigTemperatureBasedOnHistoryTemperature(): Array<{
    x: Date;
    y: number;
  }> {
    const datesBasedOnHistoryTemps = this.createTemperatureHistoryData().map(
      (register) => {
        return {
          x: register.x,
          y: this.getExpectedTemperatureInTime(register.x),
        };
      }
    );

    const datesBasedOnIntervals = this.device.temperatureConfig.map(
      (interval) => {
        return {
          x: interval.initialTime,
          y: interval.temperature,
        };
      }
    );

    datesBasedOnIntervals.push({
      x: this.device.temperatureConfig[this.device.temperatureConfig.length - 1]
        .finalTime,
      y: this.device.temperatureConfig[this.device.temperatureConfig.length - 1]
        .temperature,
    });

    return [...datesBasedOnIntervals];
  }

  getExpectedTemperatureInTime(time: Date): number {
    const interval = this.device.temperatureConfig.find(
      (interval) => time >= interval.initialTime && time <= interval.finalTime
    );
    return interval?.temperature || 0;
  }
}
