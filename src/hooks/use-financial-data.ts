'use client';

import { useState, useEffect, useCallback } from 'react';
import type { FinancialData } from '@/lib/types';
import { initialFinancialData } from '@/lib/initial-data';
import { useToast } from './use-toast';

const STORAGE_KEY = 'finview_data';

export function useFinancialData() {
  const { toast } = useToast();
  const [data, setData] = useState<FinancialData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setData(JSON.parse(storedData));
      } else {
        // Load initial data if nothing is in local storage
        setData(initialFinancialData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialFinancialData));
      }
    } catch (error) {
      console.error('Failed to load data from localStorage', error);
      setData(initialFinancialData);
    }
    setLoading(false);
  }, []);

  const saveData = useCallback(
    (newData: FinancialData[]) => {
      try {
        const sortedData = [...newData].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setData(sortedData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedData));
      } catch (error) {
        console.error('Failed to save data to localStorage', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to save data.',
        });
      }
    },
    [toast]
  );

  const addData = (item: Omit<FinancialData, 'id'>) => {
    const newItem = { ...item, id: new Date().toISOString() };
    saveData([...data, newItem]);
    toast({
      title: 'Success',
      description: 'New data entry added.',
    });
  };

  const updateData = (
    id: string,
    updatedItem: Partial<Omit<FinancialData, 'id'>>
  ) => {
    const newData = data.map((item) =>
      item.id === id ? { ...item, ...updatedItem } : item
    );
    saveData(newData);
    toast({
      title: 'Success',
      description: 'Data entry updated.',
    });
  };

  const deleteData = (id: string) => {
    const newData = data.filter((item) => item.id !== id);
    saveData(newData);
    toast({
      variant: 'destructive',
      title: 'Success',
      description: 'Data entry deleted.',
    });
  };

  return { data, loading, addData, updateData, deleteData };
}
