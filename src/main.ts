import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {LicenseManager} from 'ag-grid-enterprise/main';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

LicenseManager.setLicenseKey("Evaluation_License_Valid_Until__2_June_2018__MTUyNzg5NDAwMDAwMA==a955ee2667cbe5f9f5a2d59bff6ad561");

if (environment.production) {
    enableProdMode();
}

// for enterprise customers
// LicenseManager.setLicenseKey("your license key");

platformBrowserDynamic().bootstrapModule(AppModule);




