import { useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import { api } from "../services/api";

export default function Dashboard() {
  const {user} = useContext(AuthContext);

  useEffect(() => {
    api
      .get('/me')
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <>
      hello world dashboard

      <p>{user?.email}</p>
    </>
  )
}