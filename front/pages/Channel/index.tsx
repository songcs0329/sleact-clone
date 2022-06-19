import React, { useCallback, useState } from "react"
import InviteChannelModal from "@components/InviteChannelModal"
import { Container, Header } from "./styles"

const Channel = () => {
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false)

  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false)
  }, [])
  const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true)
  }, [])

  return (
    <Container>
      <Header>channel</Header>
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
    </Container>
  )
}

export default Channel
