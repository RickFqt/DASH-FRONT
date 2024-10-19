import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { QuesitoComponent } from "../quesito/quesito.component";
import { SecaoData } from '../secao';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CommonModule, QuesitoComponent],
  templateUrl: './section.component.html',
  styleUrl: './section.component.css'
})
export class SectionComponent {
  @Input() section: SecaoData = new SecaoData();
  @Input() sectionIndex: string = ''; // Para numerar as seções e subseções
  @Input() estadoProntuario: string = '';
  isVisible: boolean = true;

  toggleSection() {
    this.isVisible = !this.isVisible;
  }
}
