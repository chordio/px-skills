export interface EvalTask {
  id: string;
  fixture: string;
  prompt: string;
}

export interface SkillConfig {
  description: string;
  tasks: EvalTask[];
  rubric: {
    dimensions: Array<{
      name: string;
      weight: number;
      requiresFixture?: string[];
    }>;
    graderPrompt: string;
  };
}

export interface EvalsConfig {
  version: string;
  skills: Record<string, SkillConfig>;
}

export function getEvalsConfig(): EvalsConfig {
  return {
    version: "1.0.0",
    skills: {
      "design-spec-writer": {
        description: "Tests context-aware spec generation",
        tasks: [
          {
            id: "login-form",
            fixture: "minimal",
            prompt:
              "Write a design spec for a login form with email and password fields for the TaskFlow app.",
          },
          {
            id: "dashboard-widget",
            fixture: "with-system",
            prompt:
              "Write a design spec for a dashboard card showing daily active users for the TaskFlow app. The card should fit into the existing dashboard layout.",
          },
          {
            id: "edit-profile",
            fixture: "full",
            prompt:
              "Write a design spec for an edit profile form where users can update their name, email, and avatar. This should fit into the existing TaskFlow design patterns.",
          },
        ],
        rubric: {
          dimensions: [
            { name: "completeness", weight: 1 },
            { name: "specificity", weight: 1 },
            { name: "token_refs", weight: 1 },
            {
              name: "pattern_adherence",
              weight: 1,
              requiresFixture: ["with-system", "full"],
            },
            { name: "journey_awareness", weight: 1, requiresFixture: ["full"] },
          ],
          graderPrompt: `You are evaluating a design specification for quality.

Evaluate this design spec on these dimensions (0-3 each):

1. COMPLETENESS (0-3)
   0: Missing major sections
   1: Has basic structure but missing strategic scaffold OR implementation details
   2: Has both sections but incomplete
   3: Complete strategic scaffold AND implementation details

2. SPECIFICITY (0-3)
   0: Vague, generic advice
   1: Some specific details but mostly general
   2: Mostly specific but some gaps
   3: Exact measurements, copy, UI states defined

3. TOKEN_REFS (0-3)
   0: Uses hardcoded values (e.g., "#3B82F6", "16px")
   1: Mix of hardcoded and token references
   2: Mostly token references with few hardcoded
   3: All values reference design tokens (e.g., "spacing.lg", "color.primary")

4. PATTERN_ADHERENCE (0-3) [Only score if design context includes components.md]
   0: Introduces unnecessary new patterns when existing ones would work
   1: Partial reuse of existing patterns
   2: Good reuse of existing patterns with minor gaps
   3: Leverages existing patterns, only introduces new when justified

5. JOURNEY_AWARENESS (0-3) [Only score if design context includes user-journeys.md]
   0: Treats the feature as an isolated page
   1: Mentions broader product context
   2: Considers how this feature connects to adjacent flows
   3: Actively optimizes for the overall user journey

Return a JSON object with scores and reasoning:
{
  "completeness": <0-3>,
  "specificity": <0-3>,
  "token_refs": <0-3>,
  "pattern_adherence": <0-3 or null if not applicable>,
  "journey_awareness": <0-3 or null if not applicable>,
  "total": <sum of applicable scores>,
  "max_possible": <maximum possible score based on applicable dimensions>,
  "reasoning": "<brief explanation of scores>"
}`,
        },
      },
    },
  };
}
