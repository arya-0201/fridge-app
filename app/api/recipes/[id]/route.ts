import { NextRequest, NextResponse } from 'next/server'
import { firebaseApp } from '../../../../lib/firebase'
import { getFirestore, collection, doc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore'

const db = getFirestore(firebaseApp)
const RECIPE_COLLECTION = 'recipes'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const docRef = doc(db, RECIPE_COLLECTION, params.id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }
    return NextResponse.json({ id: docSnap.id, ...docSnap.data() })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch recipe' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json()
    const docRef = doc(db, RECIPE_COLLECTION, params.id)
    await updateDoc(docRef, { ...data, updatedAt: Timestamp.now() })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update recipe' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const docRef = doc(db, RECIPE_COLLECTION, params.id)
    await deleteDoc(docRef)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 })
  }
} 