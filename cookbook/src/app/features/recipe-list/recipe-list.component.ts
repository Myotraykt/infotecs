import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../core/services/recipe.service';
import { Recipe } from '../../core/models/recipe.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];

  constructor(
    private recipeService: RecipeService,
    private dialog: MatDialog,
    private router: Router
  ) {
    console.log('AppComponent initialized');
  }

  navigateToCreate() {
    this.router.navigate(['/create']);
  }

  ngOnInit(): void {
    this.loadRecipes();
    console.log('RecipeList loaded');
  }

  loadRecipes(): void {
    this.recipes = this.recipeService.getAllRecipes();
  }

  deleteRecipe(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Вы уверены что хотите удалить рецепт?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.recipeService.deleteRecipe(id);
        this.loadRecipes();
      }
    });
  }

  editRecipe(id: string): void {
    this.router.navigate(['/edit', id]);
  }
}
