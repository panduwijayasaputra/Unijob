import { execSync } from 'child_process';
import { Logger } from '@nestjs/common';

const bootstrap = async () => {
  const logger = new Logger('Migration');

  const nameIndex = process.argv.indexOf('-n');
  if (nameIndex === -1 || nameIndex + 1 >= process.argv.length) {
    logger.error('Please provide a name with -n <nama-file>');
    return;
  }

  const name = process.argv[nameIndex + 1];

  try {
    const createCommand =
      'npm run typeorm -- migration:generate -d src/common/config/typeorm.config.ts src/database/migrations/' +
      name;

    execSync(createCommand, { stdio: 'inherit' });
  } catch (error) {
    logger.error(`Failed to create migration for ${name}: ${error.message}`);
  }
};

bootstrap();
