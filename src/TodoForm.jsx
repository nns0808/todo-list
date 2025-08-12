import { useRef, useState } from "react";
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
      <label htmlFor="todoTitle">Todo</label>
      <input 
        type="text"
        id="todoTitle"
        name="title"
        ref={todoTitleInput}
        value={workingTodoTitle}                      
        onChange={(e) => setWorkingTodo(e.target.value)}  
      />
      <button type="submit" disabled={workingTodoTitle.trim() === ""}>Add Todo</button>
    </form>
  );
}

export default TodoForm;

