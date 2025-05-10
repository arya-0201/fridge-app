import React from "react"

interface IngredientAddSheetProps {
  isOpen: boolean
  onClose: () => void
  onAddSingle: () => void
  onExcelUpload: () => void
  onDownloadSample: () => void
}

export default function IngredientAddSheet({
  isOpen,
  onClose,
  onAddSingle,
  onExcelUpload,
  onDownloadSample,
}: IngredientAddSheetProps) {
  if (!isOpen) return null

  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <ul className="sheet-menu">
          <li className="sheet-menu-item" onClick={onAddSingle}>
            <span className="sheet-menu-icon">＋</span>
            하나씩 등록
          </li>
          <li className="sheet-menu-item" onClick={onExcelUpload}>
            <span className="sheet-menu-icon">📄</span>
            엑셀로 일괄 등록
          </li>
          <li className="sheet-menu-item" onClick={onDownloadSample}>
            <span className="sheet-menu-icon">⬇️</span>
            샘플 파일 받기
          </li>
        </ul>
      </div>
      <style jsx>{`
        .bottom-sheet-overlay {
          position: fixed;
          left: 0; right: 0; bottom: 0; top: 0;
          background: rgba(0,0,0,0.2);
          z-index: 1000;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .bottom-sheet {
          background: #fff;
          width: 100%;
          max-width: 480px;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
          box-shadow: 0 -2px 16px rgba(0,0,0,0.08);
          padding-bottom: env(safe-area-inset-bottom, 16px);
          animation: slideUp 0.2s;
        }
        .sheet-handle {
          width: 40px;
          height: 5px;
          background: #e5e5e5;
          border-radius: 3px;
          margin: 12px auto 16px auto;
        }
        .sheet-menu {
          list-style: none;
          margin: 0;
          padding: 0 0 16px 0;
        }
        .sheet-menu-item {
          display: flex;
          align-items: center;
          font-size: 18px;
          font-weight: 500;
          padding: 18px 24px;
          cursor: pointer;
          border-bottom: 1px solid #f3f4f6;
          transition: background 0.1s;
        }
        .sheet-menu-item:last-child {
          border-bottom: none;
        }
        .sheet-menu-item:hover {
          background: #f7f7f7;
        }
        .sheet-menu-icon {
          font-size: 22px;
          margin-right: 16px;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
} 