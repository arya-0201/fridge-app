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
const FRIDGE_COLLECTION = 'fridge_items'

export interface FridgeItem {
  id?: string
  name: string
  weight: number
  registrationDate: string
  expiryDate: string
  status: "expired" | "fresh" | "soon"
  createdAt?: Timestamp
}

export const getFridgeItems = async (): Promise<FridgeItem[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, FRIDGE_COLLECTION))
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FridgeItem))
  } catch (error) {
    console.error('Error fetching fridge items:', error)
    throw error
  }
}

export const addFridgeItem = async (item: Omit<FridgeItem, 'id' | 'createdAt'>): Promise<FridgeItem> => {
  try {
    const docRef = await addDoc(collection(db, FRIDGE_COLLECTION), {
      ...item,
      createdAt: Timestamp.now()
    })
    return {
      id: docRef.id,
      ...item,
      createdAt: Timestamp.now()
    }
  } catch (error) {
    console.error('Error adding fridge item:', error)
    throw error
  }
}

export const updateFridgeItem = async (id: string, item: Partial<FridgeItem>): Promise<void> => {
  try {
    const docRef = doc(db, FRIDGE_COLLECTION, id)
    await updateDoc(docRef, item)
  } catch (error) {
    console.error('Error updating fridge item:', error)
    throw error
  }
}

export const deleteFridgeItem = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, FRIDGE_COLLECTION, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting fridge item:', error)
    throw error
  }
} 