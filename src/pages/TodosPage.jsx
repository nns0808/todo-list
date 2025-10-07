import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import TodoForm from "../features/TodoForm.jsx";
import TodosViewForm from "../features/TodosViewForm.jsx";
import styles from "./TodosPage.module.css";
import TodoList from "../features/TodoList/TodoList.jsx";

function TodosPage({
  todoList,
  isLoading,
  isSaving,
  errorMessage,
  sortField,
  sortDirection,
  queryString,
  addTodo,
  handleCompleteTodo,
  updateTodo,
  setSortField,
  setSortDirection,
  setQueryString,
  clearError,
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // filter incomplete todos
  const filteredTodoList = todoList.filter((t) => !t.isCompleted);

  const totalPages = Math.max(1, Math.ceil(filteredTodoList.length / itemsPerPage));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const indexOfFirstTodo = (safeCurrentPage - 1) * itemsPerPage;
  const indexOfLastTodo = indexOfFirstTodo + itemsPerPage;

  const currentTodos = filteredTodoList.slice(indexOfFirstTodo, indexOfLastTodo);

  // Add new todo → reset to page 1
  const handleAddTodo = async (newTodo) => {
    try {
      await addTodo(newTodo);
    setSearchParams({ page: "1" });
  } catch (error) {
    console.error("Error while addidng a task:", error);
  }
};

  // validate page param only after we know totalPages
  useEffect(() => {
    if (
      totalPages > 0 &&
      (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages)
    ) {
      setSearchParams({ page: "1" });
    }
  }, [currentPage, totalPages, setSearchParams]);

  // page navigation
  const goToPage = (pageNumber) => {
    const safePage = Math.min(Math.max(pageNumber, 1), totalPages);
    setSearchParams({ page: String(safePage) });
  };

  return (
    <div className={styles.todosPageContainer}>
      <TodoForm onAddTodo={handleAddTodo} isSaving={isSaving} />

      <TodoList
        todoList={currentTodos}
        onCompleteTodo={handleCompleteTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />

      <TodosViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString}
      />

      {/* Pagination */}
      <div className={styles.pagination}>
        <button
          onClick={() => goToPage(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => goToPage(i + 1)}
            className={i + 1 === safeCurrentPage ? styles.activePage : ""}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => goToPage(safeCurrentPage + 1)}
          disabled={safeCurrentPage === totalPages}
        >
          Next
        </button>
      </div>

      {errorMessage && (
        <div className={styles.error}>
          <p>{errorMessage}</p>
          <button onClick={clearError}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default TodosPage;


