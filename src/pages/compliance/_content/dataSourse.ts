interface NotifyProps {
    query: string;
    id: string;
    problem: string;
    status: boolean
  }

interface NotifyDataProps {
  label: string,
  value: string
}

export const notifyDataList: NotifyDataProps[]=[
  {label: "MOV does not support the response.", value:"prob1" },
  {label: "No MOV found.", value:"prob2" },
  {label: "No response found.", value:"prob3" },
]

export const reasonList: NotifyProps[] = [
  {
      query: "MOV does not support the response.",
      id: "prob1",
      problem: "",
      status: false
  },
  {
      query: "No MOV found.",
      id: "prob2",
      problem: "",
      status: false
  },
  {
      query: "No response found",
      id: "prob3",
      problem: "",
      status: false
  },
];
