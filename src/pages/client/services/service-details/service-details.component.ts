import { Component, OnInit } from '@angular/core';
import {ModelPageComponent} from "../../../../shared/ui/templates/pages/model-page/model-page.component";

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.scss'],
  imports: [
    ModelPageComponent
  ]
})
export class ServiceDetailsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
