import { Component, OnInit } from '@angular/core';
import {ModelPageComponent} from "../../../../shared/ui/templates/pages/model-page/model-page.component";

@Component({
  selector: 'app-profile-events',
  templateUrl: './profile-events.component.html',
  styleUrls: ['./profile-events.component.scss'],
  imports: [
    ModelPageComponent
  ]
})
export class ProfileEventsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
