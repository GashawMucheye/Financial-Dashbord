'use client';

import { useState } from 'react';
import { Book, LayoutGrid, Lightbulb, Settings } from 'lucide-react';
import { useFinancialData } from '@/hooks/use-financial-data';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardHeader from '@/components/dashboard/header';
import OverviewCards from '@/components/dashboard/overview-cards';
import DataCharts from '@/components/dashboard/data-charts';
import DataTable from '@/components/dashboard/data-table';
import { ChartSuggester } from '@/components/dashboard/chart-suggester';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { data, loading, addData, updateData, deleteData } = useFinancialData();
  const [isSuggesterOpen, setIsSuggesterOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className='flex min-h-screen'>
        <Sidebar>
          <SidebarHeader>
            <div className='flex items-center gap-2 p-2'>
              <Book className='size-8 text-primary' />
              <h1 className='text-xl font-semibold'>FinView</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>
                  <LayoutGrid />
                  Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setIsSuggesterOpen(true)}>
                  <Lightbulb />
                  Chart Suggester
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings />
                  Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className='flex-1'>
          <DashboardHeader addData={addData} />
          <main className='p-4 md:p-6 lg:p-8'>
            {loading ? (
              <div className='grid gap-6'>
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
                  <Skeleton className='h-32' />
                  <Skeleton className='h-32' />
                  <Skeleton className='h-32' />
                  <Skeleton className='h-32' />
                </div>
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                  <Skeleton className='h-80' />
                  <Skeleton className='h-80' />
                </div>
                <Skeleton className='h-96' />
              </div>
            ) : (
              <div className='grid gap-8'>
                <OverviewCards data={data} />
                <DataCharts data={data} />
                <DataTable
                  data={data}
                  updateData={updateData}
                  deleteData={deleteData}
                />
              </div>
            )}
          </main>
        </SidebarInset>
      </div>

      <Dialog open={isSuggesterOpen} onOpenChange={setIsSuggesterOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>AI Chart Suggester</DialogTitle>
            <DialogDescription>
              Get an AI-powered recommendation for the best chart to visualize
              your data.
            </DialogDescription>
          </DialogHeader>
          <ChartSuggester />
          <Button
            variant='outline'
            onClick={() => setIsSuggesterOpen(false)}
            className='mt-4'
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
