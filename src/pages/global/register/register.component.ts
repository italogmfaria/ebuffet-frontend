import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormPageComponent } from '../../../shared/ui/templates/form-page/form-page.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, FormPageComponent]
})
export class RegisterComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
