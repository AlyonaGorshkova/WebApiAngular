import { Component, OnInit } from '@angular/core';
import { DeviceService } from './services/device.service';
import { Device } from './services/device.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  devices: Device[] = [];
  errorMessage: string = '';

  selectedDevice: Device | null = null;
  deviceSession: any[] = [];
  loadingSessions: boolean = false;
  sessionsError: string = '';

  cleanupDate: string = ''; 
  cleanupResult: string = '';
  cleanupLoading: boolean = false;
  constructor(private deviceService: DeviceService) { }

  ngOnInit() {
    this.loadDevices();
  }

  loadDevices() {
    this.deviceService.getAllDevices().subscribe({
      next: (data: Device[]) => {
        this.devices = data; 
        console.log('Данные получены!', this.devices);
      },
      error: (err) => {
        this.errorMessage = 'Не удалось загрузить данные';
        console.error('Ошибка:', err);
      }
    });
  }
  // Обработчик выбора устройства
  onDeviceSelect(device: Device) {
    this.selectedDevice = device;
    this.sessionsError = '';
    this.loadDeviceSessions(device._id);
  }

  // Загрузка сессий для выбранного ` 
  loadDeviceSessions(_id: string) {
    this.loadingSessions = true;
    this.deviceService.getDeviceSessions(_id).subscribe({
      next: (sessions: any[]) => {
        this.deviceSession = sessions;
        this.loadingSessions = false;
      },
      error: (err) => {
        this.sessionsError = 'Не удалось загрузить сессии устройства';
        this.loadingSessions = false;
        console.error('Ошибка загрузки сессий:', err);
      }
    });
  }
  calculateDuration(session: any): string {
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}ч ${minutes}м`;
  }
    deleteOldActivities() {
    if (!this.cleanupDate) {
      return;
    }

    this.cleanupLoading = true;
    this.cleanupResult = '';

     const date = new Date(this.cleanupDate); 

      this.deviceService.deleteActivity(date).subscribe({
      next: (result: any) => {
        this.cleanupResult = result.message || 'Удаление выполнено успешно';
        this.cleanupLoading = false;

        this.loadDevices();
      },
      error: (err) => {
        this.cleanupResult = 'Ошибка при удалении записей';
        this.cleanupLoading = false;
        console.error('Ошибка удаления:', err);
      }
    });
  }
}
