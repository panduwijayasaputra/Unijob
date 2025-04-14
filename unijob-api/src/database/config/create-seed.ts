import { execSync } from 'child_process';
import { Logger } from '@nestjs/common';

const bootstrap = async () => {
  const logger = new Logger('Seeders');

  const nameIndex = process.argv.indexOf('-n');
  if (nameIndex === -1 || nameIndex + 1 >= process.argv.length) {
    logger.error('Please provide a name with -n <nama-file>');
    return;
  }

  const name = process.argv[nameIndex + 1];

  try {
    const createCommand =
      'ts-node -r tsconfig-paths/register ./node_modules/typeorm-extension/bin/cli.cjs seed:create -n src/database/seeds/' +
      name;

    execSync(createCommand, { stdio: 'inherit' });
    logger.log(`Create seed success for ${name}`);
  } catch (error) {
    logger.error(`Failed to create seed for ${name}: ${error.message}`);
  }
};

bootstrap();
