import { Component, OnInit } from '@angular/core';
import {ModelPageComponent} from "../../../../shared/ui/templates/pages/model-page/model-page.component";

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    imports: [
        ModelPageComponent
    ]
})
export class ForgotPasswordComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
