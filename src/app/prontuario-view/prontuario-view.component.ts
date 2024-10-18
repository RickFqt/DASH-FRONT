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
        // content: 'Conteúdo da primeira seção.',
        quesitos: [
          {
            enunciado: 'Quesito 1',
            tipoResposta: 'DISSERTATIVA_CURTA',
            opcoes: [],
            subquesitos: []
          },
          {
            enunciado: 'Quesito 2',
            tipoResposta: 'DISSERTATIVA_LONGA',
            opcoes: [],
            subquesitos: []
          }
        ],
        isVisible: true,
        subsections: [
          {
            title: 'Subseção 1.1',
            quesitos: [
              {
                enunciado: 'Quesito 1.1',
                tipoResposta: 'OBJETIVA_SIMPLES',
                opcoes: ['Opção 1', 'Opção 2', 'Opção 3'],
                subquesitos: []
              },
              {
                enunciado: 'Quesito 1.2',
                tipoResposta: 'OBJETIVA_MULTIPLA',
                opcoes: ['Opção 1', 'Opção 2', 'Opção 3'],
                subquesitos: []
              }
            ],
            isVisible: true,
            subsections: [
              {
                title: 'Subseção 1.1.1',
                quesitos: [
                  {
                    enunciado: 'Quesito 1.1.1',
                    tipoResposta: 'DISSERTATIVA_CURTA',
                    opcoes: [],
                    subquesitos: []
                  }
                ],
                isVisible: true,
                subsections: []
              }
            ]
          },
          { title: 'Subseção 1.2', quesitos: [], isVisible: true, subsections: [] }
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
