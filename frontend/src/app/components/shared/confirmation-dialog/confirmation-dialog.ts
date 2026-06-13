import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.scss'
})
export class ConfirmationDialogComponent {
  show = input<boolean>(false);
  title = input<string>('Confirmação');
  message = input<string>('Todas as informacoes serao perdidas, deseja continuar?');
  backLabel = input<string>('back');
  nextLabel = input<string>('next');

  back = output<void>();
  next = output<void>();

  onBack() {
    this.back.emit();
  }

  onNext() {
    this.next.emit();
  }
}
