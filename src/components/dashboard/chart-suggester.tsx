'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Loader2 } from 'lucide-react';
import {
  suggestChartType,
  type ChartSuggestionInput,
  type ChartSuggestionOutput,
} from '@/ai/flows/chart-suggestion';
import { BarChart, LineChart, PieChart } from 'lucide-react';

const formSchema = z.object({
  dataDescription: z
    .string()
    .min(10, 'Description must be at least 10 characters.'),
  dataType: z.enum(['categorical', 'time-series', 'proportional']),
});

export function ChartSuggester() {
  const [suggestion, setSuggestion] = useState<ChartSuggestionOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataDescription: '',
      dataType: 'categorical',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const result = await suggestChartType(values);
      setSuggestion(result);
    } catch (error) {
      console.error('Failed to get chart suggestion:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const renderIcon = (chartType: 'bar' | 'line' | 'pie') => {
    switch (chartType) {
      case 'bar':
        return <BarChart className='h-10 w-10 text-primary' />;
      case 'line':
        return <LineChart className='h-10 w-10 text-primary' />;
      case 'pie':
        return <PieChart className='h-10 w-10 text-primary' />;
    }
  };

  return (
    <div className='grid gap-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='dataDescription'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='e.g., Monthly sales figures for the last year for different product categories.'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Briefly describe the data you want to visualize.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='dataType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a data type' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='categorical'>Categorical</SelectItem>
                    <SelectItem value='time-series'>Time-Series</SelectItem>
                    <SelectItem value='proportional'>Proportional</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Analyzing...
              </>
            ) : (
              <>
                <Lightbulb className='mr-2 h-4 w-4' />
                Get Suggestion
              </>
            )}
          </Button>
        </form>
      </Form>
      {suggestion && (
        <Card className='bg-primary/5 border-primary/20'>
          <CardHeader className='flex flex-row items-center gap-4'>
            {renderIcon(suggestion.suggestedChartType)}
            <div>
              <p className='text-sm text-muted-foreground'>Recommendation</p>
              <CardTitle className='capitalize'>
                {suggestion.suggestedChartType} Chart
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className='text-sm'>{suggestion.reasoning}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
