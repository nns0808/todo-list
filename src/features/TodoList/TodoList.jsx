import TodoListItem from './TodoListItem';
function TodoList({ todoList, onUpdateTodo }) {
  return (
    <ul>
      {todoList.map((todo) => (
        <TodoListItem key={todo.id}
         todo={todo}
         onUpdateTodo={onUpdateTodo}
          />
      ))}
    </ul>
  );
}

export default TodoList;
