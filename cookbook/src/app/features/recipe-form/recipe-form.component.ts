import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../core/services/recipe.service';
import { UnitsService } from '../../core/services/units.service';
import { Recipe } from '../../core/models/recipe.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss']
})
export class RecipeFormComponent implements OnInit {
  recipeForm: FormGroup;
  units: string[] = [];
  isEditMode = false;
  private recipeId?: string;

  constructor(
    private fb: FormBuilder,
    private unitsService: UnitsService,
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.recipeForm = this.fb.group({
      title: ['', [Validators.required]],
      ingredients: this.fb.array([], { validators: Validators.required }),
      instructions: ['', [Validators.required]],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.units = this.unitsService.getUnits();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.recipeId = params['id'];
        this.loadRecipeForEdit();
      }
    });
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  createIngredient(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(0.1)]],
      unit: ['', Validators.required]
    });
  }

  addIngredient(): void {
    this.ingredients.push(this.createIngredient());
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      const reader = new FileReader();
    reader.onload = () => {
      this.recipeForm.patchValue({
        imageUrl: reader.result as string
      });
      this.recipeForm.get('imageUrl')?.updateValueAndValidity();
    };
      reader.readAsDataURL(file);
    }
  }

  private loadRecipeForEdit(): void {
    const recipe = this.recipeService.getAllRecipes().find(r => r.id === this.recipeId);
    
    if (recipe) {
      // Очищаем дефолтный ингредиент
      while (this.ingredients.length) {
        this.ingredients.removeAt(0);
      }
      
      recipe.ingredients.forEach(ing => {
        this.ingredients.push(this.fb.group(ing));
      });
      
      this.recipeForm.patchValue({
        title: recipe.title,
        instructions: recipe.instructions,
        imageUrl: recipe.imageUrl
      });
    }
  }

  onSubmit(): void {
    if (this.recipeForm.valid) {
      const recipe: Recipe = {
        ...this.recipeForm.value,
        id: this.recipeId || '',
        createdAt: new Date()
      };

      this.recipeService.createRecipe(this.recipeForm.value);
      this.router.navigate(['/']);
    }
  }
}
