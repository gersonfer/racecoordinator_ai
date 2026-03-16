import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UndoManager } from '../undo-redo-controls/undo-manager';

@Component({
  selector: 'app-editor-title',
  templateUrl: './editor-title.component.html',
  styleUrls: ['./editor-title.component.css'],
  standalone: false
})
export class EditorTitleComponent {
  @Input() titleKey: string = '';
  @Input() backRoute: string = '';
  @Input() backQueryParams: any = {};
  @Input() backConfirm: boolean = false;
  @Input() backConfirmTitle: string = '';
  @Input() backConfirmMessage: string = '';
  @Input() undoManager!: UndoManager<any>;
  @Input() showUndo: boolean = true;
  @Input() showRedo: boolean = true;
  @Input() showHelp: boolean = true;

  @Output() help = new EventEmitter<void>();

  onHelp() {
    this.help.emit();
  }
}
