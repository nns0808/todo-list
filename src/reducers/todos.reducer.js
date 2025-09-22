const initialState = {
  todoList: [],
  sortField: "title",
  sortDirection: "asc",
  queryString: "",
  isSaving: false,
  isLoading: false,
  errorMessage: null,
};

export { initialState };

// Actions
export const actions = {
  addTodo: "addTodo",
  removeTodo: "removeTodo",
  toggleTodo: "toggleTodo",

  saveTodoStart: "saveTodoStart",
  saveTodoSuccess: "saveTodoSuccess",
  saveTodoError: "saveTodoError",

  fetchTodos: "fetchTodos",
  loadTodos: "loadTodos",
  setLoadError: "setLoadError",

  startRequest: "startRequest",
  endRequest: "endRequest",

  updateTodo: "updateTodo",
  completeTodo: "completeTodo",
  revertTodo: "revertTodo",

  clearError: "clearError",

  setSortField: "setSortField",
  setSortDirection: "setSortDirection",
  setQueryString: "setQueryString",
};

// Reducer
export function todosReducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return {
        ...state,
        isLoading: true,
        errorMessage: null,
      };

    case actions.loadTodos:
      return {
        ...state,
        isLoading: false,
        todoList: action.records.map((record) => ({
          id: record.id,
          title: record.fields.title,
          isCompleted: record.fields.isCompleted || false, 
        })),
        errorMessage: null,
      };

    case actions.setLoadError:
      return {
        ...state,
        isLoading: false,
        isSaving: false,
        errorMessage: action.error.message,
      };

    case actions.startRequest:
      return {
        ...state,
        isSaving: true,
      };

    case actions.addTodo: {
      const savedTodo = {
        id: action.record.id,
        title: action.record.fields.title,
        isCompleted: action.record.fields.isCompleted || false, 
      };

      return {
        ...state,
        todoList: [...state.todoList, savedTodo],
        isSaving: false,
      };
    }

    case actions.endRequest:
      return {
        ...state,
        isLoading: false,
        isSaving: false,
      };

    case actions.removeTodo:
      return {
        ...state,
        todoList: state.todoList.filter((todo) => todo.id !== action.payload),
      };

    case actions.toggleTodo:
      return {
        ...state,
        todoList: state.todoList.map((todo) =>
          todo.id === action.payload
            ? { ...todo, isCompleted: !todo.isCompleted }
            : todo
        ),
      };

    case actions.revertTodo:
    case actions.updateTodo: {
      const updatedTodos = state.todoList.map((todo) =>
        todo.id === action.editedTodo.id ? { ...action.editedTodo } : todo
      );

      const updatedState = {
        ...state,
        todoList: updatedTodos,
        isSaving: false, 
      };

      if (action.error) {
        updatedState.errorMessage = action.error.message;
      }

      return updatedState;
    }

    case actions.completeTodo: {
      const updatedTodos = state.todoList.map((todo) =>
        todo.id === action.id ? { ...todo, isCompleted: true } : todo
      );

      return {
        ...state,
        todoList: updatedTodos,
        isSaving: false,
      };
    }

    case actions.clearError:
      return {
        ...state,
        errorMessage: null,
      };

    case actions.saveTodoStart:
      return {
        ...state,
        isSaving: true,
      };

    case actions.saveTodoSuccess:
    case actions.saveTodoError:
      return {
        ...state,
        isSaving: false,
      };

    case actions.setSortField:
      return {
        ...state,
        sortField: action.payload,
      };

    case actions.setSortDirection:
      return {
        ...state,
        sortDirection: action.payload,
      };

    case actions.setQueryString:
      return {
        ...state,
        queryString: action.payload,
      };

    default:
      return state;
  }
}


