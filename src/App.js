import './App.css'
import * as XLSX from 'xlsx'
import { useState } from 'react'
import { FaSortDown, FaSortUp } from 'react-icons/fa'

function App() {
  const [items, setItems] = useState([])
  const [pincode, setPincode] = useState('')
  const [date, setDate] = useState('')
  const [order, setOrder] = useState('A')

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsArrayBuffer(file)
      fileReader.onload = (e) => {
        const bufferArray = e.target.result
        const wb = XLSX.read(bufferArray, { type: 'buffer' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data = XLSX.utils.sheet_to_json(ws)
        resolve(data)
      }
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
    promise.then((data) => {
      setItems(data)
    })
  }

  const sorting = (col) => {
    if (order === 'A') {
      const sorted = [...items].sort((a, b) => (a[col] > b[col] ? 1 : -1))
      setItems(sorted)
      setOrder('D')
    } else if (order === 'D') {
      const sorted = [...items].sort((a, b) => (a[col] < b[col] ? 1 : -1))
      setItems(sorted)
      setOrder('A')
    }
  }

  return (
    <div className='App'>
      <div className='selfil'>
        <h4>Select an Excel file</h4>
        <input
          className='selfil-input'
          type='file'
          onChange={(e) => {
            const file = e.target.files[0]
            readExcel(file)
          }}
        />
      </div>
      <div className='App-Header'>
        <div className='header-input'>
          <label>Pin Code: </label>
          <input value={pincode} onChange={(e) => setPincode(e.target.value.trim())} />
        </div>
        <div className='header-input'>
          <label>Date: </label>
          <input value={date} onChange={(e) => setDate(e.target.value.trim())} />
        </div>
      </div>
      <table>
        <thead className='table-tr'>
          <th className='table-th'>orderId</th>
          <th className='table-th'>customerId</th>
          <th className='table-th' onClick={() => sorting('deliveryPincode')}>
            deliveryPincode
            {order === 'D' ? (
              <FaSortUp className='sort-icon' />
            ) : (
              <FaSortDown className='sort-icon' />
            )}
          </th>
          <th className='table-th'>orderDate</th>
          <th className='table-th'>items</th>
        </thead>
        {items
          .filter((items) => {
            if (date && pincode) {
              return (
                items.orderDate === date && items.deliveryPincode === +pincode
              )
            } else if (date || pincode) {
              return (
                items.orderDate === date || items.deliveryPincode === +pincode
              )
            } else {
              return items
            }
          })
          .map((item) => (
            <tr className='table-tr'>
              <td className='table-td'>{item.orderId}</td>
              <td className='table-td'>{item.customerId}</td>
              <td className='table-td'>{item.deliveryPincode}</td>
              <td className='table-td'>{item.orderDate}</td>
              <td className='table-td'>
                {item.items.split(';').map((ite) => (
                  <>
                    {ite.replace(':', '-')}
                    <br />
                  </>
                ))}
              </td>
              <hr />
            </tr>
          ))}
      </table>
    </div>
  )
}

export default App
