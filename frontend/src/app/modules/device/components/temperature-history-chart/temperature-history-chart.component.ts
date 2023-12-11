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
  @Input() device?: Device;
  @Input() hideHistoryLine: boolean = false;

  data: any;
  options: any;

  constructor() {}

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
        }
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

  createTemperatureHistoryData(): Array<{ x: number; y: number }> | undefined {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
  
    return this.device?.temperatureHistory
      .filter((temperatureHistoryItem) => temperatureHistoryItem.time >= twentyFourHoursAgo.getTime())
      .map((temperatureHistoryItem) => {
        return {
          x: temperatureHistoryItem.time,
          y: temperatureHistoryItem.temperature,
        };
      });
  }

  createConfigTemperatureBasedOnHistoryTemperature(): Array<{
    x: number;
    y: number;
  }> {
    const datesBasedOnHistoryTemps = this.createTemperatureHistoryData()?.map(
      (register) => {
        return {
          x: register.x,
          y: this.getExpectedTemperatureInTime(register.x),
        };
      }
    );

    const datesBasedOnIntervals = this.device?.temperatureConfig.map(
      (interval) => {
        return {
          x: interval.timeToStop,
          y: interval.temperature,
        };
      }
    );

    datesBasedOnIntervals?.push({
      x:
        this.device?.temperatureConfig[
          this.device?.temperatureConfig.length - 1
        ].timeToStop ?? 0,
      y:
        this.device?.temperatureConfig[
          this.device?.temperatureConfig.length - 1
        ].temperature ?? 0,
    });

    return datesBasedOnIntervals ? [...datesBasedOnIntervals] : [];
  }

  getExpectedTemperatureInTime(time: number): number {
    const interval = this.device?.temperatureConfig.find(
      (interval) => time >= interval.timeToStop
    );
    return interval?.temperature || 0;
  }
}
