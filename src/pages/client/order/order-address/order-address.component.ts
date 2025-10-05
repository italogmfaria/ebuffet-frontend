import { Component, OnInit } from '@angular/core';
import {ModelPageComponent} from "../../../../shared/ui/templates/pages/model-page/model-page.component";

@Component({
  selector: 'app-order-address',
  templateUrl: './order-address.component.html',
  styleUrls: ['./order-address.component.scss'],
  imports: [
    ModelPageComponent
  ]
})
export class OrderAddressComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
