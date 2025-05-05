"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import "../styles/add-food-modal.css"
import { firebaseApp } from '../lib/firebase'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

interface Food {
  id: string
  name: string
  weight: string
  calories: string
  carbs: string
  protein: string
  fat: string
  shelfLife: string
}

interface AddFoodModalProps {
  isOpen: boolean
  onClose: () => void
  onAddFood: (food: {
    name: string
    weight: number
    calories: string
    carbs: string
    protein: string
    fat: string
    shelfLife: number
    unitWeight: number
  }) => void
  isEditMode?: boolean
  editingFood?: Food | null
}

export default function AddFoodModal({
  isOpen,
  onClose,
  onAddFood,
  isEditMode = false,
  editingFood = null,
}: AddFoodModalProps) {
  const [name, setName] = useState("")
  const [weight, setWeight] = useState("")
  const [calories, setCalories] = useState("")
  const [carbs, setCarbs] = useState("")
  const [protein, setProtein] = useState("")
  const [fat, setFat] = useState("")
  const [shelfLife, setShelfLife] = useState<number | "">("")
  const [unitWeight, setUnitWeight] = useState<number | "">("")

  // 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (isEditMode && editingFood) {
      setName(editingFood.name)
      setWeight(editingFood.weight)
      setCalories(editingFood.calories)
      setCarbs(editingFood.carbs)
      setProtein(editingFood.protein)
      setFat(editingFood.fat)
      setShelfLife(editingFood.shelfLife === "" ? "" : Number(editingFood.shelfLife))
      setUnitWeight("") // 기존 데이터에 없을 수 있음
    } else {
      // 추가 모드일 때 초기화
      setName("")
      setWeight("")
      setCalories("")
      setCarbs("")
      setProtein("")
      setFat("")
      setShelfLife("")
      setUnitWeight("")
    }
  }, [isEditMode, editingFood, isOpen])

  // 폼 제출 처리
  const handleSubmit = () => {
    onAddFood({
      name,
      weight: Number(weight),
      calories,
      carbs,
      protein,
      fat,
      shelfLife: typeof shelfLife === "number" ? shelfLife : 0,
      unitWeight: typeof unitWeight === "number" ? unitWeight : 0,
    })
  }

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div></div>
          <h2 className="modal-title">{isEditMode ? "식재료 수정하기" : "식재료 등록하기"}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-content">
          <div className="form-group">
            <label className="form-label">재료 이름</label>
            <input
              type="text"
              className="form-input"
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">기준 무게</label>
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
            <label className="form-label">칼로리</label>
            <div className="form-input-with-unit">
              <input
                type="number"
                className="form-input"
                placeholder="0"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
              <span className="unit">kcal</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">탄수화물</label>
            <div className="form-input-with-unit">
              <input
                type="number"
                className="form-input"
                placeholder="0"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
              />
              <span className="unit">g</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">단백질</label>
            <div className="form-input-with-unit">
              <input
                type="number"
                className="form-input"
                placeholder="0"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
              />
              <span className="unit">g</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">지방</label>
            <div className="form-input-with-unit">
              <input
                type="number"
                className="form-input"
                placeholder="0"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
              />
              <span className="unit">g</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">평균 유통기한</label>
            <div className="form-input-with-unit">
            <input
    type="number"
    className="form-input"
    placeholder="0"
    // undefined 대신 "" 을 디폴트로
    value={shelfLife === "" ? "" : shelfLife}
    onChange={(e) => {
      const v = e.currentTarget.value
      setShelfLife(v === "" ? "" : Number(v))
    }}
  />
              <span className="unit">일</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">1개당 무게</label>
            <div className="form-input-with-unit">
              <input
                type="number"
                className="form-input"
                placeholder="0"
                value={unitWeight === "" ? "" : unitWeight}
                   onChange={(e) => {
                       const v = e.currentTarget.value
                       // 숫자로 변환. input이 완전히 비워지면 빈 문자열
                       setUnitWeight(v === "" ? "" : Number(v))
                     }}
              />
              <span className="unit">g</span>
            </div>
          </div>
        </div>
        <div style={{ padding: "20px" }}>
          <button className="submit-button" onClick={handleSubmit} disabled={!name || !weight || !calories}>
            {isEditMode ? "수정하기" : "등록하기"}
          </button>
        </div>
      </div>
    </div>
  )
}
