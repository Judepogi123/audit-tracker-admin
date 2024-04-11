import React from "react";

import { FaBorderNone } from "react-icons/fa6";
import { FaBorderAll } from "react-icons/fa";
import { FaRegFilePdf } from "react-icons/fa6";
import { SlDocs } from "react-icons/sl";
import { FaRegImage } from "react-icons/fa";
import { SiMicrosoftexcel } from "react-icons/si";

import Tooltip from "../components/Tooltip";

interface FileProps {
  type: string;
}

const FileTypeRenderer = ({ type }: FileProps) => {
  switch (type) {
    case "null":
      return (
        <Tooltip
          
          title="This indicator does not require any MOV."
        >
          <FaBorderNone />
        </Tooltip>
      );
    case "any":
      return (
        <Tooltip
          
          title="Any file type can be submit to this indicator as MOV"
        >
          <FaBorderAll />
        </Tooltip>
      );
    case "docs":
      return (
        <Tooltip
          
          title="Only DOCS file type can be submit to this indicator as MOV"
        >
          <SlDocs />
        </Tooltip>
      );
    case "pdf":
      return (
        <Tooltip
          
          title="Only PDF file type can be submit to this indicator as MOV"
        >
          <FaRegFilePdf />
        </Tooltip>
      );
    case "excel":
      return (
        <Tooltip
          
          title="Only EXCEL/SPREADSHEET file type can be submit to this indicator as MOV"
        >
          <SiMicrosoftexcel />
        </Tooltip>
      );
    case "pic":
      return (
        <Tooltip
          
          title="Only IMAGE file type can be submit to this indicator as MOV"
        >
          <FaRegImage />
        </Tooltip>
      );
    default:
      return (
        <Tooltip
          enterDelay={1}
          title="This indicator does not require any MOV."
        >
          <FaBorderNone />
        </Tooltip>
      );
  }
};

export default FileTypeRenderer;
