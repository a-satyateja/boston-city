## Testing Principles​
When testing an application, it is best to keep in mind that testing can show if defects are present in a system. However, it is impossible to prove that any non-trivial system is completely free of defects. For this reason, the goal of testing is not to verify that the code is correct but to find problems within the code. This is a subtle but important distinction.

If we set out to prove that the code is correct, we are more likely to stick to the happy path through the code. If we set out to find problems, we are more likely to more fully exercise the code and find the bugs that are lurking there.

It is also best to begin testing an application from the very start. This allows defects to be found early in the process when they are easier to fix. This also allows code to be refactored with confidence as new features are added to the system.

## Unit Testing​
Unit tests exercise a single unit of code (component, page, service, pipe, etc) in isolation from the rest of the system. Isolation is achieved through the injection of mock objects in place of the code's dependencies. The mock objects allow the test to have fine-grained control of the outputs of the dependencies. The mocks also allow the test to determine which dependencies have been called and what has been passed to them.

Well-written unit tests are structured such that the unit of code and the features it contains are described via describe() callbacks. The requirements for the unit of code and its features are tested via it() callbacks. When the descriptions for the describe() and it() callbacks are read, they make sense as a phrase. When the descriptions for nested describe()s and a final it() are concatenated together, they form a sentence that fully describes the test case.

Since unit tests exercise the code in isolation, they are fast, robust, and allow for a high degree of code coverage.

