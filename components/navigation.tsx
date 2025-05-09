"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import "../styles/navigation.css"
import FridgeIcon from "../app/assets/icons/fridge.svg"
import RecipeIcon from "../app/assets/icons/recipe.svg"
import IngredientsIcon from "../app/assets/icons/ingredients.svg"

interface NavigationProps {
  activeTab: "fridge" | "recipe" | "ingredients"
  setActiveTab: (tab: "fridge" | "recipe" | "ingredients") => void
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const [isMobile, setIsMobile] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    // 초기 화면 크기 확인
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

  // Update active tab based on pathname
  useEffect(() => {
    if (pathname === '/add-recipe') {
      setActiveTab('recipe')
    } else if (pathname === '/') {
      setActiveTab('fridge')
    } else if (pathname === '/ingredients') {
      setActiveTab('ingredients')
    }
  }, [pathname, setActiveTab])

  return (
    <div className="nav-container">
      <button onClick={() => setActiveTab("fridge")} className={`nav-button ${activeTab === "fridge" ? "active" : ""}`}>
        <FridgeIcon width={24} height={24} stroke={activeTab === "fridge" ? "#000000" : "#B2B2B2"} />
        <span className="nav-label">마이냉장고</span>
      </button>
      <button onClick={() => setActiveTab("recipe")} className={`nav-button ${activeTab === "recipe" ? "active" : ""}`}>
        <RecipeIcon width={24} height={24} stroke={activeTab === "recipe" ? "#000000" : "#B2B2B2"} />
        <span className="nav-label">레시피북</span>
      </button>
      <button
        onClick={() => setActiveTab("ingredients")}
        className={`nav-button ${activeTab === "ingredients" ? "active" : ""}`}
      >
        <IngredientsIcon width={24} height={24} stroke={activeTab === "ingredients" ? "#000000" : "#B2B2B2"} />
        <span className="nav-label">식재료DB</span>
      </button>
    </div>
  )
}
