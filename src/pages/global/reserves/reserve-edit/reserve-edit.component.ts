import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { ModelPageComponent } from '../../../../shared/ui/templates/exports';
import { ThemeService } from '../../../../shared/services/theme.service';

@Component({
  selector: 'app-reserve-edit',
  templateUrl: './reserve-edit.component.html',
  styleUrls: ['./reserve-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ModelPageComponent
  ],
  host: { class: 'ion-page' }
})
export class ReserveEditComponent implements OnInit {
  reserveId: string = '';
  reserveTitle: string = '';

  secondaryColor$ = this.themeService.secondaryColor$;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.reserveId = params['id'] || '';
      this.reserveTitle = params['title'] || 'Editar Reserva';
    });
  }

  onBackClick() {
    this.navCtrl.back();
  }
}
