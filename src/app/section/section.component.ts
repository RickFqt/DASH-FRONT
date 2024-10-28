import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { QuesitoComponent } from "../quesito/quesito.component";
import { SecaoData, SecaoUpdate } from '../secao';
import { SecaoService } from '../secao.service';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CommonModule, QuesitoComponent, FormsModule],
  templateUrl: './section.component.html',
  styleUrl: './section.component.css'
})
export class SectionComponent {
  @Input() section: SecaoData = new SecaoData();
  @Input() sectionIndex: string = ''; // Para numerar as seções e subseções
  @Input() estadoProntuario: string = '';
  @Output() secaoAtualizada = new EventEmitter<SecaoData>();
  isVisible: boolean = true;
  secaoService: SecaoService = inject(SecaoService);

  toggleSection() {
    this.isVisible = !this.isVisible;
  }

  // -------------------- Funcoes e atributos para o estado de edicao --------------------
  secaoEditando: boolean = false;  // ID da seção em edição
  secaoEditandoTitulo: string = '';  // Título temporário

  // Método para iniciar a edição da seção
  editarSecao() {
    this.secaoEditando = true;
    this.secaoEditandoTitulo = this.section.titulo;
  }

  // Método para salvar a edição
  async salvarEdicaoSecao() {
    const secaoNova = { ...this.section, titulo: this.secaoEditandoTitulo };

    // Atualiza a seção no backend
    const secaoAtualizada = await firstValueFrom(this.secaoService.update(this.section.id, secaoNova));

    // Atualiza a seção na lista
    this.section.titulo = secaoAtualizada.titulo;
    this.section.ordem = secaoAtualizada.ordem;
    this.section.nivel = secaoAtualizada.nivel;

    this.secaoAtualizada.emit(this.section);

    this.secaoEditando = false;

  }

  // Método para cancelar a edição
  cancelarEdicao() {
    this.secaoEditando = false;
    this.secaoEditandoTitulo = '';
  }
}
