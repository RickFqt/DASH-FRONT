import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-prontuario-view',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './prontuario-view.component.html',
  styleUrl: './prontuario-view.component.css'
})
export class ProntuarioViewComponent {
  buttonSrc: string = 'button.png';

  onHoverButton() {
    this.buttonSrc = 'button_hover.png';
  }

  onLeaveButton() {
    this.buttonSrc = 'button.png';
  }
}
