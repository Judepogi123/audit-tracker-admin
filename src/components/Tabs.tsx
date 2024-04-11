import React from 'react';
import type { RadioChangeEvent } from 'antd';
import { Radio, Tabs as GenTabs } from 'antd';

type TabPosition = 'left' | 'right' | 'top' | 'bottom';

interface Tab {
  key: string;
  label: string | React.ReactNode;
  children?: React.ReactNode;
}

interface TabsProps {
  position?: TabPosition | undefined;
  items?: Tab[] | undefined;
  onChange?: (activeKey: string) => void | undefined;
  defaultActiveKey?: string | undefined
}

const Tabs = ({ position, items,onChange,defaultActiveKey }: TabsProps) => {
  return (
    <GenTabs style={{overflow: "auto"}} defaultActiveKey={defaultActiveKey} tabPosition={position} items={items} onChange={onChange} />
  );
};

export default Tabs;
