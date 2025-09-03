import './App.css';
import { useState, useEffect } from 'react';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import TodosViewForm from "./features/TodosViewForm";


function encodeUrl({ sortField, sortDirection, queryString }) {
  const baseUrl = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
  let searchQuery = "";
  if (queryString) {
    searchQuery = `&filterByFormula=SEARCH("${queryString}", title)`;
  }
  return encodeURI(`${baseUrl}?${sortQuery}${searchQuery}`);
}

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [sortField, setSortField] = useState("createdTime");   
  const [sortDirection, setSortDirection] = useState("desc");

  const [queryString, setQueryString] = useState("");

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  // Fetch todos fron Airtable
  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(
          encodeUrl({ sortField, sortDirection, queryString }),
          {
        
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        const fetchedTodos = data.records.map((record) => {
          const todo = {
            id: record.id,
            ...record.fields,
          };
          if (!todo.isCompleted) todo.isCompleted = false;
          return todo;
        });

        setTodoList(fetchedTodos);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, [sortField, sortDirection, queryString]);

// add Todo
  const addTodo = async (newTodo) => {
  setIsSaving(true);
  try {
    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,          
            isCompleted: newTodo.isCompleted,    
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

    const response = await fetch(encodeUrl({ sortField, sortDirection, queryString }), options);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    const createdTodo = {
        id: data.records[0].id,
        title: data.records[0].fields.title,
        isCompleted: data.records[0].fields.isCompleted || false,
      };

    setTodoList((prev) => [...prev, createdTodo]);
  } catch (error) {
    setErrorMessage(error.message);
  } finally {
    setIsSaving(false);
  }
};

// complete Todo

  const handleCompleteTodo = async (id) => {
    setIsSaving(true);
    const originalTodo = todoList.find((todo) => todo.id === id);
    if (!originalTodo) return;

    const updatedTodo = { ...originalTodo, isCompleted: true };

    setTodoList((prev) =>
      prev.map((todo) => (todo.id === id ? updatedTodo : todo))
    );

    const payload = {
      records: [
        {
          id: id,
          fields: {
            title: updatedTodo.title,
            isCompleted: true,
          },
        },
      ],
    };

    const options = {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(encodeUrl({ sortField, sortDirection, queryString }), options);

      if (!resp.ok) {
        throw new Error(`Error ${resp.status}: ${resp.statusText}`);
      }

      
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

      setTodoList((prev) =>
        prev.map((todo) => (todo.id === id ? originalTodo : todo))
      );
    } finally {
      setIsSaving(false);
    }
  }

  // updateTodo
  async function updateTodo(editedTodo) {
    setIsSaving(true);
    
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(encodeUrl({sortField, sortDirection, queryString}), options);

      if (!resp.ok) {
        throw new Error(`Error ${resp.status}: ${resp.statusText}`);
      }

      const data = await resp.json();

      const updatedTodo = {
        id: data.records[0].id,
        ...data.records[0].fields,
      };

      const updatedTodos = todoList.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      );
      setTodoList(updatedTodos);
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);

      const revertedTodos = todoList.map((todo) =>
        todo.id === originalTodo.id ? originalTodo : todo
      );
      setTodoList(revertedTodos);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <h1>My Todo List</h1>

      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={handleCompleteTodo}
        onUpdateTodo={updateTodo}  
        isLoading={isLoading}
        
      />

      <hr />

      
      <TodosViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}         
        setQueryString={setQueryString}
      />


      {errorMessage && (
        <div>
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;
