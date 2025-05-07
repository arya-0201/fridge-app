"use client"

import { useState, useEffect, useRef } from "react"
import { X, Search } from "lucide-react"
import "../styles/ingredient-search-sheet.css"
import { Ingredient, getIngredients } from "../src/services/ingredientService"

interface IngredientSearchSheetProps {
  isOpen: boolean
  onClose: () => void
  onAddIngredient: (ingredient: { name: string; weight: string; calories: string }) => void
}

export default function IngredientSearchSheet({ isOpen, onClose, onAddIngredient }: IngredientSearchSheetProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)
  const [weight, setWeight] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Load ingredients on mount
  useEffect(() => {
    const loadIngredients = async () => {
      try {
        setIsLoading(true)
        const items = await getIngredients()
        setIngredients(items)
      } catch (error) {
        console.error('Error loading ingredients:', error)
        showToastMessage("재료 목록을 불러오는데 실패했습니다")
      } finally {
        setIsLoading(false)
      }
    }
    loadIngredients()
  }, [])

  // Filter ingredients based on search term
  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient)
    setSearchTerm(ingredient.name)
  }

  // 재료 추가 처리
  const handleAddIngredient = () => {
    if (!selectedIngredient) {
      showToastMessage("재료를 선택해주세요")
      return
    }

    if (!weight || weight === "0") {
      showToastMessage("무게를 입력해주세요")
      return
    }

    onAddIngredient({
      name: selectedIngredient.name,
      weight: weight,
      calories: selectedIngredient.calories,
    })

    // 상태 초기화
    setSearchTerm("")
    setSelectedIngredient(null)
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
                setSelectedIngredient(null)
              }}
            />
          </div>
        </div>

        {searchTerm && !selectedIngredient && (
          <div className="search-results">
            {isLoading ? (
              <div className="search-result-item">로딩중...</div>
            ) : filteredIngredients.length > 0 ? (
              filteredIngredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className="search-result-item"
                  onClick={() => handleSelectIngredient(ingredient)}
                >
                  {ingredient.name}
                </div>
              ))
            ) : (
              <div className="search-result-item">검색 결과가 없습니다</div>
            )}
          </div>
        )}

        {selectedIngredient && (
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
