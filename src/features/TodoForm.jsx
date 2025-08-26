import { useRef, useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel"; 

function TodoForm({ onAddTodo, isSaving }) {
  const todoTitleInput = useRef(null);
  const [workingTodoTitle, setWorkingTodo] = useState("");

  function handleAddTodo(event) {
    event.preventDefault();

    if (!workingTodoTitle.trim()) {
      todoTitleInput.current?.focus();
      return;
    }

    onAddTodo({
      title: workingTodoTitle,
      isCompleted: false,
    }); 
    setWorkingTodo(""); 
    todoTitleInput.current?.focus(); 
  }

  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        ref={todoTitleInput}
        elementId="todoTitle"
        labelText="Todo"
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodo(e.target.value)}
      />
      <button type="submit" disabled={!workingTodoTitle.trim()}>
        {isSaving ? "Saving...": "Add Todo"}
      </button>
    </form>
  );
}

export default TodoForm;
