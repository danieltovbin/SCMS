import { ReactNode } from "react";

export interface Course {
    id: number;
    title: string;
    description: string;
  }
  
  export interface coursePage {
    children?: ReactNode;
  }