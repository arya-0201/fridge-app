"use client"

import { useEffect, useRef, useState } from "react"
import { X, Instagram, Youtube, ChevronRight } from "lucide-react"
import "../styles/recipe-detail-sheet.css"
import { Recipe, Ingredient } from "../src/services/recipeService"

interface RecipeDetailSheetProps {
  isOpen: boolean
  onClose: () => void
  recipe: Recipe | null
}

export default function RecipeDetailSheet({ isOpen, onClose, recipe }: RecipeDetailSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(true)

  // 화면 크기 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 430)
    }

    // 초기 실행
    checkMobile()

    // 화면 크기 변경 시 확인
    window.addEventListener("resize", checkMobile)

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // ESC 키 누를 때 닫기
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  // useEffect 훅을 추가하여 바텀시트가 열릴 때 다른 모달이 닫히도록 합니다
  useEffect(() => {
    if (isOpen) {
      // 바텀시트가 열릴 때 body 스크롤 방지
      document.body.style.overflow = "hidden"
    } else {
      // 바텀시트가 닫힐 때 body 스크롤 복원
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // 모달이 닫혀있거나 레시피가 없으면 렌더링하지 않음
  if (!isOpen || !recipe) return null

  // 링크 열기
  const openLink = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <div className="bottom-sheet-overlay">
      <div className="bottom-sheet" ref={sheetRef}>
        <div className="sheet-header">
          <h2 className="sheet-title">{recipe.name}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={isMobile ? 20 : 24} />
          </button>
        </div>

        <img 
          src={recipe.image || "/images/recipes/default-recipe.png"} 
          alt={recipe.name} 
          className="recipe-image" 
        />

        <div className="sheet-content">
          <h3 className="section-title text-[16px] mb-2">재료</h3>
          <div className="ingredients-list">
            {recipe.ingredients.map((ingredient) => (
              <div key={ingredient.id} className="ingredient-item relative ipad:px-0">
                <div className="ingredient-name block pr-0 ipad:text-[20px]">{ingredient.name}</div>
                <div className="ingredient-info absolute top-0 right-0">
                  {ingredient.weight ? `${ingredient.weight}g` : "180g"} | {ingredient.calories}kcal
                </div>
              </div>
            ))}
          </div>

          {recipe.description && (
            <>
              <h3 className="section-title text-[16px] mb-2 description-title">상세설명</h3>
              <div className="description-box">{recipe.description}</div>
            </>
          )}

          {recipe.instagramLinks && recipe.instagramLinks.length > 0 && (
            <button className="link-button instagram" onClick={() => openLink(recipe.instagramLinks![0])}>
              <div className="link-icon">
                <Instagram size={isMobile ? 18 : 20} />
                <span>Instagram 링크 바로가기</span>
              </div>
              <ChevronRight size={isMobile ? 18 : 20} className="chevron-icon" />
            </button>
          )}

          {recipe.youtubeLink && recipe.youtubeLink.trim() !== "" && (
            <button className="link-button youtube" onClick={() => openLink(recipe.youtubeLink!.trim())}>
              <div className="link-icon">
                <Youtube size={isMobile ? 18 : 20} />
                <span>유튜브 링크 바로가기</span>
              </div>
              <ChevronRight size={isMobile ? 18 : 20} className="chevron-icon" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
