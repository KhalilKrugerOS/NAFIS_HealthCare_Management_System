import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DoctorDashboardComponent } from './doctor-dashboard/doctor-dashboard.component';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';
import { DashboardGreetingComponent } from './dashboard-greeting/dashboard-greeting.component';
import {
  Subject,
  takeUntil,
  catchError,
  Observable,
  switchMap,
  map,
  EMPTY,
} from 'rxjs';
import { CalendarSidebarComponent } from './calender-sidebar/calender-sidebar.component';
import { DashboardState } from '../../interfaces/dashboardState';
import { PatientService } from '../../core/services/patient.service';
import { tap } from 'rxjs/operators';
import { ButtonComponent } from '../../shared/button/button.component';
import { Patient } from '../../interfaces/patient';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DoctorDashboardComponent,
    PatientDashboardComponent,
    DashboardGreetingComponent,
    CalendarSidebarComponent,
    ButtonComponent,
    RouterLink,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  dashboardState$!: Observable<DashboardState>;
  patient$!: Observable<Patient>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService 
  ) {}

  ngOnInit() {
    this.initializeDashboard();
    this.loadPatientDetails();
  }

  private initializeDashboard() {
    this.dashboardState$ = this.route.url.pipe(
      switchMap((segments) => {
        return EMPTY;
      }),
      tap((state) => {
        console.log('Dashboard State:', state);
      }),
      catchError((error) => {
        console.error('Failed to initialize dashboard:', error);
        return EMPTY;
      })
    );
  }

  private loadPatientDetails() {
    const patientId = this.extractPatientId();
    if (patientId) {
      this.patient$ = this.patientService.getPatientById(patientId).pipe(
        tap(patient => console.log('Patient Details:', patient)),
        catchError(error => {
          console.error('Failed to load patient details:', error);
          return EMPTY;
        })
      );
    }
  }

  private extractPatientId(): number | null {
    try {
      const idSegment = this.route.snapshot.url[1];
      return idSegment ? parseInt(idSegment.path, 10) : null;
    } catch (error) {
      console.error('Error extracting patient ID:', error);
      return null;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}