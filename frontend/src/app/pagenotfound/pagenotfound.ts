import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Location } from '@angular/common'; // Import Location from @angular/common

@Component({
  selector: 'app-pagenotfound',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pagenotfound.html',
  styleUrls: ['./pagenotfound.css']
})
export class Pagenotfound {
  constructor(private location: Location) {}

  // Go back to previous page
  goBack() {
    this.location.back();
  }

  // Optional: Refresh page
  refreshPage() {
    window.location.reload();
  }
}