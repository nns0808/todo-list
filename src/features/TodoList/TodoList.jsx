import TodoListItem from './TodoListItem';
import styles from "./TodoList.module.css";

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  if (isLoading) {
    return <p>Todo list loading...</p>;
  }

  if (!todoList || todoList.length === 0) {
    return <p>No todos yet!</p>;
  }

  return (
    <>
      {todoList.length === 0 ? (
        <p>Add todo above to get started</p>
      ) : (
        <ul className={styles.todoList}>
          {todoList.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onCompleteTodo={onCompleteTodo}
              onUpdateTodo={onUpdateTodo}
            />
          ))}
        </ul>
      )}
    </>
  );
}

export default TodoList;

