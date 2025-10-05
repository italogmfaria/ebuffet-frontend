import { Component, OnInit } from '@angular/core';
import { ModelPageComponent } from "../../../../shared/ui/templates/exports";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
  standalone: true,
  imports: [
    ModelPageComponent
  ],
  providers: [ModalController]
})
export class TermsComponent  implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }
}
