import React from 'react'
import { Timeline as MainTimeLine, TimelineItemProps } from 'antd'

interface TimelineProps {
    items?: TimelineItemProps[] | undefined
}

const Timeline = ({items}: TimelineProps) => {
  return (
   <MainTimeLine items={items}  />
  )
}

export default Timeline