import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PosComponent } from "./pos/pos.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'rikaso';
}
