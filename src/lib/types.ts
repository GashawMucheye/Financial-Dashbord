export type FinancialData = {
  id: string;
  label: string;
  value: number;
  category: 'Revenue' | 'Expenses' | 'Profit';
  date: string;
};

export type ChartData = {
  name: string;
  [key: string]: number | string;
};
