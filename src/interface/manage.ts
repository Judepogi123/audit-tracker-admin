export interface NewAudit {
  title: string;
  keys: string;
  type: string;
  acronym: string;
}

export interface AuditProps {
  title: string;
  key: string;
  type: string;
  acronym: string;
}

export interface SelectProps {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface KeysProps {
  bindedKey: string;
  key: string;
  binded: boolean;
}

export interface AreaProps {
  auditKey: string;
  authorFullname: string;
  authorUsername: string;
  localeType: string;
  title: string;
  description: string;
  locked: boolean;
  pushKey: string;
  archived: boolean;
}

export interface NewArea {
  title: string;
  desc: string;
}
export interface DraftedArea {
  areaKey: string;
  auditKey: string;
  draftedField?: string;
  title: string;
  desc?: string;
  timestamp: string;
  type:string
}

export interface RequirementsProps {
  condition: string;
  value: { id: string; query: string; status: boolean }[];
}

export interface ValueProps {
  title: string;
  key: string;
}

export interface IndicatorsProps {
  dataInputMethod: {
    type: null | string;
    value: ValueProps[] | string | number;
  };
  query: string;
  id: string;
  mov: string;
  movDueDate: string | undefined | "null";
  title: string;
  type: "indicator" | "subIndicator";
  subIndicator?: IndicatorsProps[];
  stage: number;
  status: boolean;
  marked: boolean;
}

export interface FieldProps {
  id: string;
  title: string;
  type: string;
  dependencies: { method: string; value: number };
  description: string;
  requirements: RequirementsProps[];
  indicators: IndicatorsProps[];
  pushKey: string;
  author: string;
}

export interface PermissionsProps {
  compliance: string;
  files: string;
  logs: string;
  municipals: string;
  users: string;
  archived: string;
  audit: string;
}

export interface Items {
  key: string;
  label: string;
  children: Items[] | [];
}

export interface ActivityLogs {
  title: string;
  date: string;
  desc: string;
}


export interface UserProps {
  userName: string;
  userProfilePicture: string;
  userType: string;
  userFullName: string;
  userZoneId: number;
  userAddress: string;
  history: any;
  userPermission: string
}