Follow the steps below to finish setting up your application.

## Drizzle

First, ensure that `DATABASE_URL` is configured in `.env` file, then create the database:

```bash
npm run drizzle:generate # a script that executes drizzle-kit generate.
npm run drizzle:migrate # a script that executes drizzle-kit migrate.
```

> \[!NOTE]
> The `drizzle-kit generate` command is used to generate SQL migration files based on your Drizzle schema.
>
> The `drizzle-kit migrate` command is used to apply the generated migrations to your database.

Read more on [Drizzle ORM documentation](https://orm.drizzle.team/docs/overview)

