import { execSync } from 'child_process';
import { join } from 'path';

export const generateClient = () => {
  console.log('🏁 Garantindo que o Prisma Client está gerado para execução...');

  const schemaPath = join(__dirname, '..', '..', 'prisma', 'schema.prisma');

  try {
    execSync(`npx prisma generate --schema=${schemaPath}`, {
      stdio: 'inherit',
    });
    console.log('Prisma Client pronto para execução.');
  } catch (error) {
    console.error('Falha ao gerar o Prisma Client em tempo de execução:', error);
    process.exit(1);
} };