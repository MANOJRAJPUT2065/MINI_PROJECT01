## Security and Troubleshooting

### Security
- Replace all hardcoded private keys in code with env vars.
- Never commit secrets. Use .env and `.env.example`.
- Use strong `JWT_SECRET` and rotate tokens regularly.
- Configure CORS narrowly for production.
- Rate limit sensitive endpoints (already applied to email).

### Required environment variables
See `docs/env.example`.

### Troubleshooting
- Backend not connecting to DB: verify `MONGO_URI` and that MongoDB is reachable.
- Email errors: ensure `EMAIL_USER` and `EMAIL_PASS` are valid and app password is enabled.
- Cloudinary uploads failing: check `CLOUD_NAME`, `API_KEY`, `API_SECRET`.
- Pinata failures: verify keys and network connectivity.
- Blockchain errors: ensure Ganache/Hardhat node running and addresses/ABI match deployed contract.
- Python model path errors: update hardcoded Windows paths in `python/app.py` to local paths.
