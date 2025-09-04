const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const board = await prisma.board.create({
    data: {
      name: "Demo Board",
      tasks: {
        create: [
          { title: "Task 1", description: "First task" },
          { title: "Task 2", description: "Second task" }
        ]
      }
    },
    include: { tasks: true }
  });

  console.log("✅ Seeded:", board);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    prisma.$disconnect();
    process.exit(1);
  });
