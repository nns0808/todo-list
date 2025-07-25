import './App.css';
import { useState } from 'react';
import TodoList from './TodoList' 
import TodoForm from './TodoForm';


function App() {
  const [todoList, setTodoList] = useState([]);
  function handleAddTodo(title) {
  const newTodo = {
    title: title,
    id: Date.now()
  };
  setTodoList([...todoList, newTodo]);
}
  return (
  <div>
    <h1>My Todo List</h1>
    <TodoForm  onAddTodo={handleAddTodo} />
   
    <TodoList todoList={todoList} />
    
  </div>
);

}

export default App
