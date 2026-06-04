import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface SignUpResponse {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignUpService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5050/api/signup';
  private readonly accountsUrl = 'http://localhost:5050/api/accounts';

  signUp(data: SignUpRequest): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(this.apiUrl, data);
  }

  getAccounts(): Observable<SignUpResponse[]> {
    return this.http.get<SignUpResponse[]>(this.accountsUrl);
  }

  deleteAccount(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.accountsUrl}/${id}`);
  }
}
