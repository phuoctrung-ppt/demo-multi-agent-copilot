import { $ } from "bun";

export async function sh(cmd: string) {
  const res = await $`bash -lc ${cmd}`.quiet();
  if (res.exitCode !== 0) throw new Error(`Command failed: ${cmd}\n${res.stderr.toString()}`);
  return res.stdout.toString().trim();
}

export async function shAllowFail(cmd: string) {
  const res = await $`bash -lc ${cmd}`.quiet();
  return {
    ok: res.exitCode === 0,
    stdout: res.stdout.toString(),
    stderr: res.stderr.toString(),
    exitCode: res.exitCode,
  };
}

export async function ensureCleanGit() {
  const status = await sh("git status --porcelain");
  if (status.trim().length) {
    throw new Error("Working tree is not clean. Commit/stash changes before running agent.");
  }
}

export async function currentDiff() {
  return await sh("git diff");
}

export async function applyUnifiedDiff(diff: string) {
  if (!diff.includes("diff --git")) throw new Error("Diff does not look like unified diff (missing 'diff --git').");
  if (diff.length > 250_000) throw new Error("Diff too large (>250k chars).");

  await Bun.write(".agent.patch", diff);
  try {
    await sh("git apply --whitespace=fix .agent.patch");
  } finally {
    await shAllowFail("rm -f .agent.patch");
  }
}

export async function commitAll(message: string) {
  await shAllowFail("git add -A");
  const st = await sh("git status --porcelain");
  if (!st.trim().length) return false;
  await sh(`git commit -m ${JSON.stringify(message)}`);
  return true;
}

export async function createBranch(baseBranch: string, prefix = "agent/") {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const branch = `${prefix}${ts}`;
  await sh(`git fetch origin ${baseBranch}`);
  await sh(`git checkout -B ${branch} origin/${baseBranch}`);
  return branch;
}

export async function pushBranch(branch: string) {
  await sh(`git push -u origin ${branch}`);
}

export async function ghCreatePr(title: string, body: string, base: string, head: string) {
  await sh(`gh pr create --title ${JSON.stringify(title)} --body ${JSON.stringify(body)} --base ${base} --head ${head}`);
}
