import './App.css';
import { useEffect, useCallback, useReducer, useState } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom'; 
import TodosPage from './pages/TodosPage';
import Header from './shared/Header';
import About from './pages/About';
import NotFound from './pages/NotFound';


import {
  todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  const { todoList, isLoading, isSaving, errorMessage, sortField, sortDirection, queryString } = todoState;

  const [title, setTitle] = useState("Todo List");
  const location = useLocation();

  const token = `Bearer ${import.meta.env.VITE_PAT}`;
  const baseUrl = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const tableUrl = baseUrl;

  // Update header title based on route
  useEffect(() => {
    if (location.pathname === "/") {
      setTitle("Todo List");
    } else if (location.pathname === "/about") {
      setTitle("About");
    } else {
      setTitle("Not Found");
    }
  }, [location]);

  // Encode URL
  const encodeUrl = useCallback(() => {
    const sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    const searchQuery = queryString
      ? `&filterByFormula=SEARCH("${encodeURIComponent(queryString)}", {title})`
      : "";
    return `${baseUrl}?${sortQuery}${searchQuery}`;
  }, [sortField, sortDirection, queryString]);

  // Fetch todos
  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });
      try {
        const response = await fetch(encodeUrl(), {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        const data = await response.json();

        dispatch({ type: todoActions.loadTodos, records: data.records });
      } catch (error) {
        dispatch({ type: todoActions.setLoadError, error });
      }
    };

    fetchTodos();
  }, [encodeUrl, token]);

  // Add Todo
  const addTodo = async (newTodo) => {
    dispatch({ type: todoActions.startRequest });
    dispatch({ type: todoActions.clearError });
    try {
      const payload = {
        records: [
          {
            fields: {
              title: String(newTodo.title),
              isCompleted: !!newTodo.isCompleted,
            },
          },
        ],
      };

      const options = {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };

      const response = await fetch(tableUrl, options);
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      const data = await response.json();
      dispatch({ type: todoActions.addTodo, record: data.records[0] });
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, error });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  // Complete Todo
  const handleCompleteTodo = async (id) => {
    const originalTodo = todoList.find(todo => todo.id === id);
    if (!originalTodo) return;

    dispatch({ type: todoActions.completeTodo, id });
    dispatch({ type: todoActions.clearError });

    const payload = {
      records: [
        { id, fields: { title: originalTodo.title, isCompleted: true } },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(tableUrl, options);
      if (!resp.ok) throw new Error(`Error ${resp.status}: ${resp.statusText}`);
    } catch (error) {
      dispatch({ type: todoActions.revertTodo, editedTodo: originalTodo, error });
    }
  };

  // Update Todo
  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find(todo => todo.id === editedTodo.id);

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: String(editedTodo.title),
            isCompleted: !!editedTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(tableUrl, options);
      if (!resp.ok) throw new Error(`Error ${resp.status}: ${resp.statusText}`);

      dispatch({ type: todoActions.updateTodo, editedTodo });
    } catch (error) {
      dispatch({ type: todoActions.revertTodo, editedTodo: originalTodo, error });
    }
  };

  return (
    <>
      <Header title={title} />
      <Routes>
        <Route
          path="/"
          element={
            <TodosPage
              todoList={todoList}
              isLoading={isLoading}
              isSaving={isSaving}
              errorMessage={errorMessage}
              sortField={sortField}
              sortDirection={sortDirection}
              queryString={queryString}
              addTodo={addTodo}
              handleCompleteTodo={handleCompleteTodo}
              updateTodo={updateTodo}
              setSortField={(field) => dispatch({ type: todoActions.setSortField, payload: field })}
              setSortDirection={(dir) => dispatch({ type: todoActions.setSortDirection, payload: dir })}
              setQueryString={(q) => dispatch({ type: todoActions.setQueryString, payload: q })}
              clearError={() => dispatch({ type: todoActions.clearError })}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;

