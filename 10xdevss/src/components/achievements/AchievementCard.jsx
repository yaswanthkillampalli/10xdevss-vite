import {
  Trophy,
  GraduationCap,
  Medal,
  Star,
  Award,
  BadgeCheck,
  ExternalLink,
  Pencil,
  Trash2,
  Calendar,
  Building2,
} from "lucide-react";
import "../../styles/components/achievements/AchievementCard.css";

const TYPE_CONFIG = {
  award:       { Icon: Trophy,         colorClass: "achievement-icon--award"       },
  scholarship: { Icon: GraduationCap,  colorClass: "achievement-icon--scholarship" },
  competition: { Icon: Medal,          colorClass: "achievement-icon--competition" },
  recognition: { Icon: Star,           colorClass: "achievement-icon--recognition" },
  fellowship:  { Icon: Award,          colorClass: "achievement-icon--fellowship"  },
  other:       { Icon: BadgeCheck,     colorClass: "achievement-icon--other"       },
};

export default function AchievementCard({
  achievement,
  isEdit = false,
  onEdit,
  onDelete,
  animationDelay,
}) {
  const { id, title, issuingOrganization, date, description, type, url } = achievement;
  const { Icon, colorClass } = TYPE_CONFIG[type] ?? TYPE_CONFIG.other;

  return (
    <div
      className="card animate-in achievement-card"
      style={animationDelay ? { animationDelay } : undefined}
    >
      {/* ── Top row: icon + badge ── */}
      <div className="achievement-card__top">
        <div className={`achievement-card__icon-wrap ${colorClass}`}>
          <Icon size={20} strokeWidth={1.8} />
        </div>

        <span className="achievement-card__type-badge">
          {type}
        </span>
      </div>

      {/* ── Main content ── */}
      <div className="achievement-card__main">
        <h3 className="achievement-card__title">{title}</h3>

        <div className="achievement-card__meta">
          <span className="achievement-card__meta-item">
            <Building2 size={12} strokeWidth={2} />
            {issuingOrganization}
          </span>
          <span className="achievement-card__meta-item">
            <Calendar size={12} strokeWidth={2} />
            {date}
          </span>
        </div>

        {description && (
          <p className="achievement-card__description">{description}</p>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="achievement-card__divider" />

      {/* ── Actions ── */}
      <div className="achievement-card__actions">
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="btn achievement-card__action-btn achievement-card__action-btn--outline"
          >
            <ExternalLink size={13} strokeWidth={2} />
            View
          </a>
        )}

        {isEdit && (
          <button
            type="button"
            className="btn achievement-card__action-btn achievement-card__action-btn--outline"
            onClick={() => onEdit?.(achievement)}
          >
            <Pencil size={13} strokeWidth={2} />
            Edit
          </button>
        )}

        {isEdit && (
          <button
            type="button"
            className="btn achievement-card__action-btn achievement-card__action-btn--danger"
            onClick={() => onDelete?.(id)}
          >
            <Trash2 size={13} strokeWidth={2} />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}