import React from 'react'
import { Segmented as MainSegmented } from 'antd';
import { SegmentedOptions } from 'antd/es/segmented';

interface SegmentedProps {
    options: SegmentedOptions<never>
    onChange?: ((value: never) => void) | undefined
}

const Segmented = ({options, onChange}: SegmentedProps) => {
  return (
    <MainSegmented onChange={onChange} options={options}/>)
}

export default Segmented