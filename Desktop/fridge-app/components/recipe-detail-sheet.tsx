"use client"

import { useEffect, useRef, useState } from "react"
import { X, Instagram, Youtube, ChevronRight } from "lucide-react"
import "../styles/recipe-detail-sheet.css"
import { firebaseApp } from '../lib/firebase'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

interface Ingredient {
  id: string
  name: string
  calories: string
  weight?: string
}

interface RecipeDetailSheetProps {
  isOpen: boolean
  onClose: () => void
  recipe: {
    id: string
    name: string
    ingredients: Ingredient[]
    description?: string
    instagramLinks?: string[]
    youtubeLinks?: string[]
    image?: string
  } | null
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

        {recipe.image && <img src={recipe.image || "/placeholder.svg"} alt={recipe.name} className="recipe-image" />}

        <div className="sheet-content">
          <h3 className="section-title">재료</h3>
          <div className="ingredients-list">
            {recipe.ingredients.map((ingredient) => (
              <div key={ingredient.id} className="ingredient-item">
                <div className="ingredient-name">{ingredient.name}</div>
                <div className="ingredient-info">
                  {ingredient.weight || "180g"} | {ingredient.calories}
                </div>
              </div>
            ))}
          </div>

          {recipe.description && (
            <>
              <h3 className="section-title">상세설명</h3>
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

          {recipe.youtubeLinks && recipe.youtubeLinks.length > 0 && (
            <button className="link-button youtube" onClick={() => openLink(recipe.youtubeLinks![0])}>
              <div className="link-icon">
                <Youtube size={isMobile ? 18 : 20} />
                <span>Youtube 링크 바로가기</span>
              </div>
              <ChevronRight size={isMobile ? 18 : 20} className="chevron-icon" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
