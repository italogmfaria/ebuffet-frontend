import { Component, OnInit } from '@angular/core';
import {ModelPageComponent} from "../../../../shared/ui/templates/pages/model-page/model-page.component";

@Component({
    selector: 'app-profile-edit',
    templateUrl: './profile-edit.component.html',
    styleUrls: ['./profile-edit.component.scss'],
    imports: [
        ModelPageComponent
    ]
})
export class ProfileEditComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
