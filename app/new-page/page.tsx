"use client"

import { useUserContext } from '@/context/UserContext'
import React, { useCallback, useEffect, useMemo } from 'react'
import {useState} from 'react'
import Search from '@/components/Demo'

type INum = {
  num: number;
  setNum: (num:number) => void;
}

const AllUsers = [
  'John',
  'wick',
  'Michael',
  'Alex',
  'Matt'
]

function square1num(num:number){
  return Math.pow(num,2)
}

/*const LargeItems = new Array(29_999_999).fill(0).map((_,i) => {
  return{
    id: i,
    isSelected : i === 29_999_998,
  }
})*/

const users = Array.from({ length: 5 }, (_, i) => `User ${i + 1}`);

const page = () => {
  const [search,setSearch] = useState("")
  const [count,setCount] = useState(0)
  const {setName} = useUserContext()
  const [num,setNum] = useState(0)
  const [Users, setUsers] = useState(AllUsers)
  const num2 = square1num(num)
  /*const [LargeItems1] = useState(LargeItems)

  const findSelected = LargeItems1.find((i) => i.isSelected)
  const MemoSelected = useMemo(() => {
   return LargeItems1.find((i) => i.isSelected)
  },[LargeItems1])
  const filtered = users.filter((u) =>
    u.toLowerCase().includes(search.toLowerCase())
  );*/

  function HandleChange (text:string) {
    console.log(Users[0]);

    const FilterUsers = AllUsers.filter((user) => (
      user.includes(text)
    ))
    setUsers(FilterUsers)
  }

  //only renders search when search key changes
  const CallBackChange = useCallback((HandleChange),[Users])

  const filtered1 = useMemo(() => {
    return users.filter((u) =>
      u.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);
  
  const squareNum = useMemo(() => {
    return Math.pow(num,2)
  }, [num]);

  useEffect(()=>{
    console.log("You Have Clicked the button times",count)
   
    if(count === 5) alert("You have reached 5 numbers")

    return(()=>{
      console.log("Cleanup Function")
    })
  },[count])

  return (
    <div className='flex flex-col'>
        <input type="number" className='border-2' placeholder='enter number...' value={num} 
        onChange={(e) => {setNum(Number(e.target.value))}}></input>
        <p>{squareNum}</p>
        
        <p>Count:{count}</p>
        <button onClick={() => setCount(count + 1)}
        className='border-2 mr-4'>
            click me!
        </button>
        <select onChange={(e) => setName(e.target.value)}>
          <option value="" disabled>Select Name</option>
          <option value="John Doe">John Doe</option>
          <option value="Michael S">Michael S</option>
          <option value="Aman Sharma">Aman Sharma</option>
        </select>
        <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border-2 p-2"
        placeholder="Search user..."
        />
        <p>Results: {filtered1.length}</p>
        {/*<p>Selected Items : {MemoSelected?.id}</p>*/}
        <button onClick={() => setUsers(AllUsers)} className='border bg-amber-300'>Set Users</button>
        <Search onChange={CallBackChange}/>
        <ul>
          {Users.map((user) => (
            <li key={user}>{user}</li>
          )
          )}
        </ul>
    </div>
  )
}

export default page