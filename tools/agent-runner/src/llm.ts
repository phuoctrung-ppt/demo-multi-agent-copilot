import { PlannerOutputSchema, CoderOutputSchema, ReviewerOutputSchema, type PlannerOutput, type CoderOutput, type ReviewerOutput } from "./schemas";

const mode = process.env.AGENT_MODE ?? "mock";

export async function callPlanner(input: { goal: string; context: any }): Promise<PlannerOutput> {
  if (mode === "mock") {
    return PlannerOutputSchema.parse({
      tasks: [
        {
          id: "T1",
          title: "Add a demo file and a basic test",
          acceptance: ["Repo has src/demo.ts", "bun test passes"],
          files_hint: ["src/demo.ts", "src/demo.test.ts"],
        },
      ],
      notes: ["Mock planner output (set AGENT_MODE=live to use Gemini)."],
    });
  }
  throw new Error("Live planner not implemented yet. Add GEMINI_API_KEY and implement Gemini call here.");
}

export async function callCoder(input: { goal: string; task: any; context: any; reviewerFeedback?: string }): Promise<CoderOutput> {
  if (mode === "mock") {
    const diff = [
      `diff --git a/src/demo.ts b/src/demo.ts`,
      `new file mode 100644`,
      `index 0000000..1111111`,
      `--- /dev/null`,
      `+++ b/src/demo.ts`,
      `@@ -0,0 +1,7 @@`,
      `+export function add(a: number, b: number) {`,
      `+  return a + b;`,
      `+}`,
      `+`,
      `+export function hello(name: string) {`,
      `+  return \`Hello, \${name}\`;`,
      `+}`,
      ``,
      `diff --git a/src/demo.test.ts b/src/demo.test.ts`,
      `new file mode 100644`,
      `index 0000000..2222222`,
      `--- /dev/null`,
      `+++ b/src/demo.test.ts`,
      `@@ -0,0 +1,14 @@`,
      `+import { describe, expect, test } from "bun:test";`,
      `+import { add, hello } from "./demo";`,
      `+`,
      `+describe("demo", () => {`,
      `+  test("add", () => {`,
      `+    expect(add(2, 3)).toBe(5);`,
      `+  });`,
      `+`,
      `+  test("hello", () => {`,
      `+    expect(hello("Trung")).toBe("Hello, Trung");`,
      `+  });`,
      `+});`,
      ``,
    ].join("\n");

    return CoderOutputSchema.parse({
      type: "patch",
      summary: "Add demo functions and tests (mock coder)",
      diff,
    });
  }
  throw new Error("Live coder not implemented yet. Add OPENAI_API_KEY and implement Codex call here.");
}

export async function callReviewer(input: { goal: string; task: any; diff: string; qaSummary: string }): Promise<ReviewerOutput> {
  if (mode === "mock") {
    const ok = input.qaSummary.includes("exit=0") || input.qaSummary.includes("ok=true");
    return ReviewerOutputSchema.parse({
      approved: ok,
      comments: ok ? ["Looks good (mock reviewer)."] : ["QA failed (mock reviewer)."],
      required_changes: ok ? [] : ["Fix failing tests."],
    });
  }
  throw new Error("Live reviewer not implemented yet. Add OPENAI_API_KEY and implement Codex reviewer call here.");
}
