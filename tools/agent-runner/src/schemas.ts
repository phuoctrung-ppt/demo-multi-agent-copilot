import { z } from "zod";

export const PlannerOutputSchema = z.object({
  tasks: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        acceptance: z.array(z.string()).min(1),
        files_hint: z.array(z.string()).optional().default([]),
      }),
    )
    .min(1),
  notes: z.array(z.string()).optional().default([]),
});

export const CoderOutputSchema = z.object({
  type: z.literal("patch"),
  summary: z.string().min(1),
  diff: z.string().min(1),
});

export const ReviewerOutputSchema = z.object({
  approved: z.boolean(),
  comments: z.array(z.string()).default([]),
  required_changes: z.array(z.string()).default([]),
});

export type PlannerOutput = z.infer<typeof PlannerOutputSchema>;
export type CoderOutput = z.infer<typeof CoderOutputSchema>;
export type ReviewerOutput = z.infer<typeof ReviewerOutputSchema>;
