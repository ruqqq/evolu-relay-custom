FROM docker.io/evoluhq/relay:latest

# Override with our custom entrypoint that supports env vars
COPY --chown=evolu:nodejs src/index.js ./src/index.js

CMD ["node", "src/index.js"]
