import { Component, inject, OnInit } from '@angular/core';
import { SidebarComponent } from "../../sidebar/sidebar";
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { ConfirmModalService } from '../../modal/confirm-model/confirm-modal.service';

@Component({
  selector: 'app-all',
  imports: [SidebarComponent],
  templateUrl: './all.html',
  styleUrl: './all.css',
})

export class All implements OnInit {

  id = '';
  name = '';
  age = 0;
  gender = "";
  email = '';
  position = '';
  department = '';
  salary = 0;

  allData : any[] = [];

  http = inject(HttpClient);

  constructor(private confirmModal: ConfirmModalService) {}

  ngOnInit(): void {
    this.getEmployee();
  }

  getEmployee(){
    const token = localStorage.getItem("token");

    const headers = new HttpHeaders({
      Authorization : token ?? '',
    });

    this.http.get("http://localhost:3000/api/employee/getall",{headers})
    .subscribe((res:any) => {
      this.allData = res;
      console.log(this.allData);
    });
  }

  // ----------------------------------------------------
  // DELETE BUTTON PRESS → Show confirmation modal
  // ----------------------------------------------------
  deleteEmployee(id: string) {
    this.confirmModal.show(
      "Are you sure you want to delete this employee?",
      () => this.deleteNow(id)   // Runs ONLY if user clicks OK
    );
  }

  // ----------------------------------------------------
  // FINAL DELETE LOGIC → API call + Update UI
  // ----------------------------------------------------
  deleteNow(id: string) {
    const token = localStorage.getItem("token");

    const headers = new HttpHeaders({
      Authorization: token ?? ''
    });

    this.http.delete(`http://localhost:3000/api/employee/delete/${id}`, { headers })
      .subscribe({
        next: () => {
          // Remove item from array (UI updates instantly)
          this.allData = this.allData.filter(emp => emp._id !== id);
          console.log("Employee deleted:", id);
        },
        error: (err) => {
          console.error("Delete failed:", err);
        }
      });
  }
}
