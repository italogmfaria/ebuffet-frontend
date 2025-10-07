import { Component, OnInit } from '@angular/core';
import {ModelPageComponent} from "../../../../shared/ui/templates/pages/model-page/model-page.component";

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss'],
  imports: [
    ModelPageComponent
  ]
})
export class OrderConfirmationComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
