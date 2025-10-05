import { Component, OnInit } from '@angular/core';
import {ModelPageComponent} from "../../../../shared/ui/templates/pages/model-page/model-page.component";

@Component({
  selector: 'app-profile-reserves',
  templateUrl: './profile-reserves.component.html',
  styleUrls: ['./profile-reserves.component.scss'],
  imports: [
    ModelPageComponent
  ]
})
export class ProfileReservesComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
