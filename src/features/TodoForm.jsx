import { useRef, useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel"; 

function TodoForm({ onAddTodo }) {
  const todoTitleInput = useRef(null);
  const [workingTodoTitle, setWorkingTodo] = useState("");

  function handleAddTodo(event) {
    event.preventDefault();      
    
    if (!workingTodoTitle.trim()) {
      todoTitleInput.current?.focus();
      return;
    }
    onAddTodo(workingTodoTitle); 
    setWorkingTodo("");
       
    todoTitleInput.current?.focus();
  } 
  
    return (
    <form onSubmit={handleAddTodo}>
       <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        inputRef={todoTitleInput}
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodo(e.target.value)}
      />
      
      <button type="submit" disabled={!workingTodoTitle}>Add Todo</button>
    </form>
  );
}

export default TodoForm;

