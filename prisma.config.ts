import { defineConfig } from "prisma/config";

const prismaCommand = process.argv.slice(2).join(" ");
const needsDatasourceUrl = /\b(db\s+push|migrate|studio)\b/i.test(prismaCommand);

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    ...(needsDatasourceUrl
        ? {
              datasource: {
                  url: process.env.DATABASE_URL ?? "",
              },
          }
        : {}),
});
