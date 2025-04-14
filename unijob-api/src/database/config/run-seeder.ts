import { Logger } from '@nestjs/common';
import { SeederRunner } from './seeder-manager';
import { dataSource } from 'src/common/config/typeorm.config';

const bootstrap = async () => {
  const logger = new Logger('Seeders');

  try {
    await dataSource.initialize();

    const seederRunner = new SeederRunner(
      dataSource,
      'src/database/seeds/*.seeder{.ts,.js}',
    );

    await seederRunner.run();
  } catch (error) {
    logger.error('Error during the seeding process', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
};

bootstrap();
