import React, { useCallback, VFC } from "react"
import useInput from "@hooks/useInput"
import Modal from "@components/Modal"
import { Button, Input, Label } from "@pages/SignUp/styles"
import axios from "axios"
import { useParams } from "react-router"
import { toast } from "react-toastify"
import useSWR from "swr"
import { IChannel, IUser } from "@typings/db"
import fetcher from "@utils/fetcher"

interface Props {
  show: boolean
  onCloseModal: () => void
  setShowInviteChannelModal: (flag: boolean) => void
}

const InviteChannelModal: VFC<Props> = ({ show, onCloseModal, setShowInviteChannelModal }) => {
  const { workspace, channel } = useParams<{ workspace?: string; channel?: string }>()
  const [newMember, onChangeNewMember, setNewMember] = useInput("")
  const { data: userData } = useSWR<IUser | false>("/api/users", fetcher, {
    dedupingInterval: 2000,
  })
  const { mutate: revalidateChannelMembers } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  )

  const onCreateChannel = useCallback(
    (e) => {
      e.preventDefault()
      if (!newMember || !newMember.trim()) return
      axios
        .post(
          `/api/workspaces/${workspace}/channels/${channel}/members`,
          { email: newMember },
          { withCredentials: true },
        )
        .then(() => {
          revalidateChannelMembers()
          setShowInviteChannelModal(false)
          setNewMember("")
        })
        .catch((error) => {
          console.dir(error)
          toast.error(error.response?.data, { position: "bottom-center" })
        })
    },
    [newMember],
  )

  if (!show) return null
  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="member-label">
          <span>채널 멤버 초대</span>
          <Input id="member" value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit" onClick={onCreateChannel}>
          초대하기
        </Button>
      </form>
    </Modal>
  )
}

export default InviteChannelModal
