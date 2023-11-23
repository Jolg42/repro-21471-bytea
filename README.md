## Reproduction attempt

For https://github.com/prisma/prisma/issues/21471#issuecomment-1812081943

Make sure to have a database running and edit the `.env` file.

```sh
# Switch the Node.js version provided in `.nvmrc`
nvm use

node -v

yarn

docker compose up -d

yarn prisma db push

NODE_OPTIONS="--max-old-space-size=200" yarn ts-node main.ts
```

### Results, from running on a Codespace (Ubuntu)

- Prisma `5.3.1`
- Node.js `v18.16.0` (the user didn’t specify which v18)
- a JSON of 1MB

Short analysis: no memory leak detected, rss and head are stable over time.

```
rss (MiB),heapTotal (MiB),heapUsed (MiB),external (MiB),arrayBuffers (MiB)

```
