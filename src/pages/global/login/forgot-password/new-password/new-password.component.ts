import { Component, OnInit } from '@angular/core';
import {ModelPageComponent} from "../../../../../shared/ui/templates/pages/model-page/model-page.component";

@Component({
    selector: 'app-new-password',
    templateUrl: './new-password.component.html',
    styleUrls: ['./new-password.component.scss'],
    imports: [
        ModelPageComponent
    ]
})
export class NewPasswordComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
