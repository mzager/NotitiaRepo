import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WorkspaceComponent } from 'app/component/workspace/workspace.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        component: WorkspaceComponent
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
    ])
  ],
  providers: [],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
