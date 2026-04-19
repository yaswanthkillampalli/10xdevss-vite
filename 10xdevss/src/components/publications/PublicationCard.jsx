import "../../styles/components/publications/PublicationCard.css";

const VENUE_BADGE = {
  journal: "badge-green",
  conference: "badge-red",
  preprint: "badge-gray",
  workshop: "badge-gray",
  other: "badge-gray",
};

export default function PublicationCard({
  publication,
  isEdit = false,
  onEdit,
  onDelete,
  animationDelay,
}) {
  const toDoiUrl = (value) => {
    if (!value) return null;
    const doiValue = String(value).trim();
    if (!doiValue) return null;
    if (/^https?:\/\//i.test(doiValue)) return doiValue;
    return `https://doi.org/${doiValue}`;
  };

  const {
    id,
    title,
    abstract,
    authors = [],
    venue,
    venueType,
    publishedDate,
    doi,
    fileUrl,
    citationCount = 0,
    tags = [],
  } = publication;

  const doiLink = toDoiUrl(doi);

  return (
    <div
      className="card animate-in publication-card"
      style={animationDelay ? { animationDelay } : undefined}
    >
      <div className="publication-card__header">
        <div className="publication-card__main">
          <div className="publication-card__meta-row">
            <span className={`badge ${VENUE_BADGE[venueType] || "badge-gray"}`}>
              {venueType}
            </span>
            <span className="publication-card__meta-text">{publishedDate}</span>
            {citationCount > 0 && (
              <span className="publication-card__meta-text">
                · {citationCount} citations
              </span>
            )}
          </div>

          <h3 className="publication-card__title">{title}</h3>
          <p className="publication-card__authors">{authors.join(", ")}</p>
          <p className="publication-card__venue">{venue}</p>
        </div>
      </div>

      <p className="publication-card__abstract">{abstract}</p>

      <div className="tags publication-card__tags">
        {tags.map((tag) => (
          <span key={tag} className="tag publication-card__tag">
            {tag}
          </span>
        ))}
      </div>

      {doi && (
        <p className="publication-card__doi">
          DOI: <span className="publication-card__doi-value">{doi}</span>
        </p>
      )}

      <div className="publication-card__actions">
        {fileUrl && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline publication-card__action-btn"
          >
            View Paper ↗
          </a>
        )}

        {doiLink && (
          <a
            href={doiLink}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline publication-card__action-btn"
          >
            View DOI ↗
          </a>
        )}

        {isEdit && (
          <button
            type="button"
            className="btn btn-outline publication-card__action-btn"
            onClick={() => onEdit?.(publication)}
          >
            Edit
          </button>
        )}

        {isEdit && (
          <button
            type="button"
            className="btn btn-danger publication-card__action-btn"
            onClick={() => onDelete?.(id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
