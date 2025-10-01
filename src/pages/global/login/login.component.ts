import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {
  FormPageComponent,
  DeleteButtonComponent,
  WhatsappButtonComponent,
  CancelButtonComponent,
  AddCircleComponent,
  CloseCircleComponent,
  DeleteCircleComponent,
  EditCircleComponent,
  ImageCircleComponent,
  NotificationCircleComponent,
  OpenCircleComponent,
  RemoveCircleComponent
} from '../../../shared/ui/templates/exports';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    FormPageComponent,
    DeleteButtonComponent,
    WhatsappButtonComponent,
    CancelButtonComponent,
    AddCircleComponent,
    CloseCircleComponent,
    DeleteCircleComponent,
    EditCircleComponent,
    ImageCircleComponent,
    NotificationCircleComponent,
    OpenCircleComponent,
    RemoveCircleComponent,
    IonicModule
  ],
  standalone: true
})
export class LoginComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
