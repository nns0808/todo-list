import './App.css';
import { useState } from 'react';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';

function App() {
  const [todoList, setTodoList] = useState([]);

  function handleAddTodo(title) {
    const newTodo = {
      title: title,
      id: Date.now(),
      isCompleted: false,
    };
    setTodoList([...todoList, newTodo]);
  }

  function updateTodo(editedTodo) {
    const updatedTodos = todoList.map((todo) =>
      todo.id === editedTodo.id ? { ...editedTodo } : todo
    );
    setTodoList(updatedTodos);
  }

  const newTodo = {
    title: title,
    id: Date.now(),
    isCompleted: false 
  };
  setTodoList([...todoList, newTodo]);
}
   function completeTodo(id) {
      const updatedTodos = todoList.map((todo) => {
    if (todo.id === id) {
      return { ...todo, isCompleted: true };
    }
    return todo;
  });
   setTodoList(updatedTodos);
  }
  
  return (
    <div>
      <h1>My Todo List</h1>
      <TodoForm onAddTodo={handleAddTodo} />

      <TodoList todoList={todoList} onUpdateTodo={updateTodo}/>
    </div>
  );
}

export default App;
