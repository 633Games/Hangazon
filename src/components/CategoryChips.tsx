import { CATEGORIES, type CategoryFilter } from '../data/products'

type Props = {
  value: CategoryFilter
  onChange: (v: CategoryFilter) => void
}

export function CategoryChips({ value, onChange }: Props) {
  const options: CategoryFilter[] = ['All', ...CATEGORIES]
  return (
    <div className="cats" role="listbox" aria-label="Category">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          role="option"
          aria-selected={value === opt}
          className={`cat${value === opt ? ' is-on' : ''}`}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
