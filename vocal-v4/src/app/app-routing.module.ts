import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'connexion',
    loadChildren: () => import('./pages/connexion/connexion.module').then( m => m.ConnexionPageModule)
  },
  {
    path: 'feed',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./pages/feed/feed.module').then( m => m.FeedPageModule)
  },
  {
    path: 'password-forgot',
    loadChildren: () => import('./pages/password-forgot/password-forgot.module').then( m => m.PasswordForgotPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'inbox',
    loadChildren: () => import('./pages/inbox/inbox.module').then( m => m.InboxPageModule)
  },
  {
    path: 'discover',
    loadChildren: () => import('./pages/discover/discover.module').then( m => m.DiscoverPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'params',
    loadChildren: () => import('./pages/params/params.module').then( m => m.ParamsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
