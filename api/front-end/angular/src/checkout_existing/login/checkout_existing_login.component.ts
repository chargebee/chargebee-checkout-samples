import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'checkout-existing-login',
  templateUrl: './checkout_existing_login.component.html',
  styleUrls: ['./checkout_existing_login.component.css']
})
export class CheckoutExistingLoginComponent {
  constructor(private router: Router) {
  
  }

  login() {
    this.router.navigateByUrl("/checkout_existing/profile");
  }
}