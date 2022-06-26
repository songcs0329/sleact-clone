import React, { VFC, useCallback, useState } from "react"
import axios from "axios"
import useSWR from "swr"
import fetcher from "@utils/fetcher"
import { Link, Redirect, Route, Switch } from "react-router-dom"
import gravatar from "gravatar"
import loadable from "@loadable/component"
import { IUser } from "@typings/db"
import useInput from "@hooks/useInput"
import { Button, Input, Label } from "@pages/SignUp/styles"
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from "./styles"
import Menu from "@components/Menu"
import Modal from "@components/Modal"
import { toast, ToastContainer } from "react-toastify"
import CreateChannelModal from "@components/CreateChannelModal"
import InviteWorkspaceModal from "@components/InviteWorkspaceModal"
import ChannelList from "@components/ChannelList"
import DMList from "@components/DMList"
const Channel = loadable(() => import("@pages/Channel"))
const DirectMessage = loadable(() => import("@pages/DirectMessage"))

const Workspace: VFC = () => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false)
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false)
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false)
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false)
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput("")
  const [newUrl, onChangeNewUrl, setrNewUrl] = useInput("")
  const { data: userData, mutate: revalidateUserData } = useSWR<IUser | false>("/api/users", fetcher, {
    dedupingInterval: 2000,
  })

  const onLogout = useCallback(() => {
    axios
      .post("/api/users/logout", null, {
        withCredentials: true,
      })
      .then(() => {
        revalidateUserData(false, false)
      })
  }, [revalidateUserData])
  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev)
  }, [])
  const onCloseUserProfile = useCallback((e) => {
    e.stopPropagation()
    setShowUserMenu(false)
  }, [])
  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true)
  }, [])
  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false)
    setShowCreateChannelModal(false)
    setShowInviteWorkspaceModal(false)
  }, [])
  const onCreateWorkspace = useCallback(
    (e) => {
      e.preventDefault()
      if (!newWorkspace || !newWorkspace.trim()) return
      if (!newUrl || !newUrl.trim()) return
      axios
        .post("api/workspaces", {
          workspace: newWorkspace,
          url: newUrl,
        })
        .then(() => {
          revalidateUserData()
          setShowCreateWorkspaceModal(false)
          setNewWorkspace("")
          setrNewUrl("")
        })
        .catch((error) => {
          console.dir(error)
          toast.error(error.response?.data, { position: "bottom-center" })
        })
    },
    [newWorkspace, newUrl, setNewWorkspace, setrNewUrl, revalidateUserData],
  )
  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev)
  }, [])
  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true)
  }, [])
  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteWorkspaceModal(true)
  }, [])

  if (!userData) return <Redirect to={"/login"} />
  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.email, { size: "28px", d: "retro" })} alt={userData.nickname} />
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onCloseUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.email, { size: "36px", d: "retro" })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${ws.name}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            )
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>sleact</h2>
                <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                <button onClick={onClickAddChannel}>채널만들기</button>
                <button onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
            <ChannelList />
            <DMList />
          </MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path={"/workspace/:workspace/channel/:channel"} component={Channel} />
            <Route path={"/workspace/:workspace/dm/:id"} component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit" onClick={onCreateWorkspace}>
            생성하기
          </Button>
        </form>
      </Modal>
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />
      <InviteWorkspaceModal
        show={showInviteWorkspaceModal}
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
      />
      <ToastContainer position="bottom-center" />
    </div>
  )
}

export default Workspace
