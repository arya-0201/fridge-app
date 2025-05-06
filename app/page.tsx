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
      setIsMobile(window.innerWidth <= 430)
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
      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-time">9:41</div>
        <div className="status-icons">
          <div className="w-4 h-4">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12.01 21.49L5.83 15.31C5.3 14.79 4.88 14.18 4.56 13.53C4.24 12.87 4.08 12.18 4.08 11.46C4.08 10.73 4.24 10.05 4.56 9.39C4.88 8.73 5.3 8.12 5.83 7.6C6.35 7.08 6.96 6.66 7.62 6.34C8.27 6.02 8.96 5.86 9.68 5.86C10.4 5.86 11.09 6.02 11.74 6.34C12.4 6.66 13.01 7.08 13.53 7.6L14.65 8.72L15.77 7.6C16.29 7.08 16.9 6.66 17.56 6.34C18.22 6.02 18.91 5.86 19.63 5.86C20.35 5.86 21.04 6.02 21.69 6.34C22.35 6.66 22.96 7.08 23.48 7.6C24 8.12 24.42 8.73 24.74 9.39C25.06 10.05 25.22 10.73 25.22 11.46C25.22 12.18 25.06 12.87 24.74 13.53C24.42 14.18 24 14.79 23.48 15.31L17.3 21.49C17.21 21.58 17.11 21.65 17 21.69C16.89 21.74 16.78 21.76 16.67 21.76C16.56 21.76 16.45 21.74 16.34 21.69C16.23 21.65 16.13 21.58 16.04 21.49L14.65 20.1L13.26 21.49C13.17 21.58 13.07 21.65 12.96 21.69C12.85 21.74 12.74 21.76 12.63 21.76C12.52 21.76 12.41 21.74 12.3 21.69C12.19 21.65 12.09 21.58 12 21.49H12.01Z"
                fill="black"
              />
            </svg>
          </div>
          <div className="w-4 h-4">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 9L12 2L23 9V20C23 20.5304 22.7893 21.0391 22.4142 21.4142C22.0391 21.7893 21.5304 22 21 22H3C2.46957 22 1.96086 21.7893 1.58579 21.4142C1.21071 21.0391 1 20.5304 1 20V9Z"
                fill="black"
              />
            </svg>
          </div>
          <div className="battery-icon"></div>
        </div>
      </div>

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
