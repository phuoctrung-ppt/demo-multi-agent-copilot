# demo-multi-agent-copilot

Multi-agent orchestrator demo (Claude Code–style loop) implemented in **TypeScript + Bun**.

## Run locally

```bash
bun install
bun run agent -- "add a demo function and test"
```

## Run in GitHub Actions

- Manual: Actions → `agent-runner` → Run workflow (enter `goal`)
- Comment command: comment on an Issue/PR:

```text
/agent add a demo function and a test
```

## Modes

- `AGENT_MODE=mock` (default in workflows): does not call external LLMs; returns deterministic outputs to prove the loop works.
- `AGENT_MODE=live`: (not implemented yet in this scaffold) wire Gemini + OpenAI calls in `tools/agent-runner/src/llm.ts`.

## Secrets (for live mode)

- `GEMINI_API_KEY`
- `OPENAI_API_KEY`

## Env vars

- `AGENT_GOAL`: goal text
- `AGENT_BASE_BRANCH`: base branch (default `main`)
- `AGENT_MAX_ITERS`: retries per task (default `4`)
- `AGENT_CREATE_PR`: `true|false`