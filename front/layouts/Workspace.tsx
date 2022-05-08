import React, { FC, useCallback } from "react"
import axios from "axios"
import useSWR from "swr"
import fetcher from "@utils/fetcher"
import { Redirect } from "react-router-dom"

const Workspace: FC = ({ children }) => {
  const { data, error, mutate } = useSWR("http://localhost:3095/api/users", fetcher)

  const onLogout = useCallback(() => {
    axios
      .post("http://localhost:3095/api/users/logout", null, {
        withCredentials: true,
      })
      .then(() => {
        mutate(false, false)
      })
  }, [])

  if (!data) return <Redirect to={"/login"} />
  return (
    <div>
      <h3>logout</h3>
      <button onClick={onLogout}>logOut</button>
      {children}
    </div>
  )
}

export default Workspace
