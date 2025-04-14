import { Logger } from '@nestjs/common';
import { Repository, FindOptionsWhere } from 'typeorm';

const logger = new Logger('Seeders');

/**
 * Utility function to seed data into a TypeORM repository only if the data doesn't already exist.
 * @param repository TypeORM repository to seed data into.
 * @param dataSeed Array of data to seed into the repository.
 * @param entityName Entity name to log when seeding.
 * @param identifierKeys Array of keys to identify the data by.
 * @returns Promise that resolves when seeding is complete.
 */
export async function seedDataIfNotExists<T>(
    repository: Repository<any>,
    dataSeed: T[],
    entityName: string,
    identifierKeys: any[],
): Promise<void> {
    const whereClause: FindOptionsWhere<T>[] = dataSeed.map((item) => {
        const where: FindOptionsWhere<T> = {};
        identifierKeys.forEach((key) => {
            where[key] = item[key];
        });
        return where;
    });

    // Check existing data
    const existingData = await repository.find({ where: whereClause });

    const existingDataIds = existingData.map((item) =>
        identifierKeys.map((key) => item[key]).join('-'),
    );

    // Filter out items that already exist
    const dataToInsert = dataSeed.filter(
        (item) =>
            !existingDataIds.includes(
                identifierKeys.map((key) => item[key]).join('-'),
            ),
    );

    // Insert only the non-existing data
    if (dataToInsert.length > 0) {
        await repository.insert(dataToInsert);
        logger.log(
            `${entityName} seeded successfully for ${dataToInsert.length} items.`,
        );
    } else {
        logger.warn(`All ${entityName} already exist, skipping seeding.`);
    }
}
