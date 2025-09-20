import { Component, OnInit } from '@angular/core';
import {FormPageComponent} from "../../../../shared/ui/templates/form-page/form-page.component";
import {ModelPageComponent} from "../../../../shared/ui/templates/model-page/model-page.component";

@Component({
  selector: 'app-register-confirmation',
  templateUrl: './register-confirmation.component.html',
  styleUrls: ['./register-confirmation.component.scss'],
  imports: [
    ModelPageComponent
  ]
})
export class RegisterConfirmationComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
