"use client"

import { LucideRefrigerator, BookOpen, Database } from "lucide-react"
import { useState, useEffect } from "react"
import "../styles/navigation.css"

interface NavigationProps {
  activeTab: "fridge" | "recipe" | "ingredients"
  setActiveTab: (tab: "fridge" | "recipe" | "ingredients") => void
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const [isMobile, setIsMobile] = useState(true)

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

  const iconSize = isMobile ? 24 : 28

  return (
    <div className="nav-container">
      <button onClick={() => setActiveTab("fridge")} className={`nav-button ${activeTab === "fridge" ? "active" : ""}`}>
        <LucideRefrigerator size={iconSize} />
        <span className="nav-label">마이냉장고</span>
      </button>
      <button onClick={() => setActiveTab("recipe")} className={`nav-button ${activeTab === "recipe" ? "active" : ""}`}>
        <BookOpen size={iconSize} />
        <span className="nav-label">레시피북</span>
      </button>
      <button
        onClick={() => setActiveTab("ingredients")}
        className={`nav-button ${activeTab === "ingredients" ? "active" : ""}`}
      >
        <Database size={iconSize} />
        <span className="nav-label">식재료DB</span>
      </button>
    </div>
  )
}
