import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-quesito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quesito.component.html',
  styleUrl: './quesito.component.css'
})
export class QuesitoComponent {
  @Input() quesito: any;
  @Input() quesitoIndex: string = '';

}
