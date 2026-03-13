import { shAllowFail } from "./git";

export async function runQa() {
  const install = await shAllowFail("bun install");
  const test = await shAllowFail("bun test");
  const lint = await shAllowFail("bun run lint");

  return {
    install,
    test,
    lint,
    ok: install.ok && test.ok && (lint.ok || lint.exitCode === 1),
    summary: summarize(install, test, lint),
  };
}

function summarize(...results: { ok: boolean; stdout: string; stderr: string; exitCode: number }[]) {
  const parts: string[] = [];
  for (const [i, r] of results.entries()) {
    parts.push(`STEP ${i + 1}: ok=${r.ok} exit=${r.exitCode}`);
    const out = (r.stdout + "\n" + r.stderr).trim();
    if (out) parts.push(out.slice(-8000));
  }
  return parts.join("\n");
}
