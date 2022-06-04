import React, { CSSProperties, FC, MouseEvent, useCallback } from "react"
import { CloseModalButton, CreateMenu } from "./styles"

interface Props {
  style: CSSProperties
  show: boolean
  onCloseModal: (e: MouseEvent) => void
  closeButton?: boolean
}

const Menu: FC<Props> = ({ children, style, show, onCloseModal, closeButton }) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation()
  }, [])

  if (!show) return null
  return (
    <CreateMenu onClick={onCloseModal}>
      <div style={style} onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  )
}

Menu.defaultProps = {
  closeButton: true,
}

export default Menu
