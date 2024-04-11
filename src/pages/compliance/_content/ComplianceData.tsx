import React from 'react';
import { useParams } from 'react-router-dom';
import Buttons from '../../../components/Button';


const ComplianceData = () => {

    const {complianceID } = useParams()

  return (
    <div>{complianceID}</div>
  )
}

export default ComplianceData