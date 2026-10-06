# Authentication implementation

`packages/auth` supplies shared validation and legacy mapping contracts. `apps/api` implements the password-account service against PostgreSQL. Setup and route payloads are in [the API README](../apps/api/README.md).

- Emails are normalized before lookup. New passwords require at least 10 characters, uppercase, lowercase, and a number, with a 72-byte UTF-8 ceiling to avoid bcrypt truncation. Existing bcrypt hashes remain compatible.
- Random session tokens are stored only as SHA-256 hashes. HttpOnly, SameSite=Lax cookies expire after seven days and use Secure when the application origin is HTTPS. Every authenticated lookup checks expiry, account disabled state, and `auth_version`.
- Two-factor sign-in uses a five-minute challenge that cannot access projects. Authenticator secrets use AES-256-GCM with `AUTH_ENCRYPTION_KEY`; setup expires after ten minutes. Accepted time steps cannot be replayed, and recovery codes are hashed and consumed once under the user lock.
- Reset links expire after 30 minutes. Token consumption and password updates commit together; concurrent reuse fails. Password changes and resets revoke prior sessions. Reset requests return the same public response for unknown accounts and mail delivery failures; failed delivery invalidates its token and emits an operational error without the address or token.
- Enabling or disabling two-factor authentication rotates sessions. Account disabling requires the current password and, when enabled, a second factor; it revokes sessions and reset links while preserving owned data.
- Mutations require a trusted application Origin and custom header. Production accepts only the exact configured Origin. Development additionally accepts HTTP localhost, 127.0.0.1, and IPv6 loopback aliases on the configured port. PostgreSQL-backed attempt limits survive API restarts. Client errors retain 4xx status codes, including malformed JSON, unsupported content types, and oversized bodies.

## Migration boundary

`preserveLegacyAccount` is a pure mapping contract, not an executed database migration. It retains legacy IDs, password hashes, disabled state, auth version, and provider references. The live schema uses UUID account IDs with a separate `legacy_user_id`; a real migration must create and audit that mapping, including non-UUID source IDs. Provider persistence and OAuth sign-in are not implemented.

Before production cutover, complete the encrypted backup, isolated restore, identity/provider mapping, reconciliation ledger, and account-access checks in [REBUILD-AUDIT.md](REBUILD-AUDIT.md). No production account migration was performed as part of this local service implementation.
