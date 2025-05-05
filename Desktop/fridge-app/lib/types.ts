// lib/types.ts
export interface Food {
    id: string
    name: string
    weight: number        // 숫자 하나로 통일
    calories: number      // 숫자면 숫자, 문자열이면 문자열. 둘 중 하나로 통일하세요.
    carbs: number
    protein: number
    fat: number
    shelfLife: number
    unitWeight: number
  }
  