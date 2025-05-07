"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import "../styles/my-refrigerator.css"
import "../styles/add-button.css"
import AddFridgeModal from "./add-fridge-modal"
import { FridgeItem, getFridgeItems, addFridgeItem, deleteFridgeItem } from "../src/services/fridgeService"

export default function MyRefrigerator() {
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 재료 목록 상태 관리
  const [ingredients, setIngredients] = useState<FridgeItem[]>([])

  // 초기 데이터 로드
  useEffect(() => {
    const loadIngredients = async () => {
      try {
        const items = await getFridgeItems()
        setIngredients(items)
      } catch (error) {
        console.error('Error loading ingredients:', error)
      }
    }
    loadIngredients()
  }, [])

  // 재료 추가 함수
  const handleAddIngredient = async (ingredient: {
    name: string
    weight: number
    registrationDate: string
    expiryDate: string
  }) => {
    try {
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
      const newIngredient: Omit<FridgeItem, 'id' | 'createdAt'> = {
        name: ingredient.name,
        weight: ingredient.weight,
        registrationDate: ingredient.registrationDate.replace(/\d{4}\./, ""),
        expiryDate: ingredient.expiryDate.replace(/\d{4}\./, ""),
        status,
      }

      // Firestore에 추가
      const addedItem = await addFridgeItem(newIngredient)
      // 로컬 상태 업데이트
      setIngredients([addedItem, ...ingredients])
      // 모달 닫기
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error adding ingredient:', error)
    }
  }

  // 재료 삭제 함수
  const handleDeleteIngredient = async (id: string) => {
    try {
      await deleteFridgeItem(id)
      // 로컬 상태 업데이트
      setIngredients(ingredients.filter((ingredient) => ingredient.id !== id))
    } catch (error) {
      console.error('Error deleting ingredient:', error)
    }
  }

  return (
    <div className="page-container">
      <h1 className="page-title">마이냉장고</h1>

      <div className="item-list">
        {ingredients.length === 0 ? (
          <div className="flex h-[calc(var(--app-height)-200px)] items-center justify-center">
            <p className="text-gray-400 text-lg">냉장고 다 털었다!</p>
          </div>
        ) : (
          ingredients.map((ingredient) => (
            <div className="item-card" key={ingredient.id}>
              <div className="item-content">
                <div className="item-header">
                  <span className={`status-tag ${ingredient.status}`}>
                    {ingredient.status === "expired" && "유통기한 지났어요"}
                    {ingredient.status === "fresh" && "아직 괜찮아요"}
                    {ingredient.status === "soon" && "빨리 소진해주세요"}
                  </span>
                  <button className="delete-button" onClick={() => handleDeleteIngredient(ingredient.id!)}>
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
                  {ingredient.registrationDate} 등록 - {ingredient.expiryDate} 까지
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="add-button-container">
        <button className="add-button" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          냉장고에 재료넣기
        </button>
      </div>

      <AddFridgeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddIngredient={handleAddIngredient}
      />
    </div>
  )
}
