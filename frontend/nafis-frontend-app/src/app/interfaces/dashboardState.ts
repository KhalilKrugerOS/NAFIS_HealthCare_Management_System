
export interface DashboardState {
  type: 'doctor' | 'patient';
  stats: any;
  error: string;
  greetingMessage: string;
  fullName: string;
  subtitle: string;
  userId: number;
}
