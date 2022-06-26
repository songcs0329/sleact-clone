import React, { useCallback, useState } from "react"
import InviteChannelModal from "@components/InviteChannelModal"
import { Container, Header } from "./styles"
import useInput from "@hooks/useInput"
import ChatBox from "@components/ChatBox"
import ChatList from "@components/ChatList"
import axios from "axios"

const Channel = () => {
  const [chat, onChangeChat, setChat] = useInput("")
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false)

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault()
      console.log("submit")
      if (chat?.trim()) {
        axios.post("")
      }
      setChat("")
    },
    [chat, setChat],
  )
  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false)
  }, [])
  // const onClickInviteChannel = useCallback(() => {
  //   setShowInviteChannelModal(true)
  // }, [])

  return (
    <Container>
      <Header>channel</Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
    </Container>
  )
}

export default Channel
