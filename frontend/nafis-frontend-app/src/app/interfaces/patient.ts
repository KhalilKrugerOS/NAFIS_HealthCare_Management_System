import { User} from './user';

export interface Patient {
  id: number;
  user: User;
  consultations?: any[]; 
  documents?: any[];
  rendezvous?: any[]; 
  cv?: any[];
  chambre?: any; 
  admin?: any; 
  medicalHistory?: any; 
}