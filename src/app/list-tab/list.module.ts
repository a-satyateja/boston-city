import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListPage } from './list.page';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ListPageRoutingModule } from './list-routing.module';
import { DataProviderService } from './data-provider.service';
import { HttpClientModule } from '@angular/common/http';
import { MoreDetailsComponent } from './more-details-component/more-details.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ScrollingModule,
    ListPageRoutingModule,
    HttpClientModule,
  ],
  declarations: [ListPage, MoreDetailsComponent],
  providers: [DataProviderService],
})
export class ListPageModule {}
