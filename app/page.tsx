"use client"

import { useState, useEffect } from "react"
 // ① API에서 받아올 데이터 타입 정의
 interface Ingredient {
   id: string
   name: string
   weight: number
   calories: number
   carbs: number
   protein: number
   fat: number
   shelfLife: number
 }

import MyRefrigerator from "@/components/my-refrigerator"
import RecipeBook from "@/components/recipe-book"
import IngredientDB from "@/components/ingredient-db"
import Navigation from "@/components/navigation"
import '../styles/globals.css'
import { firebaseApp } from '../lib/firebase'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

export default function Home() {
  const [activeTab, setActiveTab] = useState<"fridge" | "recipe" | "ingredients">("fridge")
    // ② API 데이터와 로딩 플래그를 위한 state
  const [list, setList] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    // 초기 화면 크기 확인
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 440)
    }

    // 초기 실행
    checkMobile()

    // 화면 크기 변경 시 확인
    window.addEventListener("resize", checkMobile)

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

 // ③ Firestore API에서 식재료 목록 불러오기
 useEffect(() => {
   setLoading(true)
   fetch('/api/ingredients')
     .then(res => res.json())
     .then((data: Ingredient[]) => setList(data))
     .catch(err => console.error('API 호출 에러', err))
     .finally(() => setLoading(false))
 }, [])

  return (
    <div className="app-container">

      {/* Main Content */}
      <div className="main-content">
        {activeTab === "fridge" && <MyRefrigerator />}
        {activeTab === "recipe" && <RecipeBook />}
        {activeTab === "ingredients" && <IngredientDB />}
      </div>

      {/* Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
