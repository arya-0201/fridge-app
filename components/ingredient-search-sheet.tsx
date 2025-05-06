"use client"

import { useState, useEffect, useRef } from "react"
import { X, Search } from "lucide-react"
import "../styles/ingredient-search-sheet.css"
import { firebaseApp } from '../lib/firebase'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

interface Food {
  id: string
  name: string
  calories: string
}

interface IngredientSearchSheetProps {
  isOpen: boolean
  onClose: () => void
  onAddIngredient: (ingredient: { name: string; weight: string; calories: string }) => void
}

export default function IngredientSearchSheet({ isOpen, onClose, onAddIngredient }: IngredientSearchSheetProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFood, setSelectedFood] = useState<Food | null>(null)
  const [weight, setWeight] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const sheetRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // 샘플 식재료 데이터
  const foods: Food[] = [
    { id: "1", name: "냉동 블루베리", calories: "57kcal" },
    { id: "2", name: "냉동 라즈베리", calories: "52kcal" },
    { id: "3", name: "냉동 야채", calories: "25kcal" },
    { id: "4", name: "냉동삼겹살", calories: "242kcal" },
    { id: "5", name: "냉장 닭가슴살", calories: "165kcal" },
    { id: "6", name: "토마토", calories: "18kcal" },
    { id: "7", name: "오이", calories: "15kcal" },
    { id: "8", name: "당근", calories: "41kcal" },
    { id: "9", name: "양파", calories: "40kcal" },
    { id: "10", name: "마늘", calories: "149kcal" },
  ]

  // 검색 결과 필터링
  const filteredFoods = foods.filter((food) => food.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // 모달이 열릴 때 검색 입력란에 포커스
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // ESC 키 누를 때 닫기
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  // 식재료 선택 처리
  const handleSelectFood = (food: Food) => {
    setSelectedFood(food)
    setSearchTerm(food.name)
  }

  // 재료 추가 처리
  const handleAddIngredient = () => {
    if (!selectedFood) {
      showToastMessage("재료를 선택해주세요")
      return
    }

    if (!weight || weight === "0") {
      showToastMessage("무게를 입력해주세요")
      return
    }

    onAddIngredient({
      name: selectedFood.name,
      weight: weight,
      calories: selectedFood.calories,
    })

    // 상태 초기화
    setSearchTerm("")
    setSelectedFood(null)
    setWeight("")
    onClose()
  }

  // 토스트 메시지 표시
  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null

  return (
    <div className="bottom-sheet-overlay">
      <div className="bottom-sheet" ref={sheetRef}>
        <div className="sheet-header">
          <h2 className="sheet-title">재료 추가하기</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="search-container">
          <div className="search-box">
            <Search className="search-icon" size={24} />
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="재료 검색"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setSelectedFood(null)
              }}
            />
          </div>
        </div>

        {searchTerm && !selectedFood && (
          <div className="search-results">
            {filteredFoods.length > 0 ? (
              filteredFoods.map((food) => (
                <div key={food.id} className="search-result-item" onClick={() => handleSelectFood(food)}>
                  {food.name}
                </div>
              ))
            ) : (
              <div className="search-result-item">검색 결과가 없습니다</div>
            )}
          </div>
        )}

        {selectedFood && (
          <div className="weight-input-container">
            <div className="weight-input-box">
              <label className="weight-label">무게</label>
              <div className="weight-input-wrapper">
                <input
                  type="number"
                  className="weight-input"
                  placeholder="0"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  autoFocus
                />
                <span className="weight-unit">g</span>
              </div>
            </div>
          </div>
        )}

        <button className="search-add-button" onClick={handleAddIngredient}>
          재료 추가
        </button>

        {showToast && <div className="toast-message">{toastMessage}</div>}
      </div>
    </div>
  )
}
