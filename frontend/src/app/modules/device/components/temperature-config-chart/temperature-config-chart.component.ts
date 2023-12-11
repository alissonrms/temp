import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { TemperatureInterval } from '../../shared/device.model';
import { convertDailyMinutesTimestampToFormattedDate } from 'src/app/utils/utils';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Chart } from 'chart.js';
import { customBlueTones, customRedTones } from '../../shared/colors';
import { MenuItem } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
Chart.register(annotationPlugin);

@Component({
  selector: 'app-temperature-config-chart',
  templateUrl: './temperature-config-chart.component.html',
  styleUrls: ['./temperature-config-chart.component.scss'],
})
export class TemperatureConfigChartComponent {
  @Input() temperatureConfig: TemperatureInterval[] = [];
  data: any;
  options: any;
  @Output() intervalClicked = new EventEmitter<any>();

  ngOnChanges(changes: SimpleChanges) {
    this.defineOptions();
    this.mapData();
  }

  defineOptions(): void {
    const lastIntervalTimeToStop =
      this.temperatureConfig[this.temperatureConfig.length - 1].timeToStop === 0
        ? 1440
        : this.temperatureConfig[this.temperatureConfig.length - 1].timeToStop;
    const degreesToRotate = ((lastIntervalTimeToStop - 1440) * 360) / 1440;
    const rotation = degreesToRotate;

    this.options = {
      aspectRatio: 1,
      rotation,
      cutoutPercentage: 0,
      responsive: true,
      events: ['mousemove'],
      plugins: {
        tooltip: {
          enabled: true,
          callbacks: {
            label: () => '',
          },
        },
        title: {
          display: true,
          text: 'Relógio de Configuração',
        },
      },
    };
  }

  mapData(): void {
    const data = this.temperatureConfig.map((config, index, array) => {
      const prevInterval =
        index > 0 ? array[index - 1] : array[array.length - 1];
      const prevIntervalTimeToStop =
        prevInterval.timeToStop === 1440 ? 0 : prevInterval.timeToStop;

      return {
        value:
          prevIntervalTimeToStop > config.timeToStop
            ? config.timeToStop + 1440 - prevIntervalTimeToStop
            : config.timeToStop - prevIntervalTimeToStop,
        color: this.calculateIntervalColor(config.temperature),
      };
    });

    const labels = this.temperatureConfig.map((config, index, array) => {
      const prevInterval =
        index > 0 ? array[index - 1] : array[array.length - 1];

      return `${convertDailyMinutesTimestampToFormattedDate(
        prevInterval.timeToStop === 1440 ? 0 : prevInterval.timeToStop
      )} - ${convertDailyMinutesTimestampToFormattedDate(config.timeToStop)}\n${
        config.temperature
      }°C`;
    });

    this.data = {
      labels,
      datasets: [
        {
          data: data.map((item) => item.value),
          backgroundColor: data.map((item) => item.color),
        },
      ],
    };
  }

  calculateIntervalColor(temperature: number): string {
    const color =
      temperature <= 10
        ? customBlueTones[temperature + 10] ||
          customBlueTones[customBlueTones.length - 1]
        : customRedTones[temperature - 11] ||
          customRedTones[customRedTones.length - 1];
          
    return color;
  }

  handleIntervalClick(event: any): void {
    this.intervalClicked.emit(event);
  }
}
