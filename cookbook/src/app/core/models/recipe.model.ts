import { Ingredient } from "./ingredient.model";

export interface Recipe {
  id: string;
  title: string;
  ingredients: Ingredient[];
  instructions: string;
  imageUrl?: string;
  createdAt: Date;
}
