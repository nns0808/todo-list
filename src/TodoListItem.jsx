function TodoListItem({ todo, onCompleteTodo }) {
    return (
  <li>
    <form onSubmit={(e) => e.preventDefault()}> 
        <input
            type="checkbox"
            checked={todo.isCompleted}
            onChange={() => onCompleteTodo(todo.id)} 
            />
    {todo.title}
    </form>
    </li>
  );
}

export default TodoListItem;
