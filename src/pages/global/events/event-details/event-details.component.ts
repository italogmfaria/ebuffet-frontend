import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ModelPageComponent } from '../../../../shared/ui/templates/pages/model-page/model-page.component';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
  standalone: true,
  imports: [CommonModule, ModelPageComponent],
  host: { class: 'ion-page' }
})
export class EventDetailsComponent implements OnInit {
  eventTitle: string = '';
  eventStatus: string = '';

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    // Recebe os parâmetros da rota
    this.route.queryParams.subscribe(params => {
      this.eventTitle = params['title'] || 'Evento';
      this.eventStatus = params['status'] || '';
    });
  }

  onBackClick() {
    this.location.back();
  }
}
