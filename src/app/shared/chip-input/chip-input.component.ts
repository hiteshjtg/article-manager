import {Component, inject, Output, EventEmitter, Input} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipEditedEvent, MatChipInputEvent} from '@angular/material/chips';
import {LiveAnnouncer} from '@angular/cdk/a11y';


@Component({
  selector: 'app-chip-input',
  templateUrl: './chip-input.component.html',
  styleUrl: './chip-input.component.scss'
})

export class ChipInputComponent {
    @Output() newTagEvent = new EventEmitter<string[]>(); //Output' accepts too few arguments to be used as a decorator here. Did you mean to call it first and write '@Output()'?ts(1329)
    @Input() tags!: string[]

    addOnBlur = true;
    readonly separatorKeysCodes = [ENTER, COMMA] as const;

    announcer = inject(LiveAnnouncer);

    add(event: MatChipInputEvent): void {
      const value = (event.value || '').trim();

      if (value) {
        this.tags.push(value);
        this.newTagEvent.emit(this.tags)
      }
      event.chipInput!.clear();
    }

    remove(tag: string): void {
      const index = this.tags.indexOf(tag);

      if (index >= 0) {
        this.tags.splice(index, 1);
        this.newTagEvent.emit(this.tags)
        this.announcer.announce(`Removed ${tag}`);
      }
    }

    edit(tag: string, event: MatChipEditedEvent) {
      const value = event.value.trim();

      if (!value) {
        this.remove(tag);
        return;
      }

      const index = this.tags.indexOf(tag);
      if (index >= 0) {
        this.tags[index] = value;
      }
    }
}
