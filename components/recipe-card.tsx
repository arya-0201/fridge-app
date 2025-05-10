"use client"

import { useEffect, useState } from "react"
import { MoreVertical, Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Recipe, Ingredient } from "../src/services/recipeService"
import { FridgeItem, getFridgeItems } from "../src/services/fridgeService"

interface RecipeCardProps {
  recipe: Recipe
  onDelete: (id: string, e: React.MouseEvent) => void
  onViewDetail: (recipe: Recipe) => void
  isDropdownOpen: boolean
  onToggleDropdown: (id: string, e: React.MouseEvent) => void
}

export default function RecipeCard({
  recipe,
  onDelete,
  onViewDetail,
  isDropdownOpen,
  onToggleDropdown,
}: RecipeCardProps) {
  const router = useRouter()
  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>([])

  // Load fridge items on mount
  useEffect(() => {
    const loadFridgeItems = async () => {
      try {
        const items = await getFridgeItems()
        setFridgeItems(items)
      } catch (error) {
        console.error('Error loading fridge items:', error)
      }
    }
    loadFridgeItems()
  }, [])

  // Calculate missing ingredients
  const missingIngredients = recipe.ingredients.filter(
    ingredient => !fridgeItems.some(item => item.name === ingredient.name)
  )

  // Determine badge text and class based on missing ingredients
  const getBadgeInfo = () => {
    if (recipe.ingredients.length === 1 && missingIngredients.length === 1) {
      return {
        text: "재료가 없어요",
        className: "provided"
      }
    } else if (missingIngredients.length === 0) {
      return {
        text: "지금 만들수있어요",
        className: "saved"
      }
    } else if (missingIngredients.length === 1) {
      return {
        text: "딱!하나 모자라요",
        className: "eat"
      }
    } else {
      return {
        text: "재료가 없어요",
        className: "provided"
      }
    }
  }

  const badgeInfo = getBadgeInfo()

  // Calculate nutrition info (placeholder for now)
  const calculateNutrition = () => {
    return {
      calories: "360Kcal",
      carbs: "30g",
      protein: "30g",
      fat: "30g",
    }
  }

  // Generate recipe tags
  const getRecipeTags = (ingredients: Ingredient[]) => {
    return ingredients.map((ingredient) => (
      <span key={ingredient.id} className="recipe-tag-item">
        #{ingredient.name}
      </span>
    ))
  }

  return (
    <div className="recipe-card">
      <div className="recipe-content">
        <div className="recipe-header">
          <span className={`recipe-tag ${badgeInfo.className}`}>
            {badgeInfo.text}
          </span>
          <div className="dropdown-container">
            <button className="options-button" onClick={(e) => onToggleDropdown(recipe.id!, e)}>
              <MoreVertical size={20} />
            </button>
            {isDropdownOpen && (
              <>
                <div className="dropdown-overlay" onClick={(e) => onToggleDropdown(recipe.id!, e)}></div>
                <div className="dropdown-menu">
                  <div 
                    className="dropdown-item edit" 
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/add-recipe-test2?edit=true&id=${recipe.id}`)
                    }}
                  >
                    <Edit size={16} />
                    수정
                  </div>
                  <div className="dropdown-item delete" onClick={(e) => onDelete(recipe.id!, e)}>
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
        <button className="recipe-link" onClick={() => onViewDetail(recipe)}>
          레시피 자세히 보기 &gt;
        </button>
      </div>
    </div>
  )
} 