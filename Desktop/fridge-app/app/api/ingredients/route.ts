// app/api/ingredients/route.ts
import admin from 'firebase-admin'
import { NextResponse } from 'next/server'

// Admin SDK 초기화 (한 번만)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
  })
}
const db = admin.firestore()
const col = db.collection('ingredients')

// GET /api/ingredients
export async function GET() {
  const snap = await col.get()
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  return NextResponse.json(list)
}

// POST /api/ingredients
export async function POST(req: Request) {
  const body = await req.json()
  const docRef = await col.add(body)
  return NextResponse.json({ id: docRef.id }, { status: 201 })
}

export async function PUT(request: Request) {
  const { id, ...data } = await request.json()
  const db = admin.firestore()
  await db.collection("ingredients").doc(id).update(data)
  return NextResponse.json({ id, ...data })
}
