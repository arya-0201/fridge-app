"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import "../styles/recipe-book.css"
import "../styles/add-button.css"
import "../styles/dropdown-menu.css"
import RecipeDetailSheet from "./recipe-detail-sheet"
import RecipeCard from "./recipe-card"
import AddRecipeModal from "./add-recipe-modal"
import { Recipe, subscribeToRecipes, deleteRecipe, updateRecipe, addRecipe, Ingredient } from "../src/services/recipeService"

export default function RecipeBook() {
  const router = useRouter()
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false)
  const [isAddRecipeModalOpen, setIsAddRecipeModalOpen] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)

  // Reset scroll position on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Firestore 구독 설정
  useEffect(() => {
    const unsubscribe = subscribeToRecipes((updatedRecipes) => {
      setRecipes(updatedRecipes)
    })

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe()
  }, [])

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
    setIsAddRecipeModalOpen(true)
    closeDropdown()
  }

  // 레시피 삭제
  const handleDeleteRecipe = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // 이벤트 버블링 방지
    try {
      await deleteRecipe(id)
      closeDropdown()
    } catch (error) {
      console.error('Error deleting recipe:', error)
    }
  }

  // 레시피 추가 모달 열기
  const openAddRecipeModal = () => {
    setEditingRecipe(null)
    setIsAddRecipeModalOpen(true)
  }

  // 레시피 상세 보기 함수
  const handleViewRecipeDetail = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setIsDetailSheetOpen(true)
  }

  // 레시피 추가/수정 처리
  const handleAddRecipe = async (recipeData: {
    name: string
    ingredients: Ingredient[]
    description: string
    instagramLinks: string[]
    youtubeLink: string
    image?: string
  }) => {
    try {
      if (editingRecipe?.id) {
        await updateRecipe(editingRecipe.id, recipeData)
      } else {
        await addRecipe({
          ...recipeData,
          status: "saved",
        })
      }
      setIsAddRecipeModalOpen(false)
    } catch (error) {
      console.error("Error saving recipe:", error)
    }
  }

  return (
    <div className="page-container">
      <header className="h-8 flex items-center justify-between mb-4 sm:mb-6">
        <h1 className="page-title">레시피북</h1>
      </header>

      <div className="recipe-list">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onEdit={handleEditRecipe}
            onDelete={handleDeleteRecipe}
            onViewDetail={handleViewRecipeDetail}
            isDropdownOpen={openDropdownId === recipe.id}
            onToggleDropdown={toggleDropdown}
          />
        ))}
      </div>

      <div className="add-button-container">
        <button className="add-button" onClick={openAddRecipeModal}>
          <Plus size={20} />
          레시피 추가하기
        </button>
      </div>

      <RecipeDetailSheet
        isOpen={isDetailSheetOpen}
        onClose={() => setIsDetailSheetOpen(false)}
        recipe={selectedRecipe}
      />

      <AddRecipeModal
        isOpen={isAddRecipeModalOpen}
        onClose={() => setIsAddRecipeModalOpen(false)}
        onAddRecipe={handleAddRecipe}
        isEditMode={!!editingRecipe}
        editingRecipe={editingRecipe}
      />
    </div>
  )
}
