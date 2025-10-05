import { Component, OnInit } from '@angular/core';
import { FormPageComponent } from "../../../shared/ui/templates/exports";
import {IonGrid} from "@ionic/angular/standalone";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: true,
  imports: [
    FormPageComponent,
    IonGrid
  ],
    host: { class: 'ion-page' }
})
export class DashboardComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
