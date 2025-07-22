import './App.css';
import { useState } from 'react';
import TodoList from './TodoList' 
import TodoForm from './TodoForm';


function App() {
  const [newTodo, setNewTodo] = useState('My first todo');
  return (
  <div>
    <h1>My Todo List</h1>
    <TodoForm />
    {/* Display the current value of newTodo */}
    <p>{newTodo}</p>
    <TodoList />
    
  </div>
);

}

export default App
