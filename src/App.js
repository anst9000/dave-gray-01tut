import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import { useEffect, useState } from 'react';
import AddItem from './AddItem';
import SearchItem from './SearchItem';
import apiRequest from './apiRequest'

function App() {
  const API_URL = 'http://localhost:3500/items'

  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState('')
  const [search, setSearch] = useState('')
  const [fetchError, setFetchError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL)
        if (!response.ok) throw Error('Did not receive expected data')

        const listItems = await response.json()
        setItems(listItems)
        setFetchError(null)
      } catch (err) {
        setFetchError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    setTimeout(() => {
      fetchItems()
    }, 2000);
  }, [])

  const addItem = async (item) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1
    const theNewItem = {
      id,
      done: false,
      task: item
    }

    const newItems = [...items, theNewItem]
    setItems(newItems)

    const postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(theNewItem)
    }
    const result = await apiRequest(API_URL, postOptions)
    if (result) setFetchError(result)
  }

  const handleCheck = async (id) => {
    const newItems = items.map((item) => item.id === id ? { ...item, done: !item.done } : item)
    setItems(newItems)

    const updateItem = newItems.filter(item => item.id === id)
    const updateOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ done: updateItem[0].done })
    }
    const reqUrl = `${API_URL}/${id}`
    const result = await apiRequest(reqUrl, updateOptions)
    if (result) setFetchError(result)
  }

  const handleDelete = async (id) => {
    const newItems = items.filter((item) => item.id !== id)
    setItems(newItems)

    const deleteOptions = {
      method: 'DELETE'
    }
    const reqUrl = `${API_URL}/${id}`
    const result = await apiRequest(reqUrl, deleteOptions)
    if (result) setFetchError(result)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return

    // Create new item
    addItem(newItem)
    setNewItem('')
  }


  return (
    <div className="App">
      <Header title="Grocery List" />
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem
        search={search}
        setSearch={setSearch}
      />
      <main>
        { isLoading && <p>Loading Items...</p> }
        { fetchError && <p style={{ color: 'red' }}>{`Error: ${fetchError}`}</p> }
        { !fetchError && !isLoading && <Content
          items={items.filter(item => ((item.task).toLowerCase()).includes(search.toLowerCase()))}
          handleCheck={handleCheck}
          handleDelete={handleDelete}
        /> }
      </main>
      <Footer
      length={items.length}
      />
    </div>
  );
}

export default App;
