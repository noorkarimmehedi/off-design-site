---
name: ask-secrets
description: Ask the person for API keys, tokens, passwords, connection strings and other private values through the query CLI, which opens a small prompt on their Mac, instead of asking them to paste the value into chat. Use whenever a task needs a credential or environment variable you don't have, such as a missing API key, a command failing on an unset variable, a .env file that needs a value, or a test that needs live credentials.
---

# ask-secrets

Never ask the person to paste a secret into chat. Anything pasted there is
stored with the conversation. Ask through `query` instead: it opens a small
prompt on their Mac, they type the value, and it goes where it is needed
without passing through you.

## Make sure query is installed

Run `command -v query`. If nothing is found, tell the person and offer to
install it. With their OK, run:

```sh
curl -fsSL https://raw.githubusercontent.com/R44VC0RP/query/main/install.sh | sh
```

It installs to `~/.local/bin/query` and only works on macOS. If that folder is
not on `PATH`, call it as `~/.local/bin/query`. Never fall back to asking for
the secret in chat because query is missing.

## Pick the command

Use the first one that fits. Each one after it exposes the value a little more.

1. **`query run`**: the value is needed by one command. query runs the
   command with the value set as an environment variable, and you never see
   it.

   ```sh
   query run STRIPE_SECRET_KEY --reason "Run the checkout tests" -- npm test
   query run CLOUDFLARE_API_TOKEN --reason "Deploy the worker" -- npx wrangler deploy
   ```

2. **`query write`**: the value belongs in a `.env` file the project already
   reads. Existing keys are replaced, other lines are kept, and the file is
   saved so only the owner can read it.

   ```sh
   query write .env.local DATABASE_URL "RESEND_API_KEY:From resend.com, API Keys"
   ```

   First check that git ignores the file: `git check-ignore -q .env.local`.
   If it doesn't, say so and don't write the secret.

3. **`query get`**: only for values that aren't secret, like a region or a
   project ID. It prints the value back to you, so it ends up in the
   conversation.

   ```sh
   query get AWS_REGION --format export
   ```

## Ask well

- Use the exact variable names the code reads.
- Ask for every value the task needs in one prompt, not one prompt per key.
- When the person may not know where to find a value, add a hint after a
  colon: `"GITHUB_TOKEN:Fine-grained token, contents read"`.
- Add `--reason` with one short sentence saying what the values are for.

## Wait for the answer

The prompt stays open until the person answers. Run `query` in the
foreground with a timeout of several minutes, or pass `--timeout SECONDS`.

| Exit code | Meaning | What to do |
| --- | --- | --- |
| 0 | Value given (for `run`, the command's own exit code) | Carry on |
| 1 | The person closed the prompt | Stop. Ask in chat whether to continue without it. Don't open the prompt again unless they say so. |
| 2 | The command was wrong | Fix it. See `query --help`. |
| 124 | Nobody answered in time | Tell the person the prompt timed out |

## Limits

- query needs the person's Mac desktop. It doesn't work over SSH, in CI, in
  containers or in VMs. There, ask the person to set the variable themselves.
- Never print, log or commit a value you receive.
- Never put a value in a command's arguments, where other processes can see
  it. Read it from the environment inside the command.

---

query is an open-source tool by Ryan Vogel (MIT): https://github.com/R44VC0RP/query.
This skill is written and published by arc.: https://www.arc-bangladesh.com/skills
