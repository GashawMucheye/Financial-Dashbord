'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import DataForm from './data-form';
import type { FinancialData } from '@/lib/types';
import { SidebarTrigger } from '@/components/ui/sidebar';

type DashboardHeaderProps = {
  addData: (data: Omit<FinancialData, 'id'>) => void;
};

export default function DashboardHeader({ addData }: DashboardHeaderProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className='sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6'>
      <SidebarTrigger className='md:hidden' />
      <div className='flex-1'>
        <h1 className='text-lg font-semibold sm:text-xl md:text-2xl'>
          Dashboard
        </h1>
      </div>
      <div className='flex items-center gap-2 sm:gap-4'>
        <form className='hidden sm:block'>
          <div className='relative'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search data...'
              className='pl-8 sm:w-[200px] md:w-[300px]'
            />
          </div>
        </form>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <Button onClick={() => setIsSheetOpen(true)} size='sm'>
            <Plus className='h-4 w-4 md:mr-2' />
            <span className='hidden md:inline'>Add Data</span>
          </Button>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New Financial Data</SheetTitle>
              <SheetDescription>
                Fill in the form below to add a new data point to your
                dashboard.
              </SheetDescription>
            </SheetHeader>
            <DataForm
              onSave={(data) => {
                const dataToSave = {
                  ...data,
                  date: data.date,
                };
                addData(dataToSave);
                setIsSheetOpen(false);
              }}
              onCancel={() => setIsSheetOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
