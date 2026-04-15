import { useMemo, useState } from "react";
import {
  User,
  Mail,
  Hash,
  MapPin,
  Link2,
  FileText,
  Globe,
  Pencil,
  X,
  Check,
  Image,
  Briefcase,
  BadgeCheck,
  ExternalLink,
} from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import "../../styles/profile/MyProfile.css";

const INITIAL_PROFILE = {
  fullName: "Killampalli Yaswanth Vardhan",
  emailId: "yaswanthkillampalli@gmail.com",
  rollId: "238T1A4252",
  headline: "Full-Stack Developer",
  avatar: "",
  location: "Vijayawada, India",
  bio: "Building scalable products and mentoring dev communities. Passionate about open-source, distributed systems, and turning caffeine into code.",
  socialLinks: {
    github: "https://github.com/yaswanthkillampalli",
    linkedin: "https://linkedin.com/in/yaswanthkillampalli",
    twitter: "https://twitter.com/yaswanthkillampalli",
    portfolio: "https://yashdev.tech",
  },
};

const SOCIAL_CONFIG = [
  { key: "github",    Icon: FaGithub,   label: "GitHub",    placeholder: "https://github.com/username" },
  { key: "linkedin",  Icon: FaLinkedin, label: "LinkedIn",  placeholder: "https://linkedin.com/in/username" },
  { key: "twitter",   Icon: FaTwitter,  label: "Twitter",   placeholder: "https://twitter.com/username" },
  { key: "portfolio", Icon: Globe,    label: "Portfolio", placeholder: "https://yoursite.dev" },
];

function FieldView({ icon: Icon, label, value, mono = false }) {
  return (
    <div className="pf-field">
      <span className="pf-field__label">
        <Icon size={12} strokeWidth={2.2} />
        {label}
      </span>
      <p className={`pf-field__value${mono ? " pf-field__value--mono" : ""}`}>
        {value || <span className="pf-field__empty">Not set</span>}
      </p>
    </div>
  );
}

