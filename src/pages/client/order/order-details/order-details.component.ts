import { Component, OnInit } from '@angular/core';
import {ModelPageComponent} from "../../../../shared/ui/templates/pages/model-page/model-page.component";

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  imports: [
    ModelPageComponent
  ]
})
export class OrderDetailsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
