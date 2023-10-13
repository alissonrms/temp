import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { NotFoundComponent } from './components/not-found/not-found.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: 'app', component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('./modules/device/device.module').then(m => m.DeviceModule) }
                ]
            },
            { path: 'auth', loadChildren: () => import('./modules/authentication/authentication.module').then(m => m.AuthenticationModule) },
            { path: '', loadChildren: () => import('./modules/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotFoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
