# Evolu Relay Custom

Custom [Evolu](https://evolu.dev) relay with configurable quota via environment variables.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `QUOTA_MB` | Storage quota per owner in MB | `10` |
| `ENABLE_LOGGING` | Enable detailed logging | `false` |

## Deploy with Coolify

1. Create a new service from **Git Repository**
2. Point to this repo
3. Set environment variables as needed
4. Deploy

## Run Locally

```bash
# With Docker
docker build -t evolu-relay .
docker run -p 4000:4000 -e QUOTA_MB=50 evolu-relay

# Without Docker
npm install
npm start
```

## Connect Your App

```typescript
const evolu = createEvolu(Database, {
  syncUrl: "wss://your-relay-domain.com",
});
```
