import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { person } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import {ThemeService} from "../../../../../core/services/theme.service";

@Component({
  selector: 'app-profile-placeholder',
  templateUrl: './profile-placeholder.component.html',
  styleUrls: ['./profile-placeholder.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ProfilePlaceholderComponent implements OnInit {
  protected readonly personIcon = person;
  primaryColor$ = this.themeService.primaryColor$;

  constructor(private themeService: ThemeService) { }

  ngOnInit() {}

}
