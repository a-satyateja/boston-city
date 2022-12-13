import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-more-details',
  templateUrl: './more-details.component.html',
  styleUrls: ['./more-details.component.scss'],
})
export class MoreDetailsComponent {
  @Input('data') data?: any;
  public titleDetails = {
    title: 'More Details',
  };

  constructor(private modalCtrl: ModalController) {}

  close() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  /**
   * This method is used to display human readable time from the provided timestamp
   *
   * @param {string} time
   * @return {string}
   * @memberof ListPage
   */
  public getTime(time: string): string {
    if (!time) return 'Unavailable';
    const recordedTime = new Date(time).getTime();
    const now = Date.now();
    const duration = now - recordedTime;
    const minutes = Math.floor(duration / 60000);
    if (minutes < 60) {
      return `${minutes} minutes ago`;
    }
    const hours = Math.floor(duration / 3600000);
    if (hours < 24) {
      return `${hours} hours ago`;
    }
    const days = Math.floor(duration / 86400000);
    return `${days} day(s) ago`;
  }

  /**
   *
   * @param lat
   * @param long
   */
  public openMaps(lat: number, long: number) {
    window.open(
      `maps://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=${lat},${long}`
    );
  }
}
