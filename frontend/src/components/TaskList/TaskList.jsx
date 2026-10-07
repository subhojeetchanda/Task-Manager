import React from 'react';
import styles from './TaskList.module.css';
import TaskCard from '../TaskCard/TaskCard';

export default function TaskList({ tasks, onDeleteTask }) {
  return (
    <div className={styles.grid}>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
      ))}
    </div>
  );
}
