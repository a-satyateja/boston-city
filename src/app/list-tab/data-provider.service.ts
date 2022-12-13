import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataProviderService {
  constructor(private http: HttpClient) {}

  /**
   * Used to retrieve the Boston 311 service requests data from the public API.
   *
   * @returns An Observable of the HttpResponse, with a response body in the requested type.
   */
  getServiceRequestData() {
    return this.http.get<any>(environment.dataUrl);
  }
}
