import { Component, inject, OnInit } from '@angular/core';
import { SidebarComponent } from "../../sidebar/sidebar";
import { HttpClient , HttpHeaders } from '@angular/common/http';

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

  ngOnInit(): void {
    this.getEmployee();
  }

  getEmployee(){
    const token = localStorage.getItem("token");

    const headers = new HttpHeaders({
      Authorization : token ?? '',
    })

    this.http.get("http://localhost:3000/api/employee/getall",{headers})
    .subscribe((res:any) => {
      this.allData = res;
      console.log(this.allData);
    })
  }
}
