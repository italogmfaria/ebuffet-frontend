import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import {
  ModelPageComponent,
  PrimaryButtonComponent,
  TextInputComponent,
  TextareaInputComponent
} from '../../../../shared/ui/templates/exports';
import { ThemeService } from '../../../../core/services/theme.service';
import { EventoService } from '../../../../features/events/api/evento.api.service';
import { SessionService } from '../../../../core/services/session.service';
import { Subscription } from 'rxjs';
import { EventoUpdateRequest, EnumStatusEvento, EnumStatus } from '../../../../features/events/model/events.models';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModelPageComponent,
    PrimaryButtonComponent,
    TextInputComponent,
    TextareaInputComponent
  ],
  host: { class: 'ion-page' }
})
export class EventEditComponent implements OnInit, OnDestroy {
  eventId: number = 0;
  eventTitle: string = 'Editar Evento';

  // Dados do evento
  eventName: string = '';
  eventDescription: string = '';
  eventStartDate: string = ''; // YYYY-MM-DD
  eventStartTime: string = ''; // HH:MM
  eventEndDate: string = ''; // YYYY-MM-DD
  eventEndTime: string = ''; // HH:MM
  eventValue: string = '';
  eventStatus: EnumStatusEvento = 'PENDENTE';
  status: EnumStatus = 'ATIVO';

  isLoading: boolean = false;
  isSaving: boolean = false;

  private subs = new Subscription();

  secondaryColor$ = this.themeService.secondaryColor$;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private themeService: ThemeService,
    private eventoService: EventoService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.subs.add(
      this.route.queryParams.subscribe(params => {
        this.eventId = Number(params['id'] || 0);
        if (this.eventId) {
          this.loadEvent();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private loadEvent() {
    this.isLoading = true;

    this.subs.add(
      this.eventoService.getById(this.eventId).subscribe({
        next: (event) => {
          this.eventName = event.nome;
          this.eventDescription = event.descricao || '';
          this.eventStatus = event.statusEvento as EnumStatusEvento;
          this.status = event.status as EnumStatus;

          // Parse início (ISO datetime string)
          if (event.inicio) {
            const [date, time] = event.inicio.split('T');
            this.eventStartDate = date;
            this.eventStartTime = time ? time.substring(0, 5) : '';
          }

          // Parse fim (ISO datetime string)
          if (event.fim) {
            const [date, time] = event.fim.split('T');
            this.eventEndDate = date;
            this.eventEndTime = time ? time.substring(0, 5) : '';
          }

          // Parse valor
          if (event.valor != null && event.valor !== '') {
            this.eventValue = String(event.valor);
          }

          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar evento', err);
          this.isLoading = false;
        }
      })
    );
  }

  onBackClick() {
    this.navCtrl.back();
  }

  // Validação
  get isFormValid(): boolean {
    return !!(
      this.eventName.trim() &&
      this.eventStartDate.trim() &&
      this.eventStartTime.trim() &&
      this.eventEndDate.trim() &&
      this.eventEndTime.trim()
    );
  }

  // Salvar
  onSave() {
    if (!this.isFormValid || this.isSaving) return;

    const user = this.sessionService.getUser();
    if (!user?.id) return;

    this.isSaving = true;

    // Combina data e hora em ISO datetime string
    const inicio = `${this.eventStartDate}T${this.eventStartTime}:00`;
    const fim = `${this.eventEndDate}T${this.eventEndTime}:00`;

    const body: EventoUpdateRequest = {
      nome: this.eventName,
      statusEvento: this.eventStatus,
      status: this.status,
      inicio,
      fim,
      valor: this.eventValue ? parseFloat(this.eventValue) : 0,
      descricao: this.eventDescription || undefined
    };

    this.subs.add(
      this.eventoService.update(this.eventId, body, user.id).subscribe({
        next: () => {
          this.isSaving = false;
          this.navCtrl.navigateBack('/events/event-details', {
            queryParams: { id: this.eventId }
          });
        },
        error: (err) => {
          console.error('Erro ao atualizar evento', err);
          this.isSaving = false;
          // TODO: Mostrar mensagem de erro ao usuário
        }
      })
    );
  }
}
