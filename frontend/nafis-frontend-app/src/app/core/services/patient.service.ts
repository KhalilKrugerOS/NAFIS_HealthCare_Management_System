import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UserRoleEnum } from '../enums/user-role.enum';
import { Patient } from '../../interfaces/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:3000/patients';

  constructor(private http: HttpClient) {}

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}`);
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  updatePatient(id: number, patientData: Partial<Patient>): Observable<Patient> {
    return this.http.patch<Patient>(`${this.apiUrl}/${id}`, patientData);
  }

  deletePatient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPatientHistory(patientId: number): Observable<{
    patient: Patient,
    documents: any[], 
    consultations: any[]
  }> {
    return this.http.get<{
      patient: Patient,
      documents: any[], 
      consultations: any[]
    }>(`${this.apiUrl}/${patientId}/historique`);
  }
}