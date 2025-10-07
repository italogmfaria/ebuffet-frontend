import { Component, OnInit } from '@angular/core';
import {ModelPageComponent} from "../../../shared/ui/templates/pages/model-page/model-page.component";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  imports: [
    ModelPageComponent
  ]
})
export class NotificationsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
