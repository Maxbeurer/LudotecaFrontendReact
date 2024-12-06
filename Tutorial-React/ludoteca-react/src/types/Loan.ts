import { Game } from "./Game";
import { Client } from "./Client";
import {Dayjs}from "dayjs";
export interface Loan {
  id: string,
  game?: Game;
  client?: Client;
  startDate: Dayjs;
  endDate: Dayjs;
}

export interface LoanResponse {
    content: Loan[];
    totalElements: number;
}