## Using Mocks​
Unit tests exercise a code module in isolation. To facilitate this, we recommend using Jasmine (https://jasmine.github.io/). Jasmine creates mock objects (which Jasmine calls "spies") to take the place of dependencies while testing. When a mock object is used, the test can control the values returned by calls to that dependency, making the current test independent of changes made to the dependency. This also makes the test setup easier, allowing the test to only be concerned with the code within the module under test.

Using mocks also allows the test to query the mock to determine if it was called and how it was called via the toHaveBeenCalled* set of functions. Tests should be as specific as possible with these functions, favoring calls to toHaveBeenCalledTimes over calls to toHaveBeenCalled when testing that a method has been called. That is expect(mock.foo).toHaveBeenCalledTimes(1) is better than expect(mock.foo).toHaveBeenCalled(). The opposite advice should be followed when testing that something has not been called (expect(mock.foo).not.toHaveBeenCalled()).

There are two common ways to create mock objects in Jasmine. Mock objects can be constructed from scratch using jasmine.createSpy and jasmine.createSpyObj or spies can be installed onto existing objects using spyOn() and spyOnProperty().

Using jasmine.createSpy and jasmine.createSpyObj​
jasmine.createSpyObj creates a full mock object from scratch with a set of mock methods defined on creation. This is useful in that it is very simple. Nothing needs to be constructed or injected into the test. The disadvantage of using this function is that it allows the creation of objects that may not match the real objects.

jasmine.createSpy is similar but it creates a stand-alone mock function.

### Using spyOn() and spyOnProperty()​
spyOn() installs the spy on an existing object. The advantage of using this technique is that if an attempt is made to spy on a method that does not exist on the object, an exception is raised. This prevents the test from mocking methods that do not exist. The disadvantage is that the test needs a fully formed object to begin with, which may increase the amount of test setup required.

spyOnProperty() is similar with the difference being that it spies on a property and not a method.

## General Testing Structure​
Unit tests are contained in spec files with one spec file per entity (component, page, service, pipe, etc.). The spec files live side-by-side with and are named after the source that they are testing. For example, if the project has a service called WeatherService, the code for it is in a file named weather.service.ts with the tests in a file named weather.service.spec.ts. Both of those files are in the same folder.

The spec files themselves contain a single describe call that defines that overall test. Nested within it are other describe calls that define major areas of functionality. Each describe call can contain setup and teardown code (generally handled via beforeEach and afterEach calls), more describe calls forming a hierarchical breakdown of functionality, and it calls which define individual test cases.

The describe and it calls also contain a descriptive text label. In well-formed tests, the describe and it calls combine with their labels to perform proper phrases and the full label for each test case, formed by combining the describe and it labels, creates a full sentence.

For example:

`describe('Calculation', () => {
  describe('divide', () => {
    it('calculates 4 / 2 properly' () => {});
    it('cowardly refuses to divide by zero' () => {});
    ...
  });

  describe('multiply', () => {
    ...
  });
});`

The outer describe call states that the Calculation service is being tested, the inner describe calls state exactly what functionality is being tested, and the it calls state what the test cases are. When run the full label for each test case is a sentence that makes sense (Calculation divide cowardly refuses to divide by zero).

## Pages and Components​
Pages are just Angular components. Thus, pages and components are both tested using Angular's Component Testing guidelines.

Since pages and components contain both TypeScript code and HTML template markup it is possible to perform both component class testing and component DOM testing. When a page is created, the template test that is generated looks like this:

`import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsPage } from './tabs.page';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TabsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});`

When doing component class testing, the component object is accessed using the component object defined via component = fixture.componentInstance;. This is an instance of the component class. When doing DOM testing, the fixture.nativeElement property is used. This is the actual HTMLElement for the component, which allows the test to use standard HTML API methods such as HTMLElement.querySelector in order to examine the DOM.

## Services​
Services often fall into one of two broad categories: utility services that perform calculations and other operations, and data services that perform primarily HTTP operations and data manipulation.

## Basic Service Testing​
The suggested way to test most services is to instantiate the service and manually inject mocks for any dependency the service has. This way, the code can be tested in isolation.

Let's say that there is a service with a method that takes an array of timecards and calculates net pay. Let's also assume that the tax calculations are handled via another service that the current service depends on. This payroll service could be tested as such:

`import { PayrollService } from './payroll.service';

describe('PayrollService', () => {
  let service: PayrollService;
  let taxServiceSpy;

   beforeEach(() => {
     taxServiceSpy = jasmine.createSpyObj('TaxService', {
       federalIncomeTax: 0,
       stateIncomeTax: 0,
       socialSecurity: 0,
       medicare: 0
     });
     service = new PayrollService(taxServiceSpy);
   });

   describe('net pay calculations', () => {
     ...
   });
});`

This allows the test to control the values returned by the various tax calculations via mock setup such as taxServiceSpy.federalIncomeTax.and.returnValue(73.24). This allows the "net pay" tests to be independent of the tax calculation logic. When the tax codes change, only the tax service related code and tests need to change. The tests for the net pay can continue to operate as they are since these tests do not care how the tax is calculated, just that the value is applied properly.

The scaffolding that is used when a service is generated via ionic g service name uses Angular's testing utilities and sets up a testing module. Doing so is not strictly necessary. That code may be left in, however, allowing the service to be built manually or injected as such:

`import { TestBed, inject } from '@angular/core/testing';

import { PayrollService } from './payroll.service';
import { TaxService } from './tax.service';

describe('PayrolService', () => {
  let taxServiceSpy;

  beforeEach(() => {
    taxServiceSpy = jasmine.createSpyObj('TaxService', {
      federalIncomeTax: 0,
      stateIncomeTax: 0,
      socialSecurity: 0,
      medicare: 0,
    });
    TestBed.configureTestingModule({
      providers: [PayrollService, { provide: TaxService, useValue: taxServiceSpy }],
    });
  });

  it('does some test where it is injected', inject([PayrollService], (service: PayrollService) => {
    expect(service).toBeTruthy();
  }));

  it('does some test where it is manually built', () => {
    const service = new PayrollService(taxServiceSpy);
    expect(service).toBeTruthy();
  });
});`


## Testing HTTP Data Services​
Most services that perform HTTP operations will use Angular's HttpClient service in order to perform those operations. For such tests, it is suggested to use Angular's HttpClientTestingModule. For detailed documentation of this module, please see Angular's Angular's Testing HTTP requests guide.

This basic setup for such a test looks like this:

`import { HttpBackend, HttpClient } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { IssTrackingDataService } from './iss-tracking-data.service';

describe('IssTrackingDataService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let issTrackingDataService: IssTrackingDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IssTrackingDataService],
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    issTrackingDataService = new IssTrackingDataService(httpClient);
  });

  it('exists', inject([IssTrackingDataService], (service: IssTrackingDataService) => {
    expect(service).toBeTruthy();
  }));

  describe('location', () => {
    it('gets the location of the ISS now', () => {
      issTrackingDataService.location().subscribe((x) => {
        expect(x).toEqual({ longitude: -138.1719, latitude: 44.4423 });
      });
      const req = httpTestingController.expectOne('http://api.open-notify.org/iss-now.json');
      expect(req.request.method).toEqual('GET');
      req.flush({
        iss_position: { longitude: '-138.1719', latitude: '44.4423' },
        timestamp: 1525950644,
        message: 'success',
      });
      httpTestingController.verify();
    });
  });
});`


## Pipes​
A pipe is like a service with a specifically defined interface. It is a class that contains one public method, transform, which manipulates the input value (and other optional arguments) in order to create the output that is rendered on the page. To test a pipe: instantiate the pipe, call the transform method, and verify the results.

As a simple example, let's look at a pipe that takes a Person object and formats the name. For the sake of simplicity, let's say a Person consists of an id, firstName, lastName, and middleInitial. The requirements for the pipe are to print the name as "Last, First M." handling situations where a first name, last name, or middle initial do not exist. Such a test might look like this:

`import { NamePipe } from './name.pipe';

import { Person } from '../../models/person';

describe('NamePipe', () => {
  let pipe: NamePipe;
  let testPerson: Person;

  beforeEach(() => {
    pipe = new NamePipe();
    testPerson = {
      id: 42,
      firstName: 'Douglas',
      lastName: 'Adams',
      middleInitial: 'N',
    };
  });

  it('exists', () => {
    expect(pipe).toBeTruthy();
  });

  it('formats a full name properly', () => {
    expect(pipe.transform(testPerson)).toBeEqual('Adams, Douglas N.');
  });

  it('handles having no middle initial', () => {
    delete testPerson.middleInitial;
    expect(pipe.transform(testPerson)).toBeEqual('Adams, Douglas');
  });

  it('handles having no first name', () => {
    delete testPerson.firstName;
    expect(pipe.transform(testPerson)).toBeEqual('Adams N.');
  });

  it('handles having no last name', () => {
    delete testPerson.lastName;
    expect(pipe.transform(testPerson)).toBeEqual('Douglas N.');
  });
});`

It is also beneficial to exercise the pipe via DOM testing in the components and pages that utilize the pipe.

## End-to-end Testing​
End-to-end testing is used to verify that an application works as a whole and often includes a connection to live data. Whereas unit tests focus on code units in isolation and thus allow for low-level testing of the application logic, end-to-end tests focus on various user stories or usage scenarios, providing high-level testing of the overall flow of data through the application. Whereas unit tests try to uncover problems with an application's logic, end-to-end tests try to uncover problems that occur when those individual units are used together. End-to-end tests uncover problems with the overall architecture of the application.

Since end-to-end tests exercise user stories and cover the application as a whole rather than individual code modules, end-to-end tests exist in their own application in the project apart from the code for the main application itself. Most end-to-end tests operate by automating common user interactions with the application and examining the DOM to determine the results of those interactions.