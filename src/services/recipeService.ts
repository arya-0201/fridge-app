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
  createdAt?: any
} 