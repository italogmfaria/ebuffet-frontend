import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ThemeService} from "../../../../../core/services/theme.service";

@Component({
  selector: 'app-detail-bagde',
  templateUrl: './detail-bagde.component.html',
  styleUrls: ['./detail-bagde.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class DetailBagdeComponent implements OnInit {
  @Input() text: string = 'INDISPONÍVEL';
  secondaryColor$ = this.themeService.secondaryColor$;

  constructor(private themeService: ThemeService) { }

  ngOnInit() {
    // No need to load theme colors manually anymore
  }

}
