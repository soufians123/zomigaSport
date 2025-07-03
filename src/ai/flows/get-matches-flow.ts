'use server';
/**
 * @fileOverview A flow for fetching football match schedules and results.
 *
 * - getMatches - A function that fetches a list of today's matches.
 * - Match - The type for a single match.
 * - MatchesData - The return type for the getMatches function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Schema for a single match
const MatchSchema = z.object({
  league: z.string().describe('The name of the league or competition.'),
  team1: z.string().describe("The name of the home team."),
  team1Logo: z.string().describe("A link to the home team's logo image. Use a generic placeholder if not found."),
  team2: z.string().describe("The name of the away team."),
  team2Logo: z.string().describe("A link to the away team's logo image. Use a generic placeholder if not found."),
  score: z.string().describe("The match score. E.g., '2 - 1', or 'vs' if the match hasn't started."),
  status: z.string().describe("The status of the match, like 'Finished', 'Live', a start time 'HH:MM', or 'Postponed'."),
  broadcastingChannels: z.array(z.string()).describe("A list of channels broadcasting the match in Arabic.").optional(),
});

// Schema for the entire list of matches
const MatchesDataSchema = z.object({
    matches: z.array(MatchSchema).describe("A list of football matches."),
});

export type Match = z.infer<typeof MatchSchema>;
export type MatchesData = z.infer<typeof MatchesDataSchema>;

// The exported function that the UI will call
export async function getMatches(): Promise<MatchesData> {
  return getMatchesFlow();
}

// The prompt that instructs the AI model
const getMatchesPrompt = ai.definePrompt({
    name: 'getMatchesPrompt',
    output: { schema: MatchesDataSchema },
    prompt: `You are an expert sports data provider. Your task is to find a list of important football (soccer) matches scheduled for today.

Provide a list of at least 10-15 significant matches from various popular leagues.

For each match, you must provide:
- The league name.
- The home team's name and a valid URL for their logo.
- The away team's name and a valid URL for their logo.
- The score: If the match is finished, show the final score (e.g., "3 - 1"). If it's live, show the current score. If it hasn't started, use "vs".
- The status: This should be the kick-off time (in the user's local time, assume CET), 'Live', 'HT' (for half-time), or 'Finished'.
- The broadcasting channels in Arabic (e.g., ["beIN Sports 1 HD", "Alkass One HD"]). If not available, omit the field.

IMPORTANT:
- If you cannot find a specific team logo, you MUST use a generic placeholder image URL: 'https://placehold.co/40x40.png'. Do not leave the logo URL empty or use invalid URLs.
- Return the data in the specified JSON format.
`,
});

// The Genkit flow that orchestrates the process
const getMatchesFlow = ai.defineFlow(
  {
    name: 'getMatchesFlow',
    outputSchema: MatchesDataSchema,
  },
  async () => {
    const { output } = await getMatchesPrompt();
    return output || { matches: [] };
  }
);
