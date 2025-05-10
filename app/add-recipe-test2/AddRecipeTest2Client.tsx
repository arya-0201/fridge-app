"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { X, Search, Trash2 } from "lucide-react"
import "../../styles/add-recipe-test2.css"
import "../../styles/add-recipe-modal.css"
import IngredientSearchSheet from "../../components/ingredient-search-sheet"
import { Recipe, Ingredient, addRecipe, updateRecipe, getRecipe } from "../../src/services/recipeService"

export default function AddRecipeTest2Client() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEditMode = searchParams.get('edit') === 'true'
  const recipeId = searchParams.get('id')

  const [name, setName] = useState("")
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [description, setDescription] = useState("")
  const [instagramLink1, setInstagramLink1] = useState("")
  const [youtubeLink, setYoutubeLink] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [isIngredientSearchOpen, setIsIngredientSearchOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load recipe data in edit mode
  useEffect(() => {
    const loadRecipe = async () => {
      if (isEditMode && recipeId) {
        try {
          const recipe = await getRecipe(recipeId)
          if (recipe) {
            setName(recipe.name)
            setIngredients(recipe.ingredients)
            setDescription(recipe.description || "")
            setInstagramLink1(recipe.instagramLinks?.[0] || "")
            setYoutubeLink(recipe.youtubeLink || "")
            setImage(recipe.image || null)
          }
        } catch (error) {
          console.error('Error loading recipe:', error)
        }
      }
    }
    loadRecipe()
  }, [isEditMode, recipeId])

  // 이미지 업로드 처리
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // 이미지 업로드 버튼 클릭
  const handleImageButtonClick = () => {
    fileInputRef.current?.click()
  }

  // 이미지 제거
  const handleRemoveImage = () => {
    setImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // 재료 검색 바텀시트 열기
  const openIngredientSearch = () => {
    setIsIngredientSearchOpen(true)
  }

  // 재료 추가
  const handleAddIngredient = (ingredient: { name: string; weight: string; calories: string }) => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: ingredient.name,
      calories: ingredient.calories,
      weight: ingredient.weight,
    }
    setIngredients([...ingredients, newIngredient])
  }

  // 재료 삭제
  const handleDeleteIngredient = (id: string) => {
    setIngredients(ingredients.filter((ingredient) => ingredient.id !== id))
  }

  // 폼 제출 처리
  const handleSubmit = async () => {
    try {
      // Filter out empty links and ensure we always have an array
      const instagramLinks = [instagramLink1]
        .filter((link) => link.trim() !== "")
        .map((link) => link.trim())

      // Create the recipe object with default values for optional fields
      const recipeData = {
        name,
        ingredients,
        description: description.trim() || "",
        instagramLinks: instagramLinks.length > 0 ? instagramLinks : [],
        youtubeLink: youtubeLink.trim() || "",
        image: image || "",
        status: "saved" as const,
      }

      if (isEditMode && recipeId) {
        await updateRecipe(recipeId, recipeData)
      } else {
        await addRecipe(recipeData)
      }
      router.back()
    } catch (error) {
      console.error("Error saving recipe:", error)
    }
  }

  return (
    <div className="page-container">
      <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="w-6"></div> {/* Spacer for centering */}
          <h1 className="text-lg font-semibold">
            {isEditMode ? "레시피 수정하기" : "레시피추가하기 테스트2"}
          </h1>
          <button 
            onClick={() => router.back()}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="modal-content">
        <div className="image-upload-area">
          {image ? (
            <div className="image-preview-container">
              <img src={image || "/placeholder.svg"} alt="Recipe preview" className="recipe-image-preview" />
              <button className="remove-image-button" onClick={handleRemoveImage}>
                <Trash2 size={20} />
              </button>
            </div>
          ) : (
            <button className="image-upload-button" onClick={handleImageButtonClick}>
              이미지 추가
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </div>
        <div className="modal-body-group">

        <h3 className="section-title">필수 입력</h3>

<div className="form-group">
  <label className="form-label">레시피 이름</label>
  <input
    type="text"
    className="form-input"
    placeholder="이름을 입력해주세요"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
</div>

<div className="form-group">
  <label className="form-label">재료 검색</label>
  <div className="form-input-with-icon" onClick={openIngredientSearch}>
    <Search className="icon" size={24} color="#6b7280" />
    <input type="text" className="form-input" placeholder="재료명을 입력해주세요" readOnly value="" />
  </div>
</div>

{ingredients.length > 0 && (
  <div className="ingredients-list">
    {ingredients.map((ingredient) => (
      <div key={ingredient.id} className="ingredient-item">
        <div className="ingredient-info">
          <span className="ingredient-name">
            {ingredient.name}
            <span className="ingredient-calories">{ingredient.calories}Kcal</span>
          </span>
        </div>
        <span>{ingredient.weight}g</span>
        <button className="delete-ingredient" onClick={() => handleDeleteIngredient(ingredient.id)}>
          <Trash2 size={16} />
        </button>
      </div>
    ))}
  </div>
)}

<div className="form-group">
  <label className="form-label">설명</label>
  <textarea
    className="form-input"
    placeholder="설명을 입력해주세요"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    rows={4}
  />
</div>

<h3 className="section-title mt-6">선택 입력</h3>

<div className="form-group">
  <label className="form-label">인스타그램 링크</label>
  <input
    type="text"
    className="form-input"
    placeholder="링크를 입력해주세요"
    value={instagramLink1}
    onChange={(e) => setInstagramLink1(e.target.value)}
  />
</div>

<div className="form-group">
  <label className="form-label">유튜브 링크</label>
  <input
    type="text"
    className="form-input"
    placeholder="링크를 입력해주세요"
    value={youtubeLink}
    onChange={(e) => setYoutubeLink(e.target.value)}
  />
</div>

<div className="submit-button-container">
  <button
    className="submit-button"
    onClick={handleSubmit}
    disabled={!name || ingredients.length === 0}
  >
    저장
  </button>
</div>
        </div>

      </div>

      <IngredientSearchSheet
        isOpen={isIngredientSearchOpen}
        onClose={() => setIsIngredientSearchOpen(false)}
        onAddIngredient={handleAddIngredient}
      />
    </div>
  )
} 