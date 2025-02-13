export interface Rendezvous {
  id: number;
  patientId: number;
  medecinId: number;
  date: string;
  duree: number; // en minutes
  motif: string;
  statut: 'PLANIFIE' | 'CONFIRME' | 'ANNULE';
  notes?: string;
  rappelEnvoye?: boolean;
}
