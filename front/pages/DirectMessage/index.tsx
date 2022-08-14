import React, { useCallback } from "react"
import gravatar from "gravatar"
import { Container, Header } from "./styles"
import useSWR from "swr"
import { IDM, IUser } from "@typings/db"
import fetcher from "@utils/fetcher"
import { useParams } from "react-router"
import ChatList from "@components/ChatList"
import ChatBox from "@components/ChatBox"
import useInput from "@hooks/useInput"
import axios from "axios"

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace?: string; id?: string }>()
  const { data: myData } = useSWR<IUser>("/api/users", fetcher)
  const { data: userData } = useSWR<IUser>(`/api/workspaces/${workspace}/users/${id}`, fetcher)
  const [chat, onChangeChat, setChat] = useInput("")
  const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>(
    `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    fetcher,
  )
  console.log("chatData", chatData)

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault()
      if (chat?.trim()) {
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .then((response) => {
            console.log(response)
            mutateChat()
            setChat("")
          })
          .catch(console.error)
      }
    },
    [workspace, id, chat, setChat, mutateChat],
  )

  if (!myData || !userData) return null
  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { size: "28px", d: "retro" })} alt={userData?.nickname} />
        <span>{userData?.nickname}</span>
      </Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  )
}

export default DirectMessage
