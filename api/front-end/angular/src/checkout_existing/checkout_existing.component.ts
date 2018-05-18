import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'checkout-existing',
  templateUrl: './checkout_existing.component.html',
  styleUrls: ['./checkout_existing.component.css']
})
export class CheckoutExistingComponent {
  constructor(private router: Router) {
  
  }

  ngOnInit() {
    this.router.navigateByUrl("/checkout_existing/login");
  }
}