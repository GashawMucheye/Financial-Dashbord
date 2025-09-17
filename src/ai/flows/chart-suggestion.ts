// ChartSuggestion.ts
'use server';

import z from 'zod';
import { ai } from '../genkit';

/**
 * @fileOverview This file defines a Genkit flow for suggesting the most appropriate chart type (bar, line, pie) based on the input data.
 *  It exports the `suggestChartType` function, the `ChartSuggestionInput` type, and the `ChartSuggestionOutput` type.
 */

const ChartSuggestionInputSchema = z.object({
  dataDescription: z
    .string()
    .describe(
      'A description of the data to be visualized, including the type of data and what it represents.'
    ),
  dataType: z
    .enum(['categorical', 'time-series', 'proportional'])
    .describe('The type of data: categorical, time-series, or proportional.'),
});

export type ChartSuggestionInput = z.infer<typeof ChartSuggestionInputSchema>;

const ChartSuggestionOutputSchema = z.object({
  suggestedChartType: z
    .enum(['bar', 'line', 'pie'])
    .describe(
      'The suggested chart type for visualizing the data: bar, line, or pie.'
    ),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the chart type suggestion, explaining why the suggested chart type is appropriate for the data.'
    ),
});

export type ChartSuggestionOutput = z.infer<typeof ChartSuggestionOutputSchema>;

export async function suggestChartType(
  input: ChartSuggestionInput
): Promise<ChartSuggestionOutput> {
  return chartSuggestionFlow(input);
}

const chartSuggestionPrompt = ai.definePrompt({
  name: 'chartSuggestionPrompt',
  input: { schema: ChartSuggestionInputSchema },
  output: { schema: ChartSuggestionOutputSchema },
  prompt: `You are an expert data visualization consultant. Given a description of the data and its type, you will suggest the most appropriate chart type (bar, line, or pie) for visualizing the data. You will also provide a brief explanation of your reasoning.

Data Description: {{{dataDescription}}}
Data Type: {{{dataType}}}

Consider these guidelines:
- Use bar charts to compare categorical data.
- Use line charts to show trends over time.
- Use pie charts to show proportions of a whole.

Suggest a chart type and explain your reasoning.`,
});

const chartSuggestionFlow = ai.defineFlow(
  {
    name: 'chartSuggestionFlow',
    inputSchema: ChartSuggestionInputSchema,
    outputSchema: ChartSuggestionOutputSchema,
  },
  async (input) => {
    const { output } = await chartSuggestionPrompt(input);
    return output!;
  }
);
