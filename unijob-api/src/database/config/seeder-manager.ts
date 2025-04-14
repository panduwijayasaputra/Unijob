import { DataSource } from 'typeorm';
import { runSeeder } from 'typeorm-extension';
import * as glob from 'glob';
import * as path from 'path';
import { getSeederInfo } from './seeder-metadata';

export class SeederRunner {
    constructor(
        private dataSource: DataSource,
        private seedsDir: string,
    ) { }

    private async loadSeeders(): Promise<any[]> {
        const seederFiles = glob.sync(this.seedsDir);
        const seeders: any[] = [];

        for (const file of seederFiles) {
            const module = await import(path.resolve(file));
            const seederClass = Object.values(module)[0];
            seeders.push(seederClass);
        }

        return seeders;
    }

    private resolveDependencies(seeders: any[]) {
        const sortedSeeders: any[] = [];
        const processed: Set<string> = new Set();

        const processSeeder = (seeder: any) => {
            const metadata = getSeederInfo(seeder);

            if (processed.has(seeder.name)) return;

            // Process dependencies first
            metadata.dependencies.forEach((dependencyName) => {
                const dependency = seeders.find((s) =>
                    getSeederInfo(s).seeds.includes(dependencyName),
                );
                if (dependency) processSeeder(dependency);
            });

            // Add seeder after dependencies
            sortedSeeders.push(seeder);
            processed.add(seeder.name);
        };

        seeders.forEach(processSeeder);
        return sortedSeeders;
    }

    public async run() {
        const seeders = await this.loadSeeders();
        const orderedSeeders = this.resolveDependencies(seeders);

        for (const seeder of orderedSeeders) {
            await runSeeder(this.dataSource, seeder);
        }
    }
}
