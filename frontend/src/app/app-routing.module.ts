import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from './layout/app.layout.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { LoggedGuard } from './guards/logged.guard';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'app',
          component: AppLayoutComponent,
          canActivate: [AuthGuard],
          children: [
            {
              path: '',
              loadChildren: () =>
                import('./modules/device/device.module').then(
                  (m) => m.DeviceModule
                ),
            },
          ],
        },
        {
          path: 'auth',
          canActivate: [LoggedGuard],
          loadChildren: () =>
            import('./modules/authentication/authentication.module').then(
              (m) => m.AuthenticationModule
            ),
        },
        {
          path: '',
          loadChildren: () =>
            import('./modules/landing/landing.module').then(
              (m) => m.LandingModule
            ),
        },
        { path: 'notfound', component: NotFoundComponent },
        { path: '**', redirectTo: '/notfound' },
      ],
      {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
        onSameUrlNavigation: 'reload',
      }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
