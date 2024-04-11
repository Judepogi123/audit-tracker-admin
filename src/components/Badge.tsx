import React from 'react'
import { Badge as GenBadge } from 'antd'

interface BadgeProps {
    children: React.ReactNode;
    count?: number
}

const Badge = ({children, count}: BadgeProps) => {
  return (
    <GenBadge count={count}>{children}</GenBadge>
  )
}

export default Badge