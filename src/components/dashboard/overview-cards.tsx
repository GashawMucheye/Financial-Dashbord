import { ArrowUp, DollarSign, Wallet, Banknote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { FinancialData } from '@/lib/types';

type OverviewCardsProps = {
  data: FinancialData[];
};

export default function OverviewCards({ data }: OverviewCardsProps) {
  const totalRevenue = data
    .filter((d) => d.category === 'Revenue')
    .reduce((sum, item) => sum + item.value, 0);

  const totalExpenses = data
    .filter((d) => d.category === 'Expenses')
    .reduce((sum, item) => sum + item.value, 0);

  const totalProfit = data
    .filter((d) => d.category === 'Profit')
    .reduce((sum, item) => sum + item.value, 0);

  const averageTransactionValue =
    data.length > 0
      ? data.reduce((sum, item) => sum + item.value, 0) / data.length
      : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
          <DollarSign className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {formatCurrency(totalRevenue)}
          </div>
          <p className='text-xs text-muted-foreground'>
            +20.1% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Expenses</CardTitle>
          <Wallet className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {formatCurrency(totalExpenses)}
          </div>
          <p className='text-xs text-muted-foreground'>
            +18.1% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Profit</CardTitle>
          <ArrowUp className='h-4 w-4 text-green-500' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {formatCurrency(totalProfit)}
          </div>
          <p className='text-xs text-muted-foreground'>+19% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Avg. Record Value
          </CardTitle>
          <Banknote className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {formatCurrency(averageTransactionValue)}
          </div>
          <p className='text-xs text-muted-foreground'>+5.2% from last month</p>
        </CardContent>
      </Card>
    </div>
  );
}
