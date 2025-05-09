"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Search, Trash2 } from "lucide-react"
import "../styles/add-recipe-modal.css"
import IngredientSearchSheet from "./ingredient-search-sheet"
import { Recipe, Ingredient } from "../src/services/recipeService"

interface AddRecipeModalProps {
  isOpen: boolean
  onClose: () => void
  onAddRecipe: (recipe: {
    name: string
    ingredients: Ingredient[]
    description: string
    instagramLinks: string[]
    youtubeLink: string
    image?: string
  }) => void
  isEditMode?: boolean
  editingRecipe?: Recipe | null
}

export default function AddRecipeModal({
  isOpen,
  onClose,
  onAddRecipe,
  isEditMode = false,
  editingRecipe = null,
}: AddRecipeModalProps) {
  const [name, setName] = useState("")
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [description, setDescription] = useState("")
  const [instagramLink1, setInstagramLink1] = useState("")
  const [youtubeLink, setYoutubeLink] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [isIngredientSearchOpen, setIsIngredientSearchOpen] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (isEditMode && editingRecipe) {
      setName(editingRecipe.name)
      setIngredients(editingRecipe.ingredients)
      setDescription(editingRecipe.description || "")

      // Instagram 링크 설정
      if (editingRecipe.instagramLinks && editingRecipe.instagramLinks.length > 0) {
        setInstagramLink1(editingRecipe.instagramLinks[0] || "")
      } else {
        setInstagramLink1("")
      }

      // YouTube 링크 설정
      setYoutubeLink(editingRecipe.youtubeLink || "")

      // 이미지 설정
      setImage(editingRecipe.image || null)
    } else {
      // 추가 모드일 때 초기화
      setName("")
      setIngredients([])
      setDescription("")
      setInstagramLink1("")
      setYoutubeLink("")
      setImage(null)
    }
  }, [isEditMode, editingRecipe, isOpen])

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

  // 이미지 제거 버튼 추가
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
  const handleSubmit = () => {
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
    }

    onAddRecipe(recipeData)
  }

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div></div>
          <h2 className="modal-title">{isEditMode ? "레시피 수정하기" : "레시피 추가하기"}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
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
                    <span className="ingredient-name">{ingredient.name}</span>
                    <span className="ingredient-calories">
                      {ingredient.weight}g | {ingredient.calories}
                    </span>
                  </div>
                  <button className="delete-ingredient" onClick={() => handleDeleteIngredient(ingredient.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <h3 className="section-subtitle">선택 입력</h3>

          <div className="form-group">
            <label className="form-label">상세설명</label>
            <textarea
              className="form-input"
              placeholder="설명을 입력해주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ height: "100px", resize: "none" }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">instagram 링크</label>
            <input
              type="text"
              className="form-input"
              placeholder="링크를 붙여넣어주세요"
              value={instagramLink1}
              onChange={(e) => setInstagramLink1(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">YouTube 링크</label>
            <input
              type="text"
              className="form-input"
              placeholder="링크를 붙여넣어주세요"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
            />
          </div>
        </div>
        <div style={{ padding: "20px" }}>
          <button className="submit-button" onClick={handleSubmit} disabled={!name || ingredients.length === 0}>
            {isEditMode ? "수정하기" : "추가하기"}
          </button>
        </div>

        <IngredientSearchSheet
          isOpen={isIngredientSearchOpen}
          onClose={() => setIsIngredientSearchOpen(false)}
          onAddIngredient={handleAddIngredient}
        />
      </div>
    </div>
  )
}
