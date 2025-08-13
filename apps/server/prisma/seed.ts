import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  await prisma.question.deleteMany();
  await prisma.studyBlock.deleteMany();

  const block1 = await prisma.studyBlock.create({
    data: {
      title: 'Princípios e Conceitos',
      description: 'Fundamentos do Direito Previdenciário e da Seguridade Social.',
      order: 1,
  }, });

  await prisma.question.createMany({
    data: [
      {
        blockId: block1.id,
        statement: 'A Seguridade Social compreende um conjunto integrado de ações de iniciativa dos Poderes Públicos e da sociedade, destinadas a assegurar os direitos relativos à saúde, à previdência e à assistência social.',
        type: 'CERTO_ERRADO',
        difficulty: 'FACIL',
        isCorrect: true,
        explanation: 'Correto. Conforme o Art. 194 da Constituição Federal, a Seguridade Social abrange o tripé: Saúde, Previdência e Assistência Social.',
      },
      {
        blockId: block1.id,
        statement: 'O princípio da universalidade da cobertura e do atendimento significa que todos os riscos sociais devem ser cobertos pela Previdência Social.',
        type: 'CERTO_ERRADO',
        difficulty: 'MEDIO',
        isCorrect: false,
        explanation: 'Errado. O princípio da universalidade da cobertura refere-se à proteção de todos os riscos sociais (doença, invalidez, morte, etc.), enquanto a universalidade do atendimento refere-se a abranger todas as pessoas. A Previdência Social, no entanto, é contributiva e não cobre todas as pessoas indistintamente (diferente da Saúde).',
      },
      {
        blockId: block1.id,
        statement: 'Qual dos seguintes não é um princípio da Seguridade Social?',
        type: 'MULTIPLA_ESCOLHA',
        difficulty: 'FACIL',
        options: {
          options: ['Seletividade e distributividade', 'Irredutibilidade do valor dos benefícios', 'Caráter democrático da gestão', 'Princípio da rentabilidade'],
          answer: 'Princípio da rentabilidade',
        },
        explanation: 'A rentabilidade é um princípio do mercado financeiro, não da Seguridade Social, que se baseia na solidariedade social.',
  }, ], });

  const block2 = await prisma.studyBlock.create({
    data: {
      title: 'Segurados e Dependentes',
      description: 'Quem são os beneficiários do Regime Geral de Previdência Social (RGPS).',
      order: 2,
  }, });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });