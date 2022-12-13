import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListPage } from './list.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataProviderService } from './data-provider.service';

describe('ListPage', () => {
  let component: ListPage;
  let dataProviderService: DataProviderService;
  let fixture: ComponentFixture<ListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListPage],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [DataProviderService],
    }).compileComponents();

    fixture = TestBed.createComponent(ListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
