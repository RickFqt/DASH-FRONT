import { Component, inject } from '@angular/core';
import { Prontuario } from '../prontuario';
import { ProntuarioService } from '../prontuario.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  prontuarioService: ProntuarioService = inject(ProntuarioService);
  router: Router = inject(Router);

  prontuarioList: Prontuario[] = [];
  filteredProntuarioList: Prontuario[] = [];

  ngOnInit() {
    this.carregarProntuarios();
  }

  visualizarProntuario(id: number) {
    this.router.navigate(['/prontuario', id], { queryParams: { estado: 'visualizacao' } });
  }

  responderProntuario(id: number) {
    // Lógica para responder prontuário
  }

  copiarProntuario(id: number) {
    // Lógica para copiar prontuário
  }

  deletarProntuario(id: number) {
    if (confirm('Tem certeza que deseja deletar este prontuário?')) {
      this.prontuarioService.delete(id).subscribe(() => {
        this.carregarProntuarios(); // Atualiza lista
      });
    }
  }

  carregarProntuarios() {
    // TODO: Mudar isso para carregar apenas os prontuários do usuário logado
    this.prontuarioService.getAll().subscribe((data) => {
      this.prontuarioList = data;
    });
  }
}
