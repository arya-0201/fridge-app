"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import "../styles/my-refrigerator.css"
import "../styles/add-button.css"
import AddIngredientModal from "./add-ingredient-modal"

import { firebaseApp } from '../lib/firebase'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

// 재료 타입 정의
interface Ingredient {
  id: string
  name: string
  weight: number
  registrationDate: string
  expiryDate: string
  status: "expired" | "fresh" | "soon"
}

export default function MyRefrigerator() {
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 재료 목록 상태 관리
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    {
      id: "1",
      name: "토마토 1박스",
      weight: 500,
      registrationDate: "25.10.20",
      expiryDate: "25.10.23",
      status: "expired",
    },
    {
      id: "2",
      name: "계란 1판",
      weight: 300,
      registrationDate: "25.10.20",
      expiryDate: "25.10.23",
      status: "fresh",
    },
    {
      id: "3",
      name: "두부 1모",
      weight: 300,
      registrationDate: "25.10.20",
      expiryDate: "25.10.23",
      status: "soon",
    },
    {
      id: "4",
      name: "우유 1팩",
      weight: 1000,
      registrationDate: "25.10.22",
      expiryDate: "25.10.30",
      status: "fresh",
    },
  ])

  // 재료 추가 함수
  const handleAddIngredient = async (ingredient: {
    name: string
    weight: number
    registrationDate: string
    expiryDate: string
  }) => {
    // 현재 날짜와 유통기한을 비교하여 상태 결정
    const today = new Date()
    const expiryDate = new Date(ingredient.expiryDate.replace(/\./g, "-"))
    const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    let status: "expired" | "fresh" | "soon"
    if (diffDays < 0) {
      status = "expired"
    } else if (diffDays <= 3) {
      status = "soon"
    } else {
      status = "fresh"
    }

    // 새 재료 객체 생성
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: ingredient.name,
      weight: ingredient.weight,
      registrationDate: ingredient.registrationDate.replace(/\d{4}\./, ""),
      expiryDate: ingredient.expiryDate.replace(/\d{4}\./, ""),
      status,
    }

    // 재료 목록에 추가
    setIngredients([newIngredient, ...ingredients])
    // POST API 호출
    await fetch('/api/ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ingredient),
      })
      // 로컬도 갱신
      setIngredients([newIngredient, ...ingredients])

    // 모달 닫기
    setIsModalOpen(false)
  }

  // 재료 삭제 함수
  const handleDeleteIngredient = async (id: string) => {
    // DELETE API 호출
    await fetch(`/api/ingredients?id=${id}`, { method: 'DELETE' })
    // 로컬 갱신
    setIngredients(ingredients.filter((ingredient) => ingredient.id !== id))
  }

  return (
    <div className="page-container">
      <h1 className="page-title">마이냉장고</h1>

      <div className="item-list">
        {ingredients.map((ingredient) => (
          <div className="item-card" key={ingredient.id}>
            <div className="item-content">
              <div className="item-header">
                <span className={`status-tag ${ingredient.status}`}>
                  {ingredient.status === "expired" && "유통기한 지났어요"}
                  {ingredient.status === "fresh" && "아직 냉장해요"}
                  {ingredient.status === "soon" && "빨리 소진해주세요"}
                </span>
                <button className="delete-button" onClick={() => handleDeleteIngredient(ingredient.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
              <h2 className="item-title">{ingredient.name}</h2>
              <p className="item-date">
                {ingredient.registrationDate} 등록 - {ingredient.expiryDate}까지
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="add-button-container">
        <button className="add-button" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          냉장고에 재료넣기
        </button>
      </div>

      <AddIngredientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddIngredient={handleAddIngredient}
      />
    </div>
  )
}
