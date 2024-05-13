interface PermissionProps {
  label: string;
  value: string;
}

const permissionLevelList: PermissionProps[] = [
  { label: "Field: Read only", value: "fieldR" },
  { label: "Field: Read and Write", value: "fieldRnW" },
  { label: "Compliance: Read only", value: "complianceR" },
  { label: "Compliance: Read and Write", value: "complianceRnW" },
  { label: "Field: Read only", value: "fieldR" },
];
