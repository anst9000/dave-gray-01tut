import { FaTrashAlt } from 'react-icons/fa'

const LineItem = ({ item, handleCheck, handleDelete }) => {
  return (
    <li className="item">
      <input
        type="checkbox"
        onChange={() => handleCheck(item.id)}
        checked={item.done}
      />
      <label
        style={ item.done ? { textDecoration: 'line-through' } : null }
        onDoubleClick={() => handleCheck(item.id)}
      >{item.task}</label>
      <FaTrashAlt
        onClick={() => handleDelete(item.id)}
        role="button"
        tabIndex="0"
        aria-label={`Delete ${item.task}`}
      />
    </li>
  )
}

export default LineItem
