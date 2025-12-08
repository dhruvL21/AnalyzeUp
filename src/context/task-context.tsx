
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

type TaskStatus = 'idle' | 'running' | 'success' | 'error';

interface Task {
  id: string;
  status: TaskStatus;
  result?: any;
  error?: string;
}

interface TaskContextProps {
  tasks: Record<string, Task>;
  runTask: <T>(taskId: string, taskFn: () => Promise<T>, toastMessage?: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Record<string, Task>>({});
  const { toast } = useToast();

  const setTask = (task: Task) => {
    setTasks(prevTasks => ({ ...prevTasks, [task.id]: task }));
  };

  const runTask = useCallback(async <T,>(taskId: string, taskFn: () => Promise<T>, toastMessage?: string) => {
    setTask({ id: taskId, status: 'running' });
    let toastId: string | undefined;
    if (toastMessage) {
        const { id } = toast({ title: 'Processing...', description: toastMessage });
        toastId = id;
    }

    try {
      const result = await taskFn();
      setTask({ id: taskId, status: 'success', result });
       toast({ id: toastId, title: 'Success!', description: 'Your request has been completed.' });
    } catch (error: any) {
      console.error(`Task ${taskId} failed:`, error);
      const errorMessage = error.message || 'An unknown error occurred.';
      setTask({ id: taskId, status: 'error', error: errorMessage });
      toast({
        id: toastId,
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: errorMessage,
      });
    }
  }, [toast]);

  const value = {
    tasks,
    runTask,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

    