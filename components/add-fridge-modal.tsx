"use client"

import { useState, useEffect } from "react"
import { X, Calendar, Search } from "lucide-react"
import "../styles/add-fridge-modal.css"
import { firebaseApp } from '../lib/firebase'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { Ingredient, getIngredients } from "../src/services/ingredientService"

interface AddFridgeModalProps {
  isOpen: boolean
  onClose: () => void
  onAddIngredient: (ingredient: {
    name: string
    weight: number
    registrationDate: string
    expiryDate: string
  }) => void
}

export default function AddFridgeModal({ isOpen, onClose, onAddIngredient }: AddFridgeModalProps) {
  const [name, setName] = useState("")
  const [weight, setWeight] = useState("")
  const [registrationDate, setRegistrationDate] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load ingredients on mount
  useEffect(() => {
    const loadIngredients = async () => {
      try {
        setIsLoading(true)
        const items = await getIngredients()
        setIngredients(items)
      } catch (error) {
        console.error('Error loading ingredients:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadIngredients()
  }, [])

  // Filter ingredients based on search term
  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle ingredient selection
  const handleIngredientSelect = (ingredient: Ingredient) => {
    setName(ingredient.name)
    setWeight(ingredient.weight.toString())
    setSearchTerm("") // Clear search term to hide dropdown
  }

  // 모달이 열릴 때 현재 날짜를 기본값으로 설정
  useEffect(() => {
    if (isOpen) {
      const today = new Date()
      const formattedDate = formatDate(today)
      setRegistrationDate(formattedDate)

      // 기본 유통기한은 7일 후로 설정
      const nextWeek = new Date(today)
      nextWeek.setDate(today.getDate() + 7)
      setExpiryDate(formatDate(nextWeek))
    }
  }, [isOpen])

  // 날짜 포맷 함수 (YYYY.MM.DD)
  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}.${month}.${day}`
  }

  // 폼 제출 처리
  const handleSubmit = async () => {
    const payload = { name, weight: Number(weight), registrationDate, expiryDate }
    onAddIngredient(payload)
    setName("")
    setWeight("")
    onClose()
  }

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div></div>
          <h2 className="modal-title">냉장고에 재료넣기</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-content">
          <div className="form-group border-none focus-within:border focus-within:border-[#0077ff]">
            <label className="form-label">재료 검색</label>
            <div className="input-box--icon">
              <Search className="icon" size={24} color="#6b7280" />
              <input
                type="text"
                className="input-box border-none focus:outline-none focus:border focus:border-[#0077ff]"
                placeholder="재료명을 입력해주세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {searchTerm && (
              <div className="mt-1 bg-white border rounded-md shadow-lg">
                {isLoading ? (
                  <div className="p-2 text-gray-500">로딩중...</div>
                ) : filteredIngredients.length > 0 ? (
                  <ul className="max-h-60 overflow-auto">
                    {filteredIngredients.map((ingredient) => (
                      <li
                        key={ingredient.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleIngredientSelect(ingredient)}
                      >
                        {ingredient.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-2 text-gray-500">검색 결과가 없습니다</div>
                )}
              </div>
            )}
          </div>

          <div className="form-group border-none focus-within:border focus-within:border-[#0077ff]">
            <label className="form-label">무게</label>
            <div className="input-box--unit">
              <input
                type="number"
                className="input-box border-none focus:outline-none focus:border focus:border-[#0077ff]"
                placeholder="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <span className="unit">g</span>
            </div>
          </div>

          <div className="form-group border-none focus-within:border focus-within:border-[#0077ff]">
            <label className="form-label">등록일</label>
            <div className="input-box--icon">
              <Calendar className="icon" size={24} color="#6b7280" />
              <input
                type="text"
                className="input-box border-none focus:outline-none focus:border focus:border-[#0077ff]"
                placeholder="날짜를 선택해주세요"
                value={registrationDate}
                onChange={(e) => setRegistrationDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group border-none focus-within:border focus-within:border-[#0077ff]">
            <label className="form-label">유통기한</label>
            <div className="input-box--icon">
              <Calendar className="icon" size={24} color="#6b7280" />
              <input
                type="text"
                className="input-box border-none focus:outline-none focus:border focus:border-[#0077ff]"
                placeholder="날짜를 선택해주세요"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div style={{ padding: "20px" }}>
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={!name || !weight || !registrationDate || !expiryDate}
          >
            재료 넣기
          </button>
        </div>
      </div>
    </div>
  )
}
