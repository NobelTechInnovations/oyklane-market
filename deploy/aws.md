# Oyklane Store (market) on AWS Lightsail (Docker)

Runs on the API's server (`ubuntu@13.200.105.217`) in `~/apps/oyklane-market`, behind the shared Caddy in `~/apps/proxy`
(server layout: `oyklane-api/deploy/aws.md`). Set up with `oyklane-api/deploy/frontends-setup.sh`.

- **Address:** market.oyklane.com.
- **Deploy:** every push to `main` runs `.github/workflows/deploy.yml` → `~/apps/bin/deploy-oyklane-market.sh` (pull, rebuild, restart).
  By hand: `~/apps/bin/deploy-oyklane-market.sh`.
- **Settings:** addresses are build arguments in `deploy/docker-compose.prod.yml` (edit and push).
- **HTTPS:** `~/apps/proxy/sites/oyklane-market.caddy` (copy of `deploy/oyklane-market.caddy`).

## Useful
```bash
cd ~/apps/oyklane-market
docker compose -f deploy/docker-compose.prod.yml ps
docker compose -f deploy/docker-compose.prod.yml logs --since 1h web
```
