import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  createCheckoutForNewSubscription(plan: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/generate_checkout_new_url`, {plan});
  }
  
  createCheckoutForUpdatingSubscription(subId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/generate_checkout_existing_url`, { subId });
  }

  createPortalSession(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/generate_portal_session`, {});
  }

  createManagePaymentSources(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/generate_update_payment_method_url`, {});
  }

}