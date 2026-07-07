# Insighta CLI

A command-line tool for interacting with the Insighta Labs+ platform. Authenticate via GitHub, manage profiles, run natural language searches, and export data — all from the terminal.

## Installation

```bash
git clone https://github.com/fikayosalu/insighta-cli.git
cd insighta-cli
npm install
npm run build
npm link
```

After installation, the `insighta` command is available globally from any directory.

> **Windows note:** On Windows, use PowerShell or Command Prompt to run the `insighta` command. Git Bash may have path resolution issues with globally installed CLI tools.

## Configuration

The CLI connects to the Insighta Labs+ backend. By default it points to `http://localhost:4000`. To change this, edit `src/config.ts` before building.

## Authentication

### Login

```bash
insighta login
```

This opens your browser to GitHub's authorization page. After you log in and authorize the app, the CLI receives your tokens and stores them locally. The flow uses OAuth 2.0 with PKCE:

1. CLI generates a random `code_verifier` and its SHA-256 hash (`code_challenge`)
2. CLI starts a temporary local server on port 9876
3. CLI opens your browser to GitHub with the `code_challenge`
4. You log into GitHub
5. GitHub redirects to the local server with an authorization code
6. CLI sends the code and `code_verifier` to the backend
7. Backend verifies with GitHub, issues JWT tokens
8. CLI saves tokens to `~/.insighta/credentials.json`

### Check current user

```bash
insighta whoami
```

Output:

```
Logged in as analyst @ username: fikayosalu
```

### Logout

```bash
insighta logout
```

Invalidates your refresh token on the server and deletes local credentials.

## Token Handling

The CLI stores an access token (3 min expiry) and a refresh token (5 min expiry) at `~/.insighta/credentials.json`. The access token is sent with every API request in the `Authorization: Bearer` header.

When the access token expires, the backend returns 401. The CLI currently prompts the user to log in again. If both tokens expire, a full re-login via GitHub is required.

## Commands

### List profiles

```bash
insighta profiles list
insighta profiles list --gender male
insighta profiles list --country Nigeria --age-group adult
insighta profiles list --min-age 25 --max-age 40
insighta profiles list --sort-by age --order desc
insighta profiles list --page 2 --limit 20
```

Available filters:

| Flag                  | Description                                          |
| --------------------- | ---------------------------------------------------- |
| `--gender <gender>`   | Filter by gender (male/female)                       |
| `--country <country>` | Filter by country name                               |
| `--age-group <group>` | Filter by age group (child, teenager, adult, senior) |
| `--min-age <age>`     | Minimum age                                          |
| `--max-age <age>`     | Maximum age                                          |
| `--sort-by <field>`   | Sort by field (age, name, created_at, etc.)          |
| `--order <order>`     | Sort direction (asc/desc)                            |
| `--page <number>`     | Page number                                          |
| `--limit <number>`    | Results per page                                     |

Output is a formatted table with pagination info.

### Get a profile

```bash
insighta profiles get <id>
```

Example:

```bash
insighta profiles get 019db9c7-7223-775c-9429-1ffa39f96d36
```

Displays a single profile's details in a table.

### Search profiles (natural language)

```bash
insighta profiles search "young males from nigeria"
insighta profiles search "females above 30"
insighta profiles search "people from angola"
insighta profiles search "adult males from kenya"
```

The query is sent to the backend's natural language parser which converts plain English into database filters. See the backend README for full details on supported keywords and parsing logic.

### Create a profile (admin only)

```bash
insighta profiles create --name "Harriet Tubman"
```

The backend calls external APIs (Genderize, Agify, Nationalize) to determine gender, age, and country, then stores the complete profile. Only users with the `admin` role can create profiles.

### Export profiles to CSV

```bash
insighta profiles export --format csv
insighta profiles export --format csv --gender male --country Nigeria
```

Downloads a CSV file to your current working directory. Supports the same filters as `profiles list` (except pagination).

## Role-Based Access

| Role    | Can list/search/export | Can create/delete |
| ------- | ---------------------- | ----------------- |
| admin   | Yes                    | Yes               |
| analyst | Yes                    | No                |

All new users are assigned the `analyst` role by default. If you attempt an action beyond your role, the CLI displays an error.

## Error Handling

The CLI handles errors for common scenarios:

| Error                          | CLI Response                                   |
| ------------------------------ | ---------------------------------------------- |
| Not logged in                  | "Please log in"                                |
| Access token expired           | "Session expired. Please run 'insighta login'" |
| Permission denied (wrong role) | Displays the server's error message            |
| Profile not found              | "Profile not found"                            |
| Network error                  | "Something went wrong. Please try again later" |

## Project Structure

```
src/
├── index.ts                          # Entry point, command registration
├── config.ts                         # API URL and GitHub client ID
├── commands/
│   ├── auth.ts                       # whoami command
│   ├── login.ts                      # login command (PKCE flow)
│   ├── logout.ts                     # logout command
│   └── profiles/
│       ├── index.ts                  # profiles parent command
│       └── subcommands/
│           ├── listProfiles.ts       # profiles list
│           ├── getAProfile.ts        # profiles get <id>
│           ├── searchProfile.ts      # profiles search <query>
│           ├── createProfile.ts      # profiles create --name
│           └── exportProfile.ts      # profiles export --format csv
├── utils/
│   ├── credentials.ts               # Read/write/clear ~/.insighta/credentials.json
│   └── helpers.ts                    # Shared utilities (error handling)
└── types/
    └── index.ts                      # TypeScript interfaces
```

## Tech Stack

- TypeScript
- Commander.js (command parsing)
- Axios (HTTP client)
- cli-table3 (table formatting)
- chalk (colored output)
- ora (loading spinners)
- open (browser launch for OAuth)
