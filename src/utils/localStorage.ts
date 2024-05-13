export const handleSaveLocal = async (address: string, data: string) => {
  if (typeof address !== "string" || typeof data !== "string") return;

  localStorage.setItem(address, data);
};
export const handleGetLocal = async(address: string) => {
  if (typeof address !== "string") return;

  const temp = localStorage.getItem(address);
  return temp as string
};
