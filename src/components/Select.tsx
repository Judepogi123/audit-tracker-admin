import React from 'react';
import { Select as GenSelect } from 'antd';
import { ConfigProviderProps } from 'antd';

type SizeType = ConfigProviderProps['componentSize'];

interface OptionProps {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  defaultValue?:  string
  options: OptionProps[];
  onChange?: (value: string)=> void 
  style?: React.CSSProperties;
  value?:  string | null | undefined,
  size: SizeType
}

const Select = ({ defaultValue, options, onChange, style,value,size }: SelectProps) => {

  return (
    <GenSelect
    size={size}
    value={value}
    defaultValue={defaultValue}
      style={style}
      onChange={onChange}
      options={options}
    />
  );
};

export default Select;
