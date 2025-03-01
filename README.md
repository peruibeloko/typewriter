# Typewriter

Simple CMS written in TypeScript, runs on [Hono](https://hono.dev/) and [Deno](https://deno.com/). Data is stored using Markdown files on disk and SQLite for metadata.

## Installation

0. Install Deno
1. `git clone`
2. `deno install`
3. [Configure typewriter](#configuration)
4. `deno task start`

## Configuration

Typewriter uses two sources for its config: Either a **TOML file** or **environment variables**. The former takes precedence over the latter.

### TOML file example (for self hosting)

```toml
# A signing secret for your JWT
JWT_SECRET = "some big random string for signing JWTs"

# [Optional] Contains either:
# - A folder where a database file will be created for you
# - A database file itself
DB_PATH = "/some/path/to/folder/or/typewriter.db"

# [Optional] Enables console verbosity. Also prints all registered routes
VERBOSE = false
```

### Environment variables example (for cloud hosting)

```bash
# A signing secret for your JWT
export TYPEWRITER_JWT_SECRET="some big random string for signing JWTs"

# [Optional] Contains either:
# - A folder where a database file will be created for you
# - A database file itself
export TYPEWRITER_DB_PATH="/some/path/to/folder/or/typewriter.db"

# [Optional] Enables console verbosity. Also prints all registered routes
export TYPEWRITER_VERBOSE=false
```

## Authentication

Typewriter's authentication model is a combination of an allowlist with OTPs.

There are three steps:

1. Send a `register <email>` command on the typewriter CLI to get your email on the allowlist

```
> register test@example.com
successfully registered test@example.com
```

2. Send a `POST` request to `/auth/signup` to get an OTP secret

```json
{
  "displayName": "John Smith",
  "email": "john@example.com"
}
```

3. Send a `POST` request to `/auth/login` to get your JWT

```json
{
  "email": "john@example.com",
  "code": "123456",
}
```

## Usage

Typewriter has its own web server, which answers to RESTful requests. The full API is outlined [here](https://carlinhos.dev.br/typewriter/swagger) (Not built yet)

It also provides a simple CLI for issuing administrative commands, such as registering a new user and gracefully shutting down the server.

### Commands

> TODO
