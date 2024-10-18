import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SectionComponent } from '../section/section.component';

@Component({
  selector: 'app-prontuario-view',
  standalone: true,
  imports: [RouterModule, CommonModule, SectionComponent],
  templateUrl: './prontuario-view.component.html',
  styleUrl: './prontuario-view.component.css'
})
export class ProntuarioViewComponent {
  buttonSrc: string = 'button.png';

  prontuario = {
    title: 'Título do Prontuário',
    description: 'Aqui vai a descrição do prontuário.',
    sections: [
      {
        title: 'Primeira Seção',
        content: 'Conteúdo da primeira seção.',
        isVisible: true,
        subsections: [
          {
            title: 'Subseção 1.1',
            content: 'Conteúdo da subseção 1.1',
            isVisible: true,
            subsections: [
              {
                title: 'Subseção 1.1.1',
                content: 'Conteúdo da subseção 1.1.1',
                isVisible: true,
                subsections: []
              }
            ]
          },
          { title: 'Subseção 1.2', content: 'Conteúdo da subseção 1.2', isVisible: true, subsections: [] }
        ]
      },
      {
        title: 'Segunda Seção',
        content: 'Conteúdo da segunda seção.',
        isVisible: true,
        subsections: []
      }
    ]
  };

  onHoverButton() {
    this.buttonSrc = 'button_hover.png';
  }

  onLeaveButton() {
    this.buttonSrc = 'button.png';
  }

  // Método para alternar a visibilidade das seções
  toggleSection(index: number) {
    this.prontuario.sections[index].isVisible = !this.prontuario.sections[index].isVisible;
  }
}
