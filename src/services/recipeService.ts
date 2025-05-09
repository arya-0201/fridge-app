import { firebaseApp } from '../../lib/firebase'
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy,
  Timestamp,
  onSnapshot
} from 'firebase/firestore'

const db = getFirestore(firebaseApp)
const RECIPE_COLLECTION = 'recipes'

export interface Ingredient {
  id: string
  name: string
  calories: string
  weight?: string
}

export interface Recipe {
  id?: string
  name: string
  ingredients: Ingredient[]
  description?: string
  instagramLinks?: string[]
  youtubeLink?: string
  image?: string
  status: "saved" | "eat" | "provided"
  createdAt?: Timestamp
}

// Helper function to sanitize recipe data for Firestore
const sanitizeRecipeData = (recipe: Omit<Recipe, 'id' | 'createdAt'>) => {
  const sanitized = { ...recipe }
  
  // Convert undefined arrays to empty arrays
  if (sanitized.instagramLinks === undefined) {
    sanitized.instagramLinks = []
  }
  if (sanitized.youtubeLink === undefined) {
    sanitized.youtubeLink = ""
  }
  
  // Convert undefined strings to empty strings
  if (sanitized.description === undefined) {
    sanitized.description = ""
  }
  if (sanitized.image === undefined) {
    sanitized.image = ""
  }
  
  return sanitized
}

// Get all recipes with real-time updates
export const subscribeToRecipes = (callback: (recipes: Recipe[]) => void) => {
  const q = query(collection(db, RECIPE_COLLECTION), orderBy('createdAt', 'desc'))
  
  return onSnapshot(q, (querySnapshot) => {
    const recipes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Recipe))
    callback(recipes)
  })
}

// Add a new recipe
export const addRecipe = async (recipe: Omit<Recipe, 'id' | 'createdAt'>): Promise<Recipe> => {
  try {
    const sanitizedRecipe = sanitizeRecipeData(recipe)
    const docRef = await addDoc(collection(db, RECIPE_COLLECTION), {
      ...sanitizedRecipe,
      createdAt: Timestamp.now()
    })
    return {
      id: docRef.id,
      ...sanitizedRecipe,
      createdAt: Timestamp.now()
    }
  } catch (error) {
    console.error('Error adding recipe:', error)
    throw error
  }
}

// Update an existing recipe
export const updateRecipe = async (id: string, recipe: Partial<Recipe>): Promise<void> => {
  try {
    const sanitizedRecipe = sanitizeRecipeData(recipe as Omit<Recipe, 'id' | 'createdAt'>)
    const docRef = doc(db, RECIPE_COLLECTION, id)
    await updateDoc(docRef, sanitizedRecipe)
  } catch (error) {
    console.error('Error updating recipe:', error)
    throw error
  }
}

// Delete a recipe
export const deleteRecipe = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, RECIPE_COLLECTION, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting recipe:', error)
    throw error
  }
} 