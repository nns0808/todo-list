function TodoList() {
  const todos = [
    { id: 1, title: 'go to the gym' },
    { id: 2, title: 'take notes' },
    { id: 3, title: 'study react' },
  ];
  return (
    <ul>{todos.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}</ul>
  );
}

export default TodoList;
