export default function InfoCard({ title, value, description }) {
  return (
    <div className="info-card">
      <p className="info-card__title">{title}</p>

      <p className="info-card__value">{value}</p>

      {description && (
        <p className="info-card__description">{description}</p>
      )}
    </div>
  )
}
