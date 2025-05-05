"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { firebaseApp } from '../lib/firebase'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { Plus, Edit, Trash2, MoreVertical } from "lucide-react"
import "../styles/recipe-book.css"
import "../styles/add-button.css"
import "../styles/dropdown-menu.css"
import AddRecipeModal from "./add-recipe-modal"
import RecipeDetailSheet from "./recipe-detail-sheet"

interface Ingredient {
  id: string
  name: string
  calories: string
  weight?: string
}

interface Recipe {
  id: string
  name: string
  ingredients: Ingredient[]
  description?: string
  instagramLinks?: string[]
  youtubeLinks?: string[]
  image?: string
  status: "saved" | "eat" | "provided"
}

export default function RecipeBook() {
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)

  // 드롭다운 메뉴 상태 관리
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  // 레시피 목록 상태 관리
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: "1",
      name: "토마토달걀새우볶음",
      ingredients: [
        { id: "1", name: "토마토", calories: "30kcal", weight: "180g" },
        { id: "2", name: "달걀", calories: "70kcal", weight: "180g" },
        { id: "3", name: "새우", calories: "85kcal", weight: "180g" },
      ],
      description:
        "설탕3스푼, 진간장1스푼, 고추가루2.5스푼, 고추장 2.5스푼, 생수2스푼, 후추톡톡 ,통깨톡톡 이레시피 대로만 양념준비해서 넣는다면 정말 실패할일 없다고 장담합니다 ㅋㅋㅋ (하지만, 개인적인 입맛차이는 있으니 태클금지) 양념장을 만들어 준비해둡니다",
      instagramLinks: ["https://www.instagram.com/feb_first_/saved/_/17959799456748021/"],
      youtubeLinks: ["https://www.youtube.com/watch?v=example"],
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dtvvgeJuGkWh1haNpxQeWl4z2kwjGJ.png",
      status: "saved",
    },
    {
      id: "2",
      name: "야채 머너스프",
      ingredients: [
        { id: "1", name: "토마토", calories: "30kcal", weight: "180g" },
        { id: "2", name: "냉동야채", calories: "45kcal", weight: "180g" },
        { id: "3", name: "닭가슴살", calories: "120kcal", weight: "180g" },
        { id: "4", name: "양배추", calories: "25kcal", weight: "180g" },
        { id: "5", name: "디벨라토마토퓨레", calories: "40kcal", weight: "180g" },
      ],
      status: "eat",
    },
    {
      id: "3",
      name: "참치오두비",
      ingredients: [
        { id: "1", name: "참치", calories: "120kcal", weight: "180g" },
        { id: "2", name: "오이", calories: "15kcal", weight: "180g" },
        { id: "3", name: "두부", calories: "80kcal", weight: "180g" },
        { id: "4", name: "참기름", calories: "120kcal", weight: "180g" },
        { id: "5", name: "디벨라토마토퓨레", calories: "40kcal", weight: "180g" },
      ],
      status: "provided",
    },
  ])

  // 드롭다운 메뉴 토글
  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // 이벤트 버블링 방지
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

  // 레시피 수정 시작
  const handleEditRecipe = (recipe: Recipe, e: React.MouseEvent) => {
    e.stopPropagation() // 이벤트 버블링 방지
    setEditingRecipe(recipe)
    setIsEditMode(true)
    setIsModalOpen(true)
    closeDropdown()
  }

  // 레시피 삭제
  const handleDeleteRecipe = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // 이벤트 버블링 방지
    setRecipes(recipes.filter((recipe) => recipe.id !== id))
    closeDropdown()
  }

  // 레시피 추가 모달을 열 때 상세 보기 바텀시트가 닫히도록 합니다
  const openAddRecipeModal = () => {
    setIsEditMode(false)
    setEditingRecipe(null)
    setIsModalOpen(true)
    setIsDetailSheetOpen(false)
  }

  // 레시피 추가/수정 함수
  const handleAddRecipe = (recipe: {
    name: string
    ingredients: Ingredient[]
    description: string
    instagramLinks: string[]
    image?: string
  }) => {
    if (isEditMode && editingRecipe) {
      // 수정 모드: 기존 레시피 업데이트
      const updatedRecipes = recipes.map((item) => {
        if (item.id === editingRecipe.id) {
          return {
            ...item,
            name: recipe.name,
            ingredients: recipe.ingredients,
            description: recipe.description,
            instagramLinks: recipe.instagramLinks.length > 0 ? recipe.instagramLinks : undefined,
            image: recipe.image || item.image,
          }
        }
        return item
      })
      setRecipes(updatedRecipes)
    } else {
      // 추가 모드: 새 레시피 객체 생성
      const newRecipe: Recipe = {
        id: Date.now().toString(),
        name: recipe.name,
        ingredients: recipe.ingredients,
        description: recipe.description,
        instagramLinks: recipe.instagramLinks.length > 0 ? recipe.instagramLinks : undefined,
        image: recipe.image,
        status: "saved", // 기본 상태는 저장됨
      }

      // 레시피 목록에 추가
      setRecipes([newRecipe, ...recipes])
    }

    // 모달 닫기 및 상태 초기화
    setIsModalOpen(false)
    setIsEditMode(false)
    setEditingRecipe(null)
  }

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setIsEditMode(false)
    setEditingRecipe(null)
  }

  // 레시피 상세 보기 함수
  const handleViewRecipeDetail = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setIsDetailSheetOpen(true)
    // 레시피 추가하기 모달이 열려있다면 닫습니다
    setIsModalOpen(false)
  }

  // 레시피 태그 생성 함수
  const getRecipeTags = (ingredients: Ingredient[]) => {
    return ingredients.map((ingredient) => (
      <span key={ingredient.id} className="recipe-tag-item">
        #{ingredient.name}
      </span>
    ))
  }

  // 레시피 영양 정보 계산 함수
  const calculateNutrition = () => {
    return {
      calories: "360Kcal",
      carbs: "30g",
      protein: "30g",
      fat: "30g",
    }
  }

  return (
    <div className="page-container">
      <h1 className="page-title">레시피북</h1>

      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div className="recipe-card" key={recipe.id}>
            <div className="recipe-content">
              <div className="recipe-header">
                <span className={`recipe-tag ${recipe.status}`}>
                  {recipe.status === "saved" && "저장됐습니다"}
                  {recipe.status === "eat" && "먹어나오자요"}
                  {recipe.status === "provided" && "제공기억이요"}
                </span>
                <div className="dropdown-container">
                  <button className="options-button" onClick={(e) => toggleDropdown(recipe.id, e)}>
                    <MoreVertical size={20} />
                  </button>
                  {openDropdownId === recipe.id && (
                    <>
                      <div className="dropdown-overlay" onClick={closeDropdown}></div>
                      <div className="dropdown-menu">
                        <div className="dropdown-item edit" onClick={(e) => handleEditRecipe(recipe, e)}>
                          <Edit size={16} />
                          수정
                        </div>
                        <div className="dropdown-item delete" onClick={(e) => handleDeleteRecipe(recipe.id, e)}>
                          <Trash2 size={16} />
                          삭제
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <h2 className="recipe-title">{recipe.name}</h2>
              <div className="nutrition-info">
                <span>{calculateNutrition().calories}</span>
                <span>탄 {calculateNutrition().carbs}</span>
                <span>단 {calculateNutrition().protein}</span>
                <span>지 {calculateNutrition().fat}</span>
              </div>
              <div className="recipe-tags">{getRecipeTags(recipe.ingredients)}</div>
              <button className="recipe-link" onClick={() => handleViewRecipeDetail(recipe)}>
                레시피 자세히 보기 &gt;
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="add-button-container">
        <button className="add-button" onClick={openAddRecipeModal}>
          <Plus size={20} />
          레시피 추가하기
        </button>
      </div>

      <AddRecipeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddRecipe={handleAddRecipe}
        isEditMode={isEditMode}
        editingRecipe={editingRecipe}
      />
      <RecipeDetailSheet
        isOpen={isDetailSheetOpen}
        onClose={() => setIsDetailSheetOpen(false)}
        recipe={selectedRecipe}
      />
    </div>
  )
}
