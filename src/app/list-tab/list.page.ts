import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DataProviderService } from './data-provider.service';
import { MoreDetailsComponent } from './more-details-component/more-details.component';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss'],
})
export class ListPage {
  public serviceRequestArray$: Observable<any[]> | undefined;
  constructor(
    private dataProviderService: DataProviderService,
    private modalCtrl: ModalController
  ) {}

  /**
   *  Will be triggered when the page is loaded into the view. This helps with data that is dynamic and constantly updating.
   */
  ionViewWillEnter() {
    this.getServiceRequests();
  }

  /**
   * Service call to get the observable data from the data service using http req.
   */
  private getServiceRequests() {
    this.serviceRequestArray$ =
      this.dataProviderService.getServiceRequestData();
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

  public async showMoreDetails(data: any) {
    const modal = await this.modalCtrl.create({
      component: MoreDetailsComponent,
      componentProps: { data },
      mode: 'ios',
      breakpoints: [0.25, 0.5, 0.75],
      initialBreakpoint: 0.75,
    });
    modal.present();
  }
}
