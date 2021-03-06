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
  setShowCreateChannelModal: (flag: boolean) => void
}

const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const { workspace } = useParams<{ workspace?: string }>()
  const [newChannel, onChangeNewChannel, setNewChannl] = useInput("")
  const { data: userData } = useSWR<IUser | false>("/api/users", fetcher, {
    dedupingInterval: 2000,
  })
  const { mutate: revalidateChannels } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher,
  )

  const onCreateChannel = useCallback(
    (e) => {
      e.preventDefault()
      if (!newChannel || !newChannel.trim()) return
      axios
        .post(`/api/workspaces/${workspace}/channels`, { name: newChannel }, { withCredentials: true })
        .then(() => {
          revalidateChannels()
          setShowCreateChannelModal(false)
          setNewChannl("")
        })
        .catch((error) => {
          console.dir(error)
          toast.error(error.response?.data, { position: "bottom-center" })
        })
    },
    [newChannel],
  )

  if (!show) return null
  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>워크스페이스 이름</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit" onClick={onCreateChannel}>
          생성하기
        </Button>
      </form>
    </Modal>
  )
}

export default CreateChannelModal
