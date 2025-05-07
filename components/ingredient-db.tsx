"use client"

import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, MoreVertical } from "lucide-react"
import "../styles/ingredient-db.css"
import "../styles/add-button.css"
import "../styles/dropdown-menu.css"
import AddFoodModal from "./add-food-modal"
import { Ingredient, getIngredients, addIngredient, updateIngredient, deleteIngredient } from "../src/services/ingredientService"

export default function IngredientDB() {
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingFood, setEditingFood] = useState<Ingredient | null>(null)

  // 드롭다운 메뉴 상태 관리
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  // 식재료 목록 상태 관리
  const [foods, setFoods] = useState<Ingredient[]>([])

  // 초기 데이터 로드
  useEffect(() => {
    const loadFoods = async () => {
      try {
        const items = await getIngredients()
        setFoods(items)
      } catch (error) {
        console.error('Error loading ingredients:', error)
      }
    }
    loadFoods()
  }, [])

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
  const handleEditFood = (food: Ingredient) => {
    setEditingFood(food)
    setIsEditMode(true)
    setIsModalOpen(true)
    closeDropdown()
  }

  // 식재료 삭제
  const handleDeleteFood = async (id: string) => {
    try {
      await deleteIngredient(id)
      setFoods(foods.filter(food => food.id !== id))
      closeDropdown()
    } catch (error) {
      console.error('Error deleting ingredient:', error)
    }
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
    try {
      if (isEditMode && editingFood) {
        // 수정 모드
        await updateIngredient(editingFood.id!, {
          name: food.name,
          weight: food.weight,
          calories: food.calories,
          carbs: food.carbs,
          protein: food.protein,
          fat: food.fat,
          shelfLife: food.shelfLife,
          unitWeight: food.unitWeight.toString()
        })
        
        // 로컬 상태 업데이트
        setFoods(foods.map(item => 
          item.id === editingFood.id 
            ? { ...item, ...food, unitWeight: food.unitWeight.toString() }
            : item
        ))
      } else {
        // 추가 모드
        const newIngredient = await addIngredient({
          name: food.name,
          weight: food.weight,
          calories: food.calories,
          carbs: food.carbs,
          protein: food.protein,
          fat: food.fat,
          shelfLife: food.shelfLife,
          unitWeight: food.unitWeight.toString()
        })
        
        // 로컬 상태 업데이트
        setFoods([newIngredient, ...foods])
      }

      // 모달 닫기
      setIsModalOpen(false)
      setIsEditMode(false)
      setEditingFood(null)
    } catch (error) {
      console.error('Error saving ingredient:', error)
    }
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
                  <button className="options-button" onClick={() => toggleDropdown(food.id!)}>
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
                        
                        <div className="dropdown-item delete" onClick={() => handleDeleteFood(food.id!)}>
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
        editingFood={editingFood}
      />
    </div>
  )
}
