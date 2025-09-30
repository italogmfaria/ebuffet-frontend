import { Component, OnInit } from '@angular/core';
import {ModelPageComponent} from "../../../../shared/ui/templates/pages/model-page/model-page.component";

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
  imports: [
    ModelPageComponent
  ]
})
export class TermsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
