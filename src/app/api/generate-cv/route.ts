import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildCVPrompt } from "@/lib/prompts";
import type { UserProfile, JobListing } from "@/types";

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  const { profile, job, language } = (await request.json()) as {
    profile: UserProfile;
    job: JobListing;
    language: string;
  };

  if (!profile || !job) {
    return Response.json(
      { error: "Profile and job data are required" },
      { status: 400 }
    );
  }

  const prompt = buildCVPrompt(profile, job, language || "en");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return Response.json(
      { error: "No response from AI" },
      { status: 500 }
    );
  }

  const cvData = JSON.parse(textBlock.text);

  return Response.json(cvData);
}
