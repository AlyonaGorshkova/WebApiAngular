import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Device {
  _id!: string;
  name!: string;
  version!: string;

}

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private apiUrl = 'https://localhost:7108';

  constructor(private http: HttpClient) { }

  //Метод получения всех активностей
  getAllDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.apiUrl}/api/Activiry`);
  }

  //Метод получение подробной информации по id
  getDeviceSessions(_id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/Activiry/${_id}/sessions`);
  }
  //Медод удаления записей
  deleteActivity(olderThan: Date): Observable<any> {
    const params = new HttpParams().set('TimeBefore', olderThan.toISOString());

    return this.http.delete(`${this.apiUrl}/api/Activiry`, { params });
  }
}
