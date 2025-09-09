
type IUsers = {
    id: number
    name: string
    username: string
    email: string
}


async function GetData(){
    const response = await fetch("https://jsonplaceholder.typicode.com/users")
    if(!response.ok) throw new Error("Bad response")
    return response.json()
}

export default async function UsersPage(){
    const data = await GetData()

    return(
        <div>
            <ul>
            {data.map((u:IUsers)=>(
                <li key={u.id}>{u.name}{u.id}</li>
            ))}
        </ul>
        </div>
    )
}

