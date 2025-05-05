"use client"

import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, MoreVertical } from "lucide-react"
import "../styles/ingredient-db.css"
import "../styles/add-button.css"
import "../styles/dropdown-menu.css"
import AddFoodModal from "./add-food-modal"
import { firebaseApp } from '../lib/firebase'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

// 1) 공통으로 Firestore GET 해서 state 갱신
async function loadFoods(firebaseApp: any, setFoods: React.Dispatch<React.SetStateAction<Food[]>>) {
    const db = getFirestore(firebaseApp)
const colRef = collection(db, 'ingredients')
const snap = await getDocs(colRef)
    const list = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Food,'id'>) }))
    setFoods(list)
  }

  

// 식재료 타입 정의
interface Food {
  id: string
  name: string
  weight: number
  calories: string
  carbs: string
  protein: string
  fat: string
  shelfLife: number
  unitWeight: string
}

export default function IngredientDB() {
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingFood, setEditingFood] = useState<Food | null>(null)

  // 드롭다운 메뉴 상태 관리
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  // 식재료 목록 상태 관리
  const [foods, setFoods] = useState<Food[]>([  ])

// 마운트 시, 그리고 reload 필요할 때(loadFoods 호출)
  useEffect(() => {
    loadFoods(firebaseApp, setFoods)
  }, [])


  async function handleDeleteIngredient(id: string) {
    await fetch("/api/ingredients", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    // 삭제 후 다시 목록 로드
    loadFoods(firebaseApp, setFoods);
  }

  // 드롭다운 메뉴 토글
  const toggleDropdown = (id: string) => {
    if (openDropdownId === id) {
      setOpenDropdownId(null)
    } else {
      setOpenDropdownId(id)
    }
  }

  // 드롭다운 메뉴 닫기
  const closeDropdown = () => {
    setOpenDropdownId(null)
  }

  // 식재료 수정 시작
  const handleEditFood = (food: Food) => {
    setEditingFood(food)
    setIsEditMode(true)
    setIsModalOpen(true)
    closeDropdown()
  }

  // 식재료 삭제
    const handleDeleteFood = async (id: string) => {
        // DELETE API 호출
        await fetch(`/api/ingredients?id=${id}`, { method: 'DELETE' })
        // 리스트 재조회
        loadFoods(firebaseApp, setFoods)
    closeDropdown()
  }

  // 식재료 추가/수정 함수
  const handleAddFood = async (food: {
    name: string
    weight: number
    calories: string
    carbs: string
    protein: string
    fat: string
    shelfLife: number
    unitWeight: number
  }) => {
    if (isEditMode && editingFood) {
            // 수정 모드: PUT 호출
            await fetch(`/api/ingredients?id=${editingFood.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(food),
            })
      const updatedFoods = foods.map((item) => {
        if (item.id === editingFood.id) {
          return {
            ...item,
            name: food.name,
            weight: food.weight,
            calories: food.calories,
            carbs: food.carbs,
            protein: food.protein,
            fat: food.fat,
            shelfLife: food.shelfLife,
          }
        }
        return item
      })
      setFoods(updatedFoods)
    } else {
      // 추가 모드: POST 호출
      await fetch('/api/ingredients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(food),
        })
    }

    // 모달 닫고 리스트 재조회
    setIsModalOpen(false)
    setIsEditMode(false)
    setEditingFood(null)
    loadFoods(firebaseApp, setFoods)
  }

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setIsEditMode(false)
    setEditingFood(null)
  }

  // 새 식재료 추가 모달 열기
  const openAddFoodModal = () => {
    setIsEditMode(false)
    setEditingFood(null)
    setIsModalOpen(true)
  }

  return (
    <div className="page-container">
      <h1 className="page-title">식재료DB</h1>

      <div className="ingredient-list">
        {foods.map((food) => (
          <div className="ingredient-card" key={food.id}>
            <div className="ingredient-content">
              <div className="ingredient-header">
                <h2 className="ingredient-title">{food.name}</h2>
                <div className="dropdown-container">
                  <button className="options-button" onClick={() => toggleDropdown(food.id)}>
                    <MoreVertical size={20} />
                  </button>
                  {openDropdownId === food.id && (
                    <>
                      <div className="dropdown-overlay" onClick={closeDropdown}></div>
                      <div className="dropdown-menu">
                        <div className="dropdown-item edit" onClick={() => handleEditFood(food)}>
                          <Edit size={16} />
                          수정
                        </div>
                        
                        <div className="dropdown-item delete" onClick={() => handleDeleteFood(food.id)}>
                          <Trash2 size={16} />
                          삭제
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="nutrition-info">
                <span>{food.calories}Kcal</span>
                <span>탄 {food.carbs}g</span>
                <span>단 {food.protein}g</span>
                <span>지 {food.fat}g</span>
                <span className="shelf-life">{food.shelfLife}일</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="add-button-container">
        <button className="add-button" onClick={openAddFoodModal}>
          <Plus size={20} />
          식재료 등록하기
        </button>
      </div>

      <AddFoodModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddFood={handleAddFood}
        isEditMode={isEditMode}
            editingFood={
                editingFood
                  ? {
                      // 반드시 AddFoodModal의 Food 인터페이스와 똑같이 필드 타입을 string으로 맞춰줘야 합니다
          id:            editingFood.id,
          name:          editingFood.name,
          weight:        editingFood.weight.toString(),
          calories:      editingFood.calories,
          carbs:         editingFood.carbs,
          protein:       editingFood.protein,
          fat:           editingFood.fat,
          shelfLife: editingFood.shelfLife?.toString() ?? ""
                    }
                  : null
              }
      />
    </div>
  )
}
