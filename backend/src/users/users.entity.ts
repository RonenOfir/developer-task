import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column('simple-json', { default: () => "'[]'" }) 
  roles: string[];

  @Column({
    type: 'text',
    default: 'Enabled',
  })
  status: 'Enabled' | 'Disabled' | 'Deleted';
}
