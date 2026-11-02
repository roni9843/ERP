# Infrastructure

Local development infrastructure is defined in the root [`docker-compose.yml`](../docker-compose.yml). The MongoDB replica set initiates itself through the container health check, so no init script is needed.

This folder will hold deployment assets once we choose a hosting target:

- `k8s/` or `terraform/`: environments (staging, production)
- Backup and restore runbooks for MongoDB
- Observability: log shipping (the API logs JSON with request ids), metrics and uptime checks

## Constraints to keep in mind

- **Data residency.** Some Saudi customers (especially government-related entities) require data to be hosted **inside the Kingdom**, and the Personal Data Protection Law (PDPL) restricts cross-border transfers of personal data. Pick a cloud region that can satisfy this before going live. See [docs/architecture/security.md](../docs/architecture/security.md).
- **MongoDB must be a replica set** in every environment, because transactions are used for financial postings.
- **Container images** are built from the root with `apps/api/Dockerfile` and `apps/web/Dockerfile`; both use `turbo prune`. They have not been verified in CI yet. Add an image-build job before the first deployment.
