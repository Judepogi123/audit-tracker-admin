import React from "react";

export interface FeildProps {
  title: string;
  key: string;
}

export interface AuditProps {
  acronym: string;
  key: string;
  title: string;
  type: string;
}

export interface AreaProps {
  id: string;
  title: string;
  type: string;
  description: string;
  pushKey: string;
  auditKey: string;
}

export interface OptionProps {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface ComplianceDataProps {
  auditKey: string;
  fieldAnswer: string;
  fieldPushKey: string;
  pushKey: string;
  sender: string;
  status: string;
  timestamp: string;
  viewed: boolean;
  zipCode: string;
  checkedBy: string
}

export interface LocaleListProps {
  municipalityName: string;
  zipCode: number;
}

export interface CollapseItem {
  key: string | number;
  label: string;
  children: React.ReactNode
}