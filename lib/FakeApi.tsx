"use client"

import React, { useEffect, useRef, useState } from "react"

type AllUsers = { 
    id: number
    name: string
    username: string
    email: string
}

export default function FakeApi(){
    const [isloading, setisLoading] = useState(false)
    const [users ,setUsers] = useState<AllUsers[]>([])
    const [filtered, setFiltered] = useState<AllUsers[]>([])
    const [error, setError] = useState(null)
    const [search, setSearch] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)

    const searchUsers = () => {
        const results = users.filter(
            (user)=>user.name.includes(search) || 
            user.username.includes(search) ||
            user.email.includes(search)
        )
        setFiltered(results)
    }

    useEffect(()=>{
        inputRef.current?.focus()
    },[])
    
    useEffect(()=>{
        searchUsers()
    },[search,users])

    useEffect(()=>{
        setisLoading(true)

        const FetchData = async() => {
            try {
                const res = await fetch('https://jsonplaceholder.typicode.com/users')
                if(!res.ok) throw new Error("Bad network response")
                const data = await res.json()
                setUsers(data)
                setFiltered(data)
            } catch (e:any) {
                setError(e.message)
            }
            finally{
                setisLoading(false)
            }
        }
        FetchData()
    },[])

    

    return(
        <div>
            <input ref={inputRef} onChange={(e) => setSearch(e.target.value)} value={search} className="border-2 " ></input>
            {isloading && <p>Loading...</p> }
            {!isloading && (
                <ul>
                    {filtered.map((user)=>(
                    <div key={user.id} className="gap-2 flex">
                        <li>name: {user.name}</li>
                        <li> username: {user.username} {user.email}</li>
                    </div>))}
                </ul>
            )}
            
        </div>
    )
}