function FieldEdit({ icon: Icon, label, id, value, onChange, type = "text", placeholder }) {
  return (
    <div className="pf-field">
      <label className="pf-field__label" htmlFor={id}>
        <Icon size={12} strokeWidth={2.2} />
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="pf-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export default function MyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [draft, setDraft] = useState(INITIAL_PROFILE);
  const [savedMessage, setSavedMessage] = useState("");

  const initials = useMemo(() => {
    return profile.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [profile.fullName]);

  const onFieldChange = (field, value) =>
    setDraft((p) => ({ ...p, [field]: value }));

  const onSocialChange = (key, value) =>
    setDraft((p) => ({
      ...p,
      socialLinks: { ...p.socialLinks, [key]: value },
    }));

  const onEdit = () => {
    setDraft(profile);
    setIsEditing(true);
    setSavedMessage("");
  };

  const onCancel = () => {
    setDraft(profile);
    setIsEditing(false);
    setSavedMessage("");
  };

  const onSave = () => {
    setProfile(draft);
    setIsEditing(false);
    setSavedMessage("Changes saved locally. Backend sync is on hold.");
  };

  return (
    <main className="pf-page">
      <div className="pf-layout">

        {/* ── Left sidebar ── */}
        <aside className="pf-sidebar animate-in">
          <div className="pf-sidebar__inner">

            {/* Avatar */}
            <div className="pf-avatar-wrap">
              <div className="pf-avatar">
                {profile.avatar
                  ? <img src={profile.avatar} alt={profile.fullName} className="pf-avatar__img" />
                  : <span className="pf-avatar__initials">{initials}</span>
                }
              </div>
              <div className="pf-avatar__ring" />
            </div>

            {/* Identity */}
            <div className="pf-sidebar__identity">
              <h2 className="pf-sidebar__name">{profile.fullName}</h2>
              <p className="pf-sidebar__headline">
                <Briefcase size={12} strokeWidth={2} />
                {profile.headline}
              </p>
              <p className="pf-sidebar__roll">
                <BadgeCheck size={12} strokeWidth={2} />
                {profile.rollId}
              </p>
              <p className="pf-sidebar__location">
                <MapPin size={12} strokeWidth={2} />
                {profile.location}
              </p>
            </div>

            {/* Divider */}
            <div className="pf-sidebar__divider" />

            {/* Social links */}
            <div className="pf-sidebar__socials">
              <span className="pf-sidebar__socials-label">Links</span>
              {SOCIAL_CONFIG.map(({ key, Icon, label }) =>
                profile.socialLinks[key] ? (
                  <a
                    key={key}
                    href={profile.socialLinks[key]}
                    target="_blank"
                    rel="noreferrer"
                    className="pf-social-chip"
                  >
                    <Icon size={13} strokeWidth={2} />
                    <span>{label}</span>
                    <ExternalLink size={10} strokeWidth={2} className="pf-social-chip__arrow" />
                  </a>
                ) : null
              )}
            </div>
          </div>
        </aside>

        {/* ── Right main panel ── */}
        <div className="pf-main animate-in" style={{ animationDelay: "0.05s" }}>

          {/* Header */}
          <div className="pf-main__topbar">
            <div>
              <p className="pf-kicker">Account</p>
              <h1 className="pf-heading">My Profile</h1>
              <p className="pf-subheading">
                {isEditing ? "Make changes below, then save." : "View your details and edit when needed."}
              </p>
            </div>

            <div className="pf-main__actions">
              {!isEditing ? (
                <button type="button" className="pf-btn pf-btn--primary" onClick={onEdit}>
                  <Pencil size={14} strokeWidth={2} />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button type="button" className="pf-btn pf-btn--ghost" onClick={onCancel}>
                    <X size={14} strokeWidth={2} />
                    Cancel
                  </button>
                  <button type="button" className="pf-btn pf-btn--primary" onClick={onSave}>
                    <Check size={14} strokeWidth={2} />
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Save banner */}
          {savedMessage && (
            <div className="pf-notice">
              <Check size={14} strokeWidth={2.5} />
              {savedMessage}
            </div>
          )}

          {/* ── Sections ── */}
          <div className="pf-sections">

            {/* Basic info */}
            <section className="pf-section">
              <h2 className="pf-section__title">
                <User size={15} strokeWidth={2} />
                Basic Information
              </h2>
              <div className="pf-grid">
                {isEditing ? (
                  <>
                    <FieldEdit icon={User}      label="Full Name"  id="fullName"  value={draft.fullName}  onChange={(v) => onFieldChange("fullName", v)}  placeholder="Your full name" />
                    <FieldEdit icon={Mail}      label="Email"      id="emailId"   value={draft.emailId}   onChange={(v) => onFieldChange("emailId", v)}   type="email" placeholder="you@example.com" />
                    <FieldEdit icon={Hash}      label="Roll ID"    id="rollId"    value={draft.rollId}    onChange={(v) => onFieldChange("rollId", v)}    placeholder="22BCEXXXX" />
                    <FieldEdit icon={Image}     label="Avatar URL" id="avatar"    value={draft.avatar}    onChange={(v) => onFieldChange("avatar", v)}    placeholder="https://..." />
                    <FieldEdit icon={Briefcase} label="Headline"   id="headline"  value={draft.headline}  onChange={(v) => onFieldChange("headline", v)}  placeholder="Your role or tagline" />
                    <FieldEdit icon={MapPin}    label="Location"   id="location"  value={draft.location}  onChange={(v) => onFieldChange("location", v)}  placeholder="City, Country" />
                  </>
                ) : (
                  <>
                    <FieldView icon={User}      label="Full Name"  value={profile.fullName} />
                    <FieldView icon={Mail}      label="Email"      value={profile.emailId} />
                    <FieldView icon={Hash}      label="Roll ID"    value={profile.rollId} mono />
                    <FieldView icon={Image}     label="Avatar URL" value={profile.avatar} />
                    <FieldView icon={Briefcase} label="Headline"   value={profile.headline} />
                    <FieldView icon={MapPin}    label="Location"   value={profile.location} />
                  </>
                )}
              </div>
            </section>

            {/* Bio */}
            <section className="pf-section">
              <h2 className="pf-section__title">
                <FileText size={15} strokeWidth={2} />
                Bio
              </h2>
              {isEditing ? (
                <div className="pf-field pf-field--full">
                  <label className="pf-field__label" htmlFor="bio">
                    <FileText size={12} strokeWidth={2.2} />
                    About you
                  </label>
                  <textarea
                    id="bio"
                    className="pf-input pf-input--textarea"
                    rows={5}
                    value={draft.bio}
                    onChange={(e) => onFieldChange("bio", e.target.value)}
                    placeholder="Tell the world about yourself…"
                  />
                </div>
              ) : (
                <p className="pf-bio-text">{profile.bio}</p>
              )}
            </section>

            {/* Social links */}
            <section className="pf-section">
              <h2 className="pf-section__title">
                <Link2 size={15} strokeWidth={2} />
                Social Links
              </h2>
              {isEditing ? (
                <div className="pf-grid">
                  {SOCIAL_CONFIG.map(({ key, Icon, label, placeholder }) => (
                    <FieldEdit
                      key={key}
                      icon={Icon}
                      label={label}
                      id={key}
                      value={draft.socialLinks[key]}
                      onChange={(v) => onSocialChange(key, v)}
                      placeholder={placeholder}
                    />
                  ))}
                </div>
              ) : (
                <div className="pf-social-view-grid">
                  {SOCIAL_CONFIG.map(({ key, Icon, label }) => (
                    <div key={key} className="pf-social-view-item">
                      <span className="pf-social-view-item__label">
                        <Icon size={13} strokeWidth={2} />
                        {label}
                      </span>
                      {profile.socialLinks[key] ? (
                        <a
                          href={profile.socialLinks[key]}
                          target="_blank"
                          rel="noreferrer"
                          className="pf-social-view-item__link"
                        >
                          {profile.socialLinks[key].replace(/^https?:\/\//, "")}
                          <ExternalLink size={11} strokeWidth={2} />
                        </a>
                      ) : (
                        <span className="pf-field__empty">Not set</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}