import { Routes } from '@angular/router';
import { WelcomePage } from './components/welcome-page/welcome-page';
import { TaskPage } from './components/task-page/task-page';

export const routes: Routes = [
  {
    path: '',
    component: WelcomePage,
  },
  {
    path: 'task',
    component: TaskPage,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
