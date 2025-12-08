import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ModelPageComponent } from '../../../../shared/ui/templates/pages/model-page/model-page.component';

@Component({
  selector: 'app-reserve-details',
  templateUrl: './reserve-details.component.html',
  styleUrls: ['./reserve-details.component.scss'],
  standalone: true,
  imports: [CommonModule, ModelPageComponent],
  host: { class: 'ion-page' }
})
export class ReserveDetailsComponent implements OnInit {
  reserveTitle: string = '';
  reserveStatus: string = '';

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.reserveTitle = params['title'] || 'Reserva';
      this.reserveStatus = params['status'] || '';
    });
  }

  onBackClick() {
    this.location.back();
  }
}
