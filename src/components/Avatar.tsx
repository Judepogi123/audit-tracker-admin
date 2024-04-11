import React from 'react'
import { UserOutlined } from '@ant-design/icons';
import { Avatar as GenAvatar, Space } from 'antd';

interface AvatarProps{
    size?: number;
    src?: string;
    icon?: React.ReactNode;
    style?: React.CSSProperties | undefined
}

const Avatar = ({size,src,icon,style}: AvatarProps) => {
  return (
    <GenAvatar style={style} size={size} src={src} icon={icon}/>
  )
}

export default Avatar