import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.model = [
      {
        label: 'Dispositivos',
        items: [
          {
            label: 'Seus Dispositivos',
            icon: 'pi pi-fw pi-server',
            routerLink: ['/', 'app'],
          },
          // {
          //   label: 'Configuração Múltipla',
          //   icon: 'pi pi-fw pi-database',
          //   routerLink: ['/', 'app'],
          // },
          {
            label: 'Novo Dispositivo',
            icon: 'pi pi-fw pi-cart-plus',
            routerLink: ['/', 'app', 'novo'],
          },
        ],
      },
    ];
  }
}
