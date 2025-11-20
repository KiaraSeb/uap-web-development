/* eslint-disable @typescript-eslint/no-explicit-any */
// types/index.ts
import { UIMessage } from 'ai';

export type Role = "user" | "assistant" | "system";

export interface LegacyMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: string;
}

export type TextPart = { type: 'text'; text: string };
export type DataPart = { type: 'data'; data: Record<string, unknown> };

// Define Tool as the SDK expects (UITool-like)
export interface UITool {
  name: string;
  description: string;
  parameters: any; // Zod schema or object
  execute: (...args: any[]) => Promise<any>;
  input: any;
  output: any;
}

// ToolT: Record of tool name to UITool (index signature for toolCallName)
export type ToolT = Record<string, UITool>;

// ToolCallPart: without 'type', as it's implied by the generic
export type ToolCallPart = {
  toolCallId: string;
  toolCallName: string; // Key into ToolT
  args: Record<string, unknown>;
};

export type CustomMessage = UIMessage<Record<string, unknown>, DataPart | TextPart | ToolCallPart, ToolT> & {
  createdAt?: string; // Fallback para compatibilidad en componentes
};

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string; // Formato ISO para simplicidad (e.g., '2025-11-20T00:00:00.000Z')
  category?: 'work' | 'personal' | 'shopping' | 'health' | 'other';
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskStatsSummary {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number; // Porcentaje (e.g., 75.5)
  overdueTasks: number;
}

export interface TaskStatsByPriority {
  total: number;
  completed: number;
  pending: number;
}

export interface TaskStatsByCategory {
  total: number;
  completed: number;
  pending: number;
}

export interface TaskStatsTimeline {
  tasksCreatedToday: number;
  tasksCompletedToday: number;
  tasksCreatedThisWeek: number;
  tasksCompletedThisWeek: number;
  // Puedes agregar más métricas temporales si lo expandes
}

export interface TaskStatsProductivity {
  averageCompletionTime: string; // e.g., '2.5 hours'
  mostProductiveDay: string; // e.g., 'Monday'
  currentStreak: number; // Días consecutivos
  longestStreak: number; // Racha más larga
}

export interface TaskStatsUpcoming {
  dueTodayCount: number;
  dueThisWeekCount: number;
  nextDueTask?: Task; // Opcional, la próxima tarea con dueDate
}

export interface TaskStats {
  summary: TaskStatsSummary;
  byPriority: {
    high: TaskStatsByPriority;
    medium: TaskStatsByPriority;
    low: TaskStatsByPriority;
  };
  byCategory: {
    work?: TaskStatsByCategory;
    personal?: TaskStatsByCategory;
    shopping?: TaskStatsByCategory;
    health?: TaskStatsByCategory;
    other?: TaskStatsByCategory;
    // Puedes agregar más categorías dinámicamente si es necesario
  };
  timeline: TaskStatsTimeline;
  productivity: TaskStatsProductivity;
  upcoming: TaskStatsUpcoming;
}