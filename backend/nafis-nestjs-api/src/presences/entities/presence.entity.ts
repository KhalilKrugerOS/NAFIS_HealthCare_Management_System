import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  BeforeInsert, 
  BeforeUpdate 
} from 'typeorm';
import { Personnel } from 'src/personnels/entities/personnel.entity';
import { PersonnelStatut } from 'src/personnels/entities/personnel.entity';
import { CongeType } from 'src/statistiques-presences/entities/conge-detail.entity';
import { ValidationError, validateOrReject } from 'class-validator';

@Entity('presences')
export class Presence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  date: Date;

  @Column({
    type: 'enum',
    enum: PersonnelStatut,
    enumName: 'personnel_statut',
  })
  statut: PersonnelStatut; 

  @Column({ nullable: false })
  personnelId: number;

  @Column({ nullable: true })
  commentaire: string;

  // Bloc 1: Fields for Absence
  @Column({ nullable: true })
  justifie: boolean;

  @Column({ nullable: true })
  motif: string;

  // Bloc 2: Fields for Conge
  @Column({ type: 'date', nullable: true })
  debut: Date;

  @Column({ type: 'date', nullable: true })
  fin: Date;

  @Column({
    type: 'enum',
    enum: CongeType,
    enumName: 'conge_type',
    nullable: true,
  })
  type: CongeType;

  // Bloc 3: Fields for Mission
  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  lieu: string;

  @ManyToOne(() => Personnel, (personnel) => personnel.presences)
  personnel: Personnel;

  @BeforeInsert()
  @BeforeUpdate()
  async validateFields() {
    // Sync personnelId with personnel
    if (this.personnel) {
      this.personnelId = this.personnel.id;
    }
  
    try {
      switch (this.statut) {
        case 'ABSENT':
          this.validateBloc1();
          break;
        case 'CONGE':
          this.validateBloc2();
          break;
        case 'MISSION':
          this.validateBloc3();
          break;
        case 'PRESENT':
          // No additional fields required for PRESENT, so skip validation
          break;
        default:
          throw new Error('Invalid statut value.');
      }
    } catch (error) {
      throw new Error(`Validation failed `);
    }
  }
  


  private validateBloc1() {
    if (this.justifie === undefined || this.motif === undefined) {
      throw new Error('Fields "justifie" and "motif" are required for ABSENT statut.');
    }
    this.clearBloc2And3();
  }

  private validateBloc2() {
    if (!this.debut || !this.fin || !this.type) {
      throw new Error('Fields "debut", "fin", and "type" are required for CONGE statut.');
    }
    this.clearBloc1And3();
  }

  private validateBloc3() {
    if (!this.debut || !this.fin || !this.description || !this.lieu) {
      throw new Error(
        'Fields "debut", "fin", "description", and "lieu" are required for MISSION statut.'
      );
    }
    this.clearBloc1And2();
  }

  private clearBloc1And3() {
    this.justifie = undefined;
    this.motif = undefined;
    this.description = undefined;
    this.lieu = undefined;
  }

  private clearBloc1And2() {
    this.justifie = undefined;
    this.motif = undefined;
    this.type = undefined;
  }

  private clearBloc2And3() {
    this.debut = undefined;
    this.fin = undefined;
    this.type = undefined;
    this.description = undefined;
    this.lieu = undefined;
  }
}
