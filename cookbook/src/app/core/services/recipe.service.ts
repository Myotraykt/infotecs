// src/app/core/services/recipe.service.ts
import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly STORAGE_KEY = 'recipes';
  private recipes: Recipe[] = [];

  constructor() {
    this.loadFromStorage();
  }

  // Загрузка из localStorage
  private loadFromStorage(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    this.recipes = data ? JSON.parse(data) : [];
  }

  // Сохранение в localStorage
  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.recipes));
  }

  getAllRecipes(): Recipe[] {
    return this.recipes;
  }

  createRecipe(recipe: Omit<Recipe, 'id' | 'created'>): void {
    const newRecipe: Recipe = {
      ...recipe,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    this.recipes.push(newRecipe);
    this.saveToStorage(); // Важно: сохранить изменения
  }

  saveRecipe(recipe: Recipe): void {
    const index = this.recipes.findIndex(r => r.id === recipe.id);
    if (index !== -1) {
      this.recipes[index] = recipe;
      this.saveToStorage();
    }
  }

  deleteRecipe(id: string): void {
    this.recipes = this.recipes.filter(r => r.id !== id);
    this.saveToStorage();
  }

  getRecipeById(id: string): Recipe | undefined {
    const recipe = this.recipes.find(r => r.id === id);
    if (!recipe) {
      console.error('Recipe not found with id:', id);
      return undefined;
    }
    return recipe;
  }
}

