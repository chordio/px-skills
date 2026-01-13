import { NextRequest } from "next/server";
import { getRecentResults, getResultsBySkill } from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const skill = searchParams.get("skill");
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  try {
    const results = skill
      ? await getResultsBySkill(skill)
      : await getRecentResults(limit);

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
