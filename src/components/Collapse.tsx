import React from 'react'
import { CollapsePanelProps,Collapse as GenCollapse } from 'antd'
import { CollapseItem } from '../interface/compliance'
import Panel from 'antd/es/cascader/Panel';


interface AccordionProps {
    items: CollapseItem[];
    onChange?: ((key: string | string[]) => void) | undefined
    defaultActiveKey?: string | number | (string | number)[] | undefined
}

const Collapse = ({items,onChange,defaultActiveKey}: AccordionProps) => {
  return (
    <GenCollapse defaultActiveKey={defaultActiveKey} onChange={onChange}>
        {items.map((item)=>(
            <div></div>
        ))}
    </GenCollapse>
  )
}

export default Collapse