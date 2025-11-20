/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { prisma } from '../../../lib/db';
import { generateObject } from 'ai'; // De @ai-sdk/openai

// Tool 1: createTask
export const createTaskSchema = z.object({
  title: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().optional(), // ISO string, validar futura en ejecución
  category: z.enum(['work', 'personal', 'shopping', 'health', 'other']).optional(),
});

export async function createTask({ title, priority, dueDate, category }: z.infer<typeof createTaskSchema>) {
  // Validar dueDate futura
  if (dueDate && new Date(dueDate) < new Date()) throw new Error('Due date must be in the future');
  const task = await prisma.task.create({
    data: { title, priority, dueDate: dueDate ? new Date(dueDate) : undefined, category },
  });
  return { id: task.id, title: task.title, createdAt: task.createdAt };
}

// Tool 2: updateTask
export const updateTaskSchema = z.object({
  taskId: z.string(),
  title: z.string().optional(),
  completed: z.boolean().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().optional(),
  category: z.enum(['work', 'personal', 'shopping', 'health', 'other']).optional(),
});

export async function updateTask({ taskId, ...updates }: z.infer<typeof updateTaskSchema>) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error('Task not found');
  if (Object.keys(updates).length === 0) throw new Error('At least one field must be updated');
  // Validaciones similares...
  const updated = await prisma.task.update({ where: { id: taskId }, data: updates });
  return { id: updated.id, ...updated };
}

// Tool 3: deleteTask (soft delete)
export const deleteTaskSchema = z.object({
  taskId: z.string(),
  confirm: z.boolean().optional(), // Para masivas
});

export async function deleteTask({ taskId, confirm }: z.infer<typeof deleteTaskSchema>) {
  if (!confirm) throw new Error('Confirmation required for delete');
  await prisma.task.update({ where: { id: taskId }, data: { deletedAt: new Date() } });
  return { success: true, message: 'Task deleted' };
}

// Tool 4: searchTasks
export const searchTasksSchema = z.object({
  query: z.string().optional(),
  completed: z.boolean().optional().nullable(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  category: z.enum(['work', 'personal', 'shopping', 'health', 'other']).optional(),
  dueDateFrom: z.string().optional(),
  dueDateTo: z.string().optional(),
  sortBy: z.enum(['createdAt', 'dueDate', 'priority', 'title']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  limit: z.number().optional().default(50),
});

export async function searchTasks(filters: z.infer<typeof searchTasksSchema>) {
  const where = { deletedAt: null, ...filters }; // Agregar filtros lógicos
  const tasks = await prisma.task.findMany({
    where,
    orderBy: { [filters.sortBy]: filters.sortOrder },
    take: filters.limit,
  });
  return { tasks, total: tasks.length };
}

// Tool 5: getTaskStats
export const getTaskStatsSchema = z.object({
  period: z.enum(['today', 'week', 'month', 'year', 'all-time']).optional().default('all-time'),
  groupBy: z.enum(['category', 'priority', 'date']).optional(),
});

export async function getTaskStats({ period }: z.infer<typeof getTaskStatsSchema>) {
  // Lógica de filtros por período (usa Date para calcular)
  const where = { deletedAt: null }; // Ej: para 'week', agregar dueDate > startOfWeek
  const tasks = await prisma.task.findMany({ where });
  // Calcular summary, byPriority, byCategory, etc. (implementa agregaciones con reduce o queries)
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: { completed: any; }) => t.completed).length;
  // ... resto de cálculos (completionRate = (completedTasks / totalTasks) * 100, overdue, etc.)
  return {
    summary: { totalTasks, completedTasks, pendingTasks: totalTasks - completedTasks, completionRate: 0, overdueTasks: 0 },
    byPriority: { high: { total: 0, completed: 0, pending: 0 }, /* ... */ },
    // ... completa según la spec
  };
}

// Exporta todas las tools para usar en chat/route.ts
export const tools = {
  createTask: { schema: createTaskSchema, execute: createTask },
  updateTask: { schema: updateTaskSchema, execute: updateTask },
  deleteTask: { schema: deleteTaskSchema, execute: deleteTask },
  searchTasks: { schema: searchTasksSchema, execute: searchTasks },
  getTaskStats: { schema: getTaskStatsSchema, execute: getTaskStats },
};