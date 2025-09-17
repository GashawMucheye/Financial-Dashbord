'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { FinancialData } from '@/lib/types';
import { useMemo } from 'react';

type DataChartsProps = {
  data: FinancialData[];
};

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function DataCharts({ data }: DataChartsProps) {
  const barChartData = useMemo(() => {
    return data
      .filter((d) => ['Revenue', 'Expenses', 'Profit'].includes(d.category))
      .reduce((acc, item) => {
        const quarter = item.label.split(' ')[0];
        let entry = acc.find((e) => e.name === quarter);
        if (!entry) {
          entry = { name: quarter, Revenue: 0, Expenses: 0, Profit: 0 };
          acc.push(entry);
        }
        (entry as any)[item.category] += item.value;
        return acc;
      }, [] as { name: string; Revenue: number; Expenses: number; Profit: number }[]);
  }, [data]);

  const barChartConfig = {
    Revenue: { label: 'Revenue', color: 'hsl(var(--chart-1))' },
    Expenses: { label: 'Expenses', color: 'hsl(var(--chart-2))' },
  } satisfies ChartConfig;

  const lineChartData = useMemo(() => {
    return data
      .filter((d) => d.category === 'Profit')
      .map((item) => ({ name: item.label.split(' ')[0], Profit: item.value }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  const lineChartConfig = {
    Profit: { label: 'Profit', color: 'hsl(var(--chart-1))' },
  } satisfies ChartConfig;

  const pieChartData = useMemo(() => {
    const expensesByCategory = data
      .filter((d) => d.category === 'Expenses')
      .reduce((acc, item) => {
        const key = item.label.includes('Marketing')
          ? 'Marketing'
          : 'Operations';
        acc[key] = (acc[key] || 0) + item.value;
        return acc;
      }, {} as { [key: string]: number });
    return Object.entries(expensesByCategory).map(([name, value]) => ({
      name,
      value,
      fill: '',
    }));
  }, [data]);

  const pieChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    pieChartData.forEach((entry, index) => {
      config[entry.name] = {
        label: entry.name,
        color: COLORS[index % COLORS.length],
      };
      entry.fill = COLORS[index % COLORS.length];
    });
    return config;
  }, [pieChartData]);

  return (
    <div className='grid gap-6 md:grid-cols-2'>
      <Card>
        <CardHeader>
          <CardTitle>Quarterly Performance</CardTitle>
          <CardDescription>Revenue vs. Expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={barChartConfig}
            className='h-64 sm:h-80 w-full'
          >
            <BarChart data={barChartData} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='name'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey='Revenue' fill='var(--color-Revenue)' radius={4} />
              <Bar dataKey='Expenses' fill='var(--color-Expenses)' radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Profit Trend</CardTitle>
          <CardDescription>Profit growth over quarters</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={lineChartConfig}
            className='h-64 sm:h-80 w-full'
          >
            <LineChart data={lineChartData} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='name'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type='monotone'
                dataKey='Profit'
                stroke='var(--color-Profit)'
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className='md:col-span-2'>
        <CardHeader>
          <CardTitle>Expense Distribution</CardTitle>
          <CardDescription>Breakdown of expenses by category</CardDescription>
        </CardHeader>
        <CardContent className='flex items-center justify-center'>
          <ChartContainer
            config={pieChartConfig}
            className='h-64 sm:h-80 w-full'
          >
            <PieChart accessibilityLayer>
              <ChartTooltip content={<ChartTooltipContent nameKey='name' />} />
              <Pie
                data={pieChartData}
                dataKey='value'
                nameKey='name'
                cx='50%'
                cy='50%'
                outerRadius={100}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
