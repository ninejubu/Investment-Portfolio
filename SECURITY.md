# Security

## Apps Script Deployment

The dashboard may remain a static public site, but every write request must be authenticated.

1. Open the Apps Script project.
2. Open **Project Settings**.
3. Add a Script Property named `WRITE_TOKEN`.
4. Use a long random value of at least 32 bytes.
5. Deploy a new Web App version.
6. Enter the same token in the dashboard's Google Sheets Integration settings.

The token is stored in browser `localStorage`; it must never be committed to this repository.

Read endpoints remain public so the static dashboard can load without Google login. Do not return data from a read endpoint unless it is acceptable for anyone with the deployment URL to see it.

GET handlers must remain read-only. Operations that update prices, rows, settings, or cached portfolio state must use authenticated POST requests.

## Rotation

Rotate both the Apps Script deployment and `WRITE_TOKEN` if either value is exposed. Old deployments must be disabled in Apps Script; deleting a URL from the current branch does not remove it from Git history.

## Before Committing

- Never commit API keys, passwords, OAuth tokens, private keys, wallet seed phrases, account numbers, or exported portfolio/cashflow data.
- Keep local secrets in ignored files.
- Review staged changes with `git diff --cached`.
