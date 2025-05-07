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
  Timestamp
} from 'firebase/firestore'

const db = getFirestore(firebaseApp)
const INGREDIENT_COLLECTION = 'ingredients'

export interface Ingredient {
  id?: string
  name: string
  weight: number
  calories: string
  carbs: string
  protein: string
  fat: string
  shelfLife: number
  unitWeight: string
  createdAt?: Timestamp
}

export const getIngredients = async (): Promise<Ingredient[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, INGREDIENT_COLLECTION))
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Ingredient))
  } catch (error) {
    console.error('Error fetching ingredients:', error)
    throw error
  }
}

export const addIngredient = async (item: Omit<Ingredient, 'id' | 'createdAt'>): Promise<Ingredient> => {
  try {
    const docRef = await addDoc(collection(db, INGREDIENT_COLLECTION), {
      ...item,
      createdAt: Timestamp.now()
    })
    return {
      id: docRef.id,
      ...item,
      createdAt: Timestamp.now()
    }
  } catch (error) {
    console.error('Error adding ingredient:', error)
    throw error
  }
}

export const updateIngredient = async (id: string, item: Partial<Ingredient>): Promise<void> => {
  try {
    const docRef = doc(db, INGREDIENT_COLLECTION, id)
    await updateDoc(docRef, item)
  } catch (error) {
    console.error('Error updating ingredient:', error)
    throw error
  }
}

export const deleteIngredient = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, INGREDIENT_COLLECTION, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting ingredient:', error)
    throw error
  }
} 