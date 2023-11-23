import { PrismaClient } from "@prisma/client";

function toMib(b: number): string {
  return (b / 1024 / 1024).toPrecision(4);
}

function printMemoryUsage() {
  const usage = process.memoryUsage();
  console.log(
    `${toMib(usage.rss)},${toMib(usage.heapTotal)},${toMib(
      usage.heapUsed
    )},${toMib(usage.external)},${toMib(usage.arrayBuffers)},`
  );
}

async function main() {
  const prisma = new PrismaClient();
  await prisma.$connect();

  // feed the table a row with xMB data.
  const size = 1;
  const data = Buffer.alloc(1024 * 1024 * size);

  await prisma.data.upsert({
    where: {
      id: 1,
    },
    create: {
      data: data,
    },
    update: {
      data: data,
    },
  });

  console.log(
    "rss (MiB),heapTotal (MiB),heapUsed (MiB),external (MiB),arrayBuffers (MiB)"
  );

  console.log("readNoBin");
  // do not read bytea field
  async function readNoBin() {
    for (let i = 0; i < 1_000; i++) {
      await prisma.data.findFirst({
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          id: 1,
        },
      });
    }
  }

  for (let h = 0; h < 10; h++) {
    await readNoBin();
    printMemoryUsage();
  }

  console.log("readBin");
  // read bytea field
  async function read() {
    for (let i = 0; i < 100; i++) {
      await prisma.data.findFirst({
        where: {
          id: 1,
        },
      });
    }
  }

  for (let j = 0; j < 100; j++) {
    await read();
    printMemoryUsage();
  }
  await prisma.$disconnect();
}

main();
