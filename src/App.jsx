import './App.css';
import { useState } from 'react';
import TodoList from './features/TodoList/TodoList'; 
import TodoForm from './features/TodoForm'; 

function App() {
  const [todoList, setTodoList] = useState([]);

  function handleAddTodo(title) {
    const newTodo = {
      title,
      id: Date.now(),
      isCompleted: false,
    };
    setTodoList([...todoList, newTodo]);
  }

  function handleCompleteTodo(id) {
    const updatedTodos = todoList.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: true } : todo
    );
    setTodoList(updatedTodos);
  }
  function handleUpdateTodo(editedTodo) {
    const updatedTodos = todoList.map((todo) =>
      todo.id === editedTodo.id ? { ...editedTodo } : todo
    );
    setTodoList(updatedTodos);
  }
  return (
    <div>
      <h1>My Todo List</h1>
      <TodoForm onAddTodo={handleAddTodo} />
      <TodoList
         todoList={todoList}
         onCompleteTodo={handleCompleteTodo} 
         onUpdateTodo={handleUpdateTodo}
          
         />
    </div>
  );
}

export default App;
