import { useState, useEffect } from "react";

function TodosViewForm({ 
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString
 }) {
  const [localQueryString, setLocalQueryString] = useState(queryString);
  
  useEffect(() => {
    const debounce = setTimeout(() => {
      console.log("Debounced query:", localQueryString);
      setQueryString(localQueryString);
    }, 500);

    return () => clearTimeout(debounce);
  }, [localQueryString, setQueryString]);

  useEffect(() => {
  setLocalQueryString(queryString);
}, [queryString]);

  
  function preventRefresh(e) {
    e.preventDefault();
  }  
  function handleSortFieldChange(e) {
    setSortField(e.target.value);
  }

  function handleSortDirectionChange(e) {
    setSortDirection(e.target.value);
  }

  return (
    <form onSubmit={preventRefresh}>
      <div>
        
    
            <label htmlFor="search">Search todos: </label>
            <input
            id="search"
            type="text"
            value={localQueryString}
            onChange={(e) => setLocalQueryString(e.target.value)}
            placeholder="Type to filter..."
            />
            <button type="button" onClick={() => setLocalQueryString("")}>
            Clear
            </button>
       </div>
       <div>
            <label htmlFor="sortField">Sort by </label>
            <select id="sortField" value={sortField} onChange={handleSortFieldChange}>
            <option value="title">Title</option>
            <option value="createdTime">Time added</option>
            </select>

        
            <label htmlFor="sortDirection">Direction </label>
            <select id="sortDirection" value={sortDirection} onChange={handleSortDirectionChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
            </select>
      </div>
    </form>
  );
}

export default TodosViewForm;
