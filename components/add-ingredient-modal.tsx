"use client"

import { useState, useEffect } from "react"
import { X, Calendar, Search } from "lucide-react"
import "../styles/add-ingredient-modal.css"
import { firebaseApp } from '../lib/firebase'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

interface AddIngredientModalProps {
  isOpen: boolean
  onClose: () => void
  onAddIngredient: (ingredient: {
    name: string
    weight: number
    registrationDate: string
    expiryDate: string
  }) => void
}

export default function AddIngredientModal({ isOpen, onClose, onAddIngredient }: AddIngredientModalProps) {
  const [name, setName] = useState("")
  const [weight, setWeight] = useState("")
  const [registrationDate, setRegistrationDate] = useState("")
  const [expiryDate, setExpiryDate] = useState("")

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
       // 1) 서버 API 에 POST
       const payload = { name, weight: Number(weight), registrationDate, expiryDate }
       await fetch('/api/ingredients', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(payload),
       })
    
       // 2) 부모 콜백으로 리스트 갱신 트리거
       onAddIngredient(payload)
    
       // 3) 폼 초기화 & 모달 닫기
       setName('')
       setWeight('')
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
          <div className="form-group">
            <label className="form-label">재료 검색</label>
            <div className="form-input-with-icon">
              <Search className="icon" size={24} color="#6b7280" />
              <input
                type="text"
                className="form-input"
                placeholder="재료명을 입력해주세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">무게</label>
            <div className="form-input-with-unit">
              <input
                type="number"
                className="form-input"
                placeholder="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <span className="unit">g</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">등록일</label>
            <div className="form-input-with-icon">
              <Calendar className="icon" size={24} color="#6b7280" />
              <input
                type="text"
                className="form-input"
                placeholder="날짜를 선택해주세요"
                value={registrationDate}
                onChange={(e) => setRegistrationDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">유통기한</label>
            <div className="form-input-with-icon">
              <Calendar className="icon" size={24} color="#6b7280" />
              <input
                type="text"
                className="form-input"
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
