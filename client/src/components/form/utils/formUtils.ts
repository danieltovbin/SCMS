import { FormEvent, ReactNode } from "react";

export interface createFormProps {
  titleName: string;
  children: ReactNode;
  textLoading: string;
  textDefault: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  message: string;
}
