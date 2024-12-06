import { Category } from "./Category";
import { Author } from "./Author";

export interface Game {
  id: string;
  title: string;
  age: number;
  category?: Category;
  author?: Author;
}