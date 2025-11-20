'use client';
import { TaskStats } from '@/types';

interface Props { stats: TaskStats; }

export function StatsDisplay({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-100 rounded">
      <div>Total Tasks: {stats.summary.totalTasks}</div>
      <div>Completed: {stats.summary.completedTasks}</div>
      {/* Más métricas */}
    </div>
  );
}