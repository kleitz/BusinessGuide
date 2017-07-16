import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from "@angular/http";
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { SearchPage } from '../pages/search/search';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { CompanyDetailsPage } from '../pages/company_details/company_details';
import {Login } from '../pages/login/login';
import {Register } from '../pages/register/register';
import { Map } from '../pages/map/map';
import { Favorites } from '../pages/favorites/favorites'
import { Products } from '../pages/products/products'
import { ViewProfile } from '../pages/view-profile/view-profile';

import { FIREBASE_CONFIG } from './app.firebase.config'
import { AuthService } from '../providers/auth.service'
import { DataService } from '../providers/data.service'
import { LocationTracker } from '../providers/location-tracker';
import { StorageService } from '../providers/storage.service';
import { Mongo } from '../providers/mongo';
import { Messages } from '../providers/messages.service'
import { LocalNotifications } from '@ionic-native/local-notifications';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {Camera} from "@ionic-native/camera";
import { IonicStorageModule } from '@ionic/storage';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';
import { SQLite } from '@ionic-native/sqlite';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geofence } from '@ionic-native/geofence';


@NgModule({
  declarations: [
    MyApp,
    SearchPage,
    ContactPage,
    HomePage,
    TabsPage,
	  CompanyDetailsPage,
    Login,
    Register,
    Map,
    Favorites,
    Products,
    ViewProfile
      ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SearchPage,
    ContactPage,
    HomePage,
    TabsPage,
	  CompanyDetailsPage,
	  Login,
	  Register,
    Map,
    Favorites,
    Products,
    ViewProfile,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    File,
    Geolocation,
    GoogleMaps,
    SQLite,
    SocialSharing,
    AuthService,
    DataService,
    LocationTracker,
    BackgroundGeolocation,
    Geofence,
    StorageService,
    Mongo,
    Messages,
    LocalNotifications
  ]
})
export class AppModule {}
