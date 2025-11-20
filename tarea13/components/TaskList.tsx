'use client';
import { Task } from '@/types';

interface Props { tasks: Task[]; }

export function TaskList({ tasks }: Props) {
  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <div key={task.id} className="p-2 border rounded">
          <h3 className={task.completed ? 'line-through' : ''}>{task.title}</h3>
          <p>Priority: {task.priority} | Due: {task.dueDate}</p>
        </div>
      ))}
    </div>
  );
}