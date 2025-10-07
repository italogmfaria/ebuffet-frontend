import { Component, OnInit } from '@angular/core';
import {ModelPageComponent} from "../../../../shared/ui/templates/pages/model-page/model-page.component";

@Component({
    selector: 'app-food-details',
    templateUrl: './food-details.component.html',
    styleUrls: ['./food-details.component.scss'],
    imports: [
        ModelPageComponent
    ]
})
export class FoodDetailsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
