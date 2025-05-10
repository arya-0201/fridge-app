import { NextRequest, NextResponse } from 'next/server'
import { firebaseApp } from '../../../lib/firebase'
import { getFirestore, collection, getDocs, addDoc, Timestamp, query, orderBy } from 'firebase/firestore'

const db = getFirestore(firebaseApp)
const RECIPE_COLLECTION = 'recipes'

export async function GET() {
  try {
    const q = query(collection(db, RECIPE_COLLECTION), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    const recipes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return NextResponse.json(recipes)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const docRef = await addDoc(collection(db, RECIPE_COLLECTION), {
      ...data,
      createdAt: Timestamp.now()
    })
    return NextResponse.json({ id: docRef.id, ...data, createdAt: Timestamp.now() })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add recipe' }, { status: 500 })
  }
} 