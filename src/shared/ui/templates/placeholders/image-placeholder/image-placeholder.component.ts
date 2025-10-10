import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { image } from 'ionicons/icons';

@Component({
  selector: 'app-image-placeholder',
  templateUrl: './image-placeholder.component.html',
  styleUrls: ['./image-placeholder.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class ImagePlaceholderComponent implements OnInit {
  protected readonly imageIcon = image;

  constructor() { }

  ngOnInit() {}
}
