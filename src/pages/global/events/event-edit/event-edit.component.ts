import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { ModelPageComponent } from '../../../../shared/ui/templates/exports';
import { ThemeService } from '../../../../shared/services/theme.service';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ModelPageComponent
  ],
  host: { class: 'ion-page' }
})
export class EventEditComponent implements OnInit {
  eventId: string = '';
  eventTitle: string = '';

  secondaryColor$ = this.themeService.secondaryColor$;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.eventId = params['id'] || '';
      this.eventTitle = params['title'] || 'Editar Evento';
    });
  }

  onBackClick() {
    this.navCtrl.back();
  }
}
