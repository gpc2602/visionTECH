import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeolocalizacionService {
  private geocodingAPIURL = 'https://maps.googleapis.com/maps/api/geocode/json';
  private apiKey = environment.googleMapsApiKey;

  constructor(private http: HttpClient) {}

  getCoordinates(address: string): Observable<any> {
    const url = `${this.geocodingAPIURL}?address=${encodeURIComponent(
      address
    )}&key=${this.apiKey}`;
    return this.http.get(url);
  }

  getAddressFromCoordinates(lat: number, lng: number): Observable<any> {
    const url = `${this.geocodingAPIURL}?latlng=${lat},${lng}&key=${this.apiKey}&language=es`;
    return this.http.get(url);
  }
}
