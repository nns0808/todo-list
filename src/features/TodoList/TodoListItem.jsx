import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title); 

  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }
  function handleCancel() {
    setWorkingTitle(todo.title); 
    setIsEditing(false);         
  }
  function handleUpdate(event) {
    if (!isEditing) return;
    event.preventDefault();

    onUpdateTodo({
      ...todo,
      title: workingTitle,
    });

    setIsEditing(false);
  }
  return (
    <li>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              elementId={`edit-${todo.id}`}
              labelText="Edit Todo"
              value={workingTitle}
              onChange={handleEdit}
              inputRef={null} 
            />
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="button" onClick={handleUpdate}>
              Update
            </button>
          </>
        ) : (
          <>
            <label>
              <input
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
              />
            </label>
            <span onClick={() => setIsEditing(true)}>{todo.title}</span>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
