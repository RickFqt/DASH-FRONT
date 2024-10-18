import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { QuesitoComponent } from "../quesito/quesito.component";

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CommonModule, QuesitoComponent],
  templateUrl: './section.component.html',
  styleUrl: './section.component.css'
})
export class SectionComponent {
  @Input() section: any;
  @Input() sectionIndex: string = ''; // Para numerar as seções e subseções

  toggleSection() {
    this.section.isVisible = !this.section.isVisible;
  }
}
