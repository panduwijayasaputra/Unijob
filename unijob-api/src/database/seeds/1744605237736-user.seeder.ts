import { seedDataIfNotExists } from 'src/helpers/seed-exists';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { SeederInfo } from '../config/seeder-metadata';
import { User } from '../models/user.model';
import * as bcrypt from 'bcrypt';
@SeederInfo({
    seeds: ['User.name'],
    dependencies: []
})
export class UserSeeder1744605237736 implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        const repository = dataSource.getRepository('User');


        const password = 'uni12345.!';
        const hashed = await bcrypt.hash(password, 10); // 10 is the salt rounds

        const dataSeed = [
            {
                id: '550e8400-e29b-41d4-a716-446655440000',
                name: 'Admin User',
                email: 'admin@unijob.com',
                password: hashed, // In production, this should be hashed
                role: 'admin',
                phone: '+1234567890',
                location: 'Head Office',
                avatarUrl: null
            },
            {
                id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
                name: 'Worker User',
                email: 'worker@unijob.com',
                password: hashed,
                role: 'worker',
                phone: '+1234567891',
                location: 'New York',
                avatarUrl: null
            },
            {
                id: '63dc7cd1-875e-4639-9ea5-b4f4446ddb3e',
                name: 'Employer User',
                email: 'employer@unijob.com',
                password: hashed,
                role: 'employer',
                phone: '+1234567892',
                location: 'San Francisco',
                avatarUrl: null
            }
        ];

        // Using the helper function to seed data
        await seedDataIfNotExists(
            repository,
            dataSeed,
            User.name,
            ['id'] // Using id as unique identifier
        );
    }
}
