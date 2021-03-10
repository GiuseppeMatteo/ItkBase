import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ExceptionModel } from '../models/exception.model';

@Component({
  template: `<div id="error">
    <h1>Errore applicativo</h1>
    <div class="body" [innerHTML]="errorMessage"></div>

    <div class="bottoni">
      <button mat-dialog-close (click)="close()">chiudi</button>
    </div>
  </div>`,
})
export class ServerErrorComponent implements OnInit {
  errorMessage: string = '';

  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<ServerErrorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: ExceptionModel
  ) {}

  ngOnInit(): void {
    this.errorMessage =
      this.data.customMessage != undefined
        ? this.data.customMessage
        : 'Si è verificato un errore inatteso:<br>verificare la connessione tra i server e la validità del certificato.';
  }

  close() {
    this.dialogRef.close();
    this.router.navigateByUrl('');
  }
}
