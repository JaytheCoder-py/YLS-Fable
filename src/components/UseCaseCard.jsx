import { PenNib, GradCap, ChartBars, HeartIcon, SquaresOverlap, SparkleIcon, PersonIcon, ScaleIcon, FlaskIcon } from './Icons.jsx';

const categoryIcons = {
  Cowork: SquaresOverlap,
  'Custom visuals': SparkleIcon,
  Education: GradCap,
  Finance: ChartBars,
  Marketing: ChartBars,
  Sales: ChartBars,
  Nonprofits: HeartIcon,
  Personal: PersonIcon,
  Professional: PersonIcon,
  HR: PersonIcon,
  Legal: ScaleIcon,
  'Life Sciences': FlaskIcon,
  Research: FlaskIcon,
};

// The icon map covers the full Category filter vocabulary; a category
// outside it renders label-only.
function CategoryChip({ category }) {
  const Icon = categoryIcons[category];
  return (
    <span className="uc-chip">
      {Icon && <Icon />}
      {category}
    </span>
  );
}

export function detailUrl(slug) {
  return `https://claude.com/resources/use-cases/${slug}`;
}

// The link wraps the title but is stretched over the whole card (::after in
// CSS), matching the reference's whole-card click target.
export default function UseCaseCard({ useCase, variant }) {
  const primaryCategory = useCase.categories[0];
  return (
    <li className="uc-card">
      <div className={`uc-card__media uc-card__media--${variant}`} aria-hidden="true" />
      <div className="uc-card__body">
        <h3 className="uc-card__title">
          <a className="uc-card__link" href={detailUrl(useCase.slug)} target="_blank" rel="noreferrer">
            {useCase.title}
          </a>
        </h3>
        <p className="uc-card__desc">{useCase.desc}</p>
        <div className="uc-card__meta">
          <span className="uc-chip">
            <PenNib />
            {useCase.author}
          </span>
          {primaryCategory && <CategoryChip category={primaryCategory} />}
        </div>
      </div>
    </li>
  );
}
