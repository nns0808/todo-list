import { useRef, useState } from "react";
import TextInputWithLabel from "../shared/TextInputWithLabel"; 
import styled from "styled-components";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start; 
  gap: 0.5rem; 
`;

const StyledButton = styled.button`
  padding: 0.3rem 0.6rem;
  font-size: 1rem;
  cursor: pointer;

  &:disabled {
    font-style: italic; 
    cursor: not-allowed;
  }
`;

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
    <StyledForm onSubmit={handleAddTodo}>
      <TextInputWithLabel
        ref={todoTitleInput}
        elementId="todoTitle"
        labelText="Todo"
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodo(e.target.value)}
      />
      <StyledButton type="submit" disabled={!workingTodoTitle.trim()}>
        {isSaving ? "Saving...": "Add Todo"}
      </StyledButton>
    </StyledForm>
  );
}

export default TodoForm;
