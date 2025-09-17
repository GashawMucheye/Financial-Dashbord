'use client';

import { useState } from 'react';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import DataForm from './data-form';
import type { FinancialData } from '@/lib/types';

type DataTableProps = {
  data: FinancialData[];
  updateData: (id: string, data: Partial<Omit<FinancialData, 'id'>>) => void;
  deleteData: (id: string) => void;
};

export default function DataTable({
  data,
  updateData,
  deleteData,
}: DataTableProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<FinancialData | null>(null);

  const handleEdit = (item: FinancialData) => {
    setSelectedData(item);
    setIsSheetOpen(true);
  };

  const handleDelete = (item: FinancialData) => {
    setSelectedData(item);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (selectedData) {
      deleteData(selectedData.id);
    }
    setIsAlertOpen(false);
    setSelectedData(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Financial Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className='text-right'>Value</TableHead>
                <TableHead className='w-[50px]'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='font-medium'>{item.label}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell className='text-right'>
                    {formatCurrency(item.value)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                          <span className='sr-only'>Open menu</span>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                          <Edit className='mr-2 h-4 w-4' /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(item)}
                          className='text-destructive'
                        >
                          <Trash2 className='mr-2 h-4 w-4' /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Financial Data</SheetTitle>
            <SheetDescription>
              Update the details of your financial record.
            </SheetDescription>
          </SheetHeader>
          {selectedData && (
            <DataForm
              initialData={selectedData}
              onSave={(d) => {
                if (selectedData) {
                  updateData(selectedData.id, d);
                }
                setIsSheetOpen(false);
                setSelectedData(null);
              }}
              onCancel={() => {
                setIsSheetOpen(false);
                setSelectedData(null);
              }}
            />
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              financial record for&nbsp;
              <strong>&quot;{selectedData?.label}&quot;</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className='bg-destructive hover:bg-destructive/90'
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
