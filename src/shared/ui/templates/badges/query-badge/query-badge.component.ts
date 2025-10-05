import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../services/theme.service';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-query-badge',
  templateUrl: './query-badge.component.html',
  styleUrls: ['./query-badge.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class QueryBadgeComponent implements OnInit {
  secondaryColor = '';

  @Input() icon: string = 'help';
  @Input() iconColor: string = '#fff';

  constructor(private themeService: ThemeService) { }

  ngOnInit() {
    const theme = this.themeService.getCurrentTheme();
    if (theme) {
      this.secondaryColor = theme.secondaryColor;
    }
  }

}
