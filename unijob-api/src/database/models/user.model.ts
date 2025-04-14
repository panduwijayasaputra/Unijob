import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export type UserRole = 'admin' | 'worker' | 'employer';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: ['admin', 'worker', 'employer'] })
    role: UserRole;

    @Column({ nullable: true })
    phone?: string;

    @Column({ nullable: true })
    location?: string;

    @Column({ nullable: true })
    avatarUrl?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}