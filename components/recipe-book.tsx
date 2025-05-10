"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import "../styles/recipe-book.css"
import "../styles/add-button.css"
import "../styles/dropdown-menu.css"
import RecipeDetailSheet from "./recipe-detail-sheet"
import RecipeCard from "./recipe-card"
import { Recipe } from "../src/services/recipeService"

export default function RecipeBook() {
  const router = useRouter()
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [recipes, setRecipes] = useState<Recipe[]>([])

  // Reset scroll position on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Fetch recipes from API
  useEffect(() => {
    const fetchRecipes = async () => {
      const res = await fetch("/api/recipes")
      if (res.ok) {
        const data = await res.json()
        setRecipes(data)
      }
    }
    fetchRecipes()
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

  // 레시피 삭제
  const handleDeleteRecipe = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // 이벤트 버블링 방지
    try {
      await fetch(`/api/recipes/${id}`, { method: "DELETE" })
      setRecipes(recipes.filter(recipe => recipe.id !== id))
      closeDropdown()
    } catch (error) {
      console.error('Error deleting recipe:', error)
    }
  }

  // 레시피 상세 보기 함수
  const handleViewRecipeDetail = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setIsDetailSheetOpen(true)
  }

  return (
    <div className="recipe-book-container">
      <div className="header">
        <h1 className="title">레시피북</h1>
        <button className="add-button" onClick={() => router.push("/add-recipe-test2")}> <Plus size={20} /> 레시피 추가하기 </button>
      </div>
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onDelete={handleDeleteRecipe}
            onViewDetail={handleViewRecipeDetail}
            isDropdownOpen={openDropdownId === recipe.id}
            onToggleDropdown={toggleDropdown}
          />
        ))}
      </div>
      <RecipeDetailSheet
        isOpen={isDetailSheetOpen}
        onClose={() => setIsDetailSheetOpen(false)}
        recipe={selectedRecipe}
      />
    </div>
  )
}
