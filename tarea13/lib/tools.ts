/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { prisma } from "./db";
import type { Tool } from "ai";

// ───────────────────────────────────────────────
// Schemas
// ───────────────────────────────────────────────

export const createTaskSchema = z.object({
  title: z.string().min(1),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().optional(),
  category: z.enum(["work", "personal", "shopping", "health", "other"]).optional(),
});

export const updateTaskSchema = z.object({
  taskId: z.string(),
  title: z.string().optional(),
  completed: z.boolean().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().optional(),
  category: z.enum(["work", "personal", "shopping", "health", "other"]).optional(),
});

export const deleteTaskSchema = z.object({
  taskId: z.string(),
  confirm: z.boolean(),
});

export const searchTasksSchema = z.object({
  query: z.string().optional(),
  completed: z.boolean().optional().nullable(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  category: z.enum(["work", "personal", "shopping", "health", "other"]).optional(),
  dueDateFrom: z.string().optional(),
  dueDateTo: z.string().optional(),
  sortBy: z.enum(["createdAt", "dueDate", "priority", "title"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  limit: z.number().optional().default(50),
});

export const getTaskStatsSchema = z.object({
  period: z.enum(["today", "week", "month", "year", "all-time"]).optional().default("all-time"),
});

// ───────────────────────────────────────────────
// Tool implementations
// ───────────────────────────────────────────────

export async function createTask(data: z.infer<typeof createTaskSchema>) {
  if (data.dueDate && new Date(data.dueDate) < new Date()) {
    throw new Error("Due date must be in the future");
  }

  const task = await prisma.task.create({
    data: {
      title: data.title,
      priority: data.priority,
      category: data.category,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    },
  });

  return {
    id: task.id,
    title: task.title,
    createdAt: task.createdAt.toISOString(),
  };
}

export async function updateTask(data: z.infer<typeof updateTaskSchema>) {
  const exists = await prisma.task.findUnique({ where: { id: data.taskId } });
  if (!exists) throw new Error("Task not found");

  const fields = { ...data };
  delete (fields as any).taskId;

  const updated = await prisma.task.update({
    where: { id: data.taskId },
    data: {
      ...fields,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    },
  });

  return {
    id: updated.id,
    title: updated.title,
    completed: updated.completed,
    updatedAt: updated.updatedAt.toISOString(),
  };
}

export async function deleteTask(data: z.infer<typeof deleteTaskSchema>) {
  if (!data.confirm) throw new Error("Confirmation required");

  await prisma.task.update({
    where: { id: data.taskId },
    data: { deletedAt: new Date() },
  });

  return { success: true };
}

export async function searchTasks(data: z.infer<typeof searchTasksSchema>) {
  const where: any = {
    deletedAt: null,
  };

  if (data.query) where.title = { contains: data.query, mode: "insensitive" };
  if (data.completed !== undefined && data.completed !== null) {
    where.completed = data.completed;
  }
  if (data.priority) where.priority = data.priority;
  if (data.category) where.category = data.category;

  if (data.dueDateFrom || data.dueDateTo) {
    where.dueDate = {};
    if (data.dueDateFrom) where.dueDate.gte = new Date(data.dueDateFrom);
    if (data.dueDateTo) where.dueDate.lte = new Date(data.dueDateTo);
  }

  const tasks = await prisma.task.findMany({
    where,
    take: data.limit,
    orderBy: { [data.sortBy]: data.sortOrder },
  });

  return {
    tasks: tasks.map((t: { id: any; title: any; completed: any; priority: any; category: any; dueDate: { toISOString: () => any; }; createdAt: { toISOString: () => any; }; updatedAt: { toISOString: () => any; }; }) => ({
      id: t.id,
      title: t.title,
      completed: t.completed,
      priority: t.priority,
      category: t.category,
      dueDate: t.dueDate?.toISOString(),
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    })),
    total: tasks.length,
  };
}

export async function getTaskStats(data: z.infer<typeof getTaskStatsSchema>) {
  const tasks = await prisma.task.findMany({
    where: { deletedAt: null },
  });
  
  const completed = tasks.filter((t: { completed: any; }) => t.completed).length;

  return {
    total: tasks.length,
    completed,
    pending: tasks.length - completed,
  };
}

// ───────────────────────────────────────────────
// Export Tools para AI SDK
// ───────────────────────────────────────────────

export const tools: Tool[] = [
  {
    name: "createTask",
    description: "Create a task",
    inputSchema: createTaskSchema,
    execute: createTask,
  },
  {
    name: "updateTask",
    description: "Update a task",
    inputSchema: updateTaskSchema,
    execute: updateTask,
  },
  {
    name: "deleteTask",
    description: "Delete a task",
    inputSchema: deleteTaskSchema,
    execute: deleteTask,
  },
  {
    name: "searchTasks",
    description: "Search tasks",
    inputSchema: searchTasksSchema,
    execute: searchTasks,
  },
  {
    name: "getTaskStats",
    description: "Get task statistics",
    inputSchema: getTaskStatsSchema,
    execute: getTaskStats,
  },
];
