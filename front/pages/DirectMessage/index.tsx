import React from "react"
import gravatar from "gravatar"
import { Container, Header } from "./styles"
import useSWR from "swr"
import { IUser } from "@typings/db"
import fetcher from "@utils/fetcher"
import { useParams } from "react-router"
import ChatList from "@components/ChatList"
import ChatBox from "@components/ChatBox"

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace?: string; id?: string }>()
  const { data: myData } = useSWR<IUser>("/api/users", fetcher)
  const { data: userData } = useSWR<IUser>(`/api/workspaces/${workspace}/users/${id}`, fetcher)

  if (!myData || !userData) return null
  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { size: "28px", d: "retro" })} alt={userData?.nickname} />
        <span>{userData?.nickname}</span>
      </Header>
      <ChatList />
      <ChatBox chat="" />
    </Container>
  )
}

export default DirectMessage
