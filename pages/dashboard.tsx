import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

export default function Dashboard() {
  const {user} = useContext(AuthContext);

  return (
    <>
      hello world dashboard

      <p>{user?.email}</p>
    </>
  )
}