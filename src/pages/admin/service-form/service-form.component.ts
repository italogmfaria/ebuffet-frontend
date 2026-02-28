import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
  ModelPageComponent,
  ConfirmationModalComponent,
  TextInputComponent,
  TextareaInputComponent,
  SelectedInputComponent,
  SelectModalComponent,
  ImagePlaceholderComponent,
  PrimaryButtonComponent,
  ImageCircleComponent
} from '../../../shared/ui/templates/exports';
import { NavController } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { ServicesApiService } from '../../../features/services/api/services.api';
import { ToastService } from '../../../core/services/toast.service';
import { SessionService } from '../../../core/services/session.service';
import { Subscription } from 'rxjs';
import { SelectOption } from '../../../shared/ui/templates/inputs/selected-input/selected-input.component';
import { EnumCategoria, CategoriasLabels } from '../../../core/enums/categoria.enum';
import { EnumStatus } from '../../../features/services/model/services.model';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ModelPageComponent,
    TextInputComponent,
    TextareaInputComponent,
    SelectedInputComponent,
    SelectModalComponent,
    ImagePlaceholderComponent,
    PrimaryButtonComponent,
    ConfirmationModalComponent,
    ImageCircleComponent
  ],
  host: { class: 'ion-page' }
})
export class ServiceFormComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;

  isEditMode = false;
  serviceId: number | null = null;
  pageTitle = 'Novo Serviço';

  serviceName = '';
  serviceDescription = '';
  selectedCategory = '';
  imagePreview: string | null = null;
  selectedFile: File | null = null;

  showDeleteModal = false;
  showCategoryModal = false;
  categoryOptions: SelectOption[] = [];

  private subs = new Subscription();

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private servicesApiService: ServicesApiService,
    private toastService: ToastService,
    private sessionService: SessionService
  ) {
    this.initializeCategoryOptions();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.serviceId = Number(id);
      this.isEditMode = true;
      this.pageTitle = 'Editar Serviço';
      this.loadService(this.serviceId);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private initializeCategoryOptions() {
    this.categoryOptions = [
      { value: EnumCategoria.CASAMENTO, label: CategoriasLabels[EnumCategoria.CASAMENTO] },
      { value: EnumCategoria.ANIVERSARIO, label: CategoriasLabels[EnumCategoria.ANIVERSARIO] },
      { value: EnumCategoria.FORMATURA, label: CategoriasLabels[EnumCategoria.FORMATURA] },
      { value: EnumCategoria.CONFRATERNIZACAO, label: CategoriasLabels[EnumCategoria.CONFRATERNIZACAO] },
      { value: EnumCategoria.BATIZADO, label: CategoriasLabels[EnumCategoria.BATIZADO] },
      { value: EnumCategoria.BODAS, label: CategoriasLabels[EnumCategoria.BODAS] },
      { value: EnumCategoria.CHA_REVELACAO, label: CategoriasLabels[EnumCategoria.CHA_REVELACAO] },
      { value: EnumCategoria.NOIVADO, label: CategoriasLabels[EnumCategoria.NOIVADO] },
      { value: EnumCategoria.NATAL, label: CategoriasLabels[EnumCategoria.NATAL] },
      { value: EnumCategoria.OUTROS, label: CategoriasLabels[EnumCategoria.OUTROS] }
    ];
  }

  loadService(id: number) {
    this.fetchService(id);
  }

  private fetchService(id: number) {
    this.subs.add(
      this.servicesApiService.getById(id).subscribe({
        next: (service) => {
          this.serviceName = service.nome;
          this.serviceDescription = service.descricao;
          this.selectedCategory = service.categoria;
          this.imagePreview = service.imageUrl || null;
        },
        error: (err: any) => {
          console.error('Erro ao carregar serviço', err);
          this.toastService.error('Não foi possível carregar os dados do serviço.');
          this.navCtrl.navigateBack('/admin/manage-services');
        }
      })
    );
  }

  onImageSelect() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onCategoryClick() {
    this.showCategoryModal = true;
  }

  onCategoryModalClose() {
    this.showCategoryModal = false;
  }

  onCategorySelect(value: string) {
    this.selectedCategory = value;
    this.showCategoryModal = false;
  }

  onBackClick() {
    this.navCtrl.navigateBack('/admin/manage-services');
  }

  onSubmit() {
    if (!this.serviceName || !this.serviceDescription || !this.selectedCategory) {
      this.toastService.warning('Preencha todos os campos obrigatórios.');
      return;
    }

    if (this.isEditMode && this.serviceId) {
      this.updateService(this.serviceId);
    } else {
      this.createService();
    }
  }

  private createService() {
    const user = this.sessionService.getUser();
    if (!user?.id) {
      this.toastService.error('Erro ao identificar usuário');
      return;
    }

    this.subs.add(
      this.servicesApiService.create({
        nome: this.serviceName,
        descricao: this.serviceDescription,
        categoria: this.selectedCategory as EnumCategoria,
        status: EnumStatus.ATIVO
      }, user.id, this.selectedFile || undefined).subscribe({
        next: () => {
          this.toastService.success('Serviço criado com sucesso!');
          this.navCtrl.navigateBack('/admin/manage-services');
        },
        error: (err: any) => {
          console.error('Erro ao criar serviço', err);
          this.toastService.error('Não foi possível criar o serviço.');
        }
      })
    );
  }

  private updateService(id: number) {
    const user = this.sessionService.getUser();
    if (!user?.id) {
      this.toastService.error('Erro ao identificar usuário');
      return;
    }

    this.subs.add(
      this.servicesApiService.update(id, {
        nome: this.serviceName,
        descricao: this.serviceDescription,
        categoria: this.selectedCategory as EnumCategoria,
        status: EnumStatus.ATIVO
      }, user.id, this.selectedFile || undefined).subscribe({
        next: () => {
          this.toastService.success('Serviço atualizado com sucesso!');
          this.navCtrl.navigateBack('/admin/manage-services');
        },
        error: (err: any) => {
          console.error('Erro ao atualizar serviço', err);
          this.toastService.error('Não foi possível atualizar o serviço.');
        }
      })
    );
  }

  onDeleteClick() {
    this.showDeleteModal = true;
  }

  onDeleteModalClose() {
    this.showDeleteModal = false;
  }

  onDeleteModalConfirm() {
    this.showDeleteModal = false;
  }

  onDeleteModalCancel() {
    if (this.isEditMode && this.serviceId) {
      this.deleteService(this.serviceId);
    }
    this.showDeleteModal = false;
  }

  private deleteService(id: number) {
    const user = this.sessionService.getUser();
    if (!user?.id) {
      this.toastService.error('Erro ao identificar usuário');
      return;
    }

    this.subs.add(
      this.servicesApiService.delete(id, user.id, true).subscribe({
        next: () => {
          this.toastService.success('Serviço excluído com sucesso!');
          this.navCtrl.navigateBack('/admin/manage-services');
        },
        error: (err: any) => {
          console.error('Erro ao excluir serviço', err);
          this.toastService.error('Não foi possível excluir o serviço.');
        }
      })
    );
  }
}
