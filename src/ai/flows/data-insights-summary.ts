'use server';

import z from 'zod';
import { ai } from '../genkit';

/**
 * @fileOverview Provides a summary of key insights from financial data using GenAI.
 *
 * - getDataInsightsSummary - A function that generates a summary of key insights from the provided data.
 * - DataInsightsSummaryInput - The input type for the getDataInsightsSummary function.
 * - DataInsightsSummaryOutput - The return type for the getDataInsightsSummary function.
 */

// import { ai } from '@/ai/genkit';
// import { z } from 'genkit';

const DataInsightsSummaryInputSchema = z.object({
  financialData: z
    .string()
    .describe('A string containing the financial data to summarize.'),
});
export type DataInsightsSummaryInput = z.infer<
  typeof DataInsightsSummaryInputSchema
>;

const DataInsightsSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe('A summary of the key insights from the financial data.'),
});
export type DataInsightsSummaryOutput = z.infer<
  typeof DataInsightsSummaryOutputSchema
>;

export async function getDataInsightsSummary(
  input: DataInsightsSummaryInput
): Promise<DataInsightsSummaryOutput> {
  return dataInsightsSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dataInsightsSummaryPrompt',
  input: { schema: DataInsightsSummaryInputSchema },
  output: { schema: DataInsightsSummaryOutputSchema },
  prompt: `You are an expert financial analyst. Please provide a summary of key insights from the following financial data, highlighting any significant trends or anomalies. Be concise and clear.

Financial Data:
{{{financialData}}}`,
});

const dataInsightsSummaryFlow = ai.defineFlow(
  {
    name: 'dataInsightsSummaryFlow',
    inputSchema: DataInsightsSummaryInputSchema,
    outputSchema: DataInsightsSummaryOutputSchema,
  },
  // async (input: any) => {
  //   const { output } = await prompt(input);
  //   return output!;
  // }
  async (
    input: DataInsightsSummaryInput
  ): Promise<DataInsightsSummaryOutput> => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('No output generated from dataInsightsSummaryPrompt');
    }
    return output;
  }
);
