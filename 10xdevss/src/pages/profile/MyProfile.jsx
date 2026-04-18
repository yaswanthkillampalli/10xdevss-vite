import { useEffect, useMemo, useRef, useState } from "react";
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
import {
  createMyProfile,
  getMyProfile,
  getMyUser,
  updateMyProfile,
  updateMyUser,
} from "../../authentication/api";
import useImageKitUpload from "../../hooks/useImageKitUpload";
import { writeProfileSnapshot } from "../../utils/profileSync";
import "../../styles/profile/MyProfile.css";

const INITIAL_PROFILE = {
  fullName: "",
  emailId: "",
  rollId: "",
  headline: "",
  avatar:"/profile-pic.jpg",
  // avatar: "https://res.cloudinary.com/dz7moyhci/image/upload/q_auto/f_auto/v1770744513/users/hd52qexlr7vvx2px0abr.png",
  location: "",
  bio: "",
  socialLinks: {
    github: "",
    linkedin: "",
    twitter: "",
    portfolio: "",
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
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const fileInputRef = useRef(null);
  const { uploadFile, isUploading, uploadError, reset: resetUploadState } = useImageKitUpload();

  const extractApiData = (response) => response?.data || null;

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const [userResult, profileResult] = await Promise.allSettled([
          getMyUser(),
          getMyProfile(),
        ]);

        const userData = userResult.status === "fulfilled" ? extractApiData(userResult.value) : null;
        const profileData = profileResult.status === "fulfilled" ? extractApiData(profileResult.value) : null;

        if (!isMounted) return;

        const mergedProfile = {
          ...INITIAL_PROFILE,
          fullName: userData?.fullName || INITIAL_PROFILE.fullName,
          emailId: userData?.emailId || INITIAL_PROFILE.emailId,
          rollId: userData?.rollId || INITIAL_PROFILE.rollId,
          avatar: profileData?.avatar || INITIAL_PROFILE.avatar,
          headline: profileData?.headline || INITIAL_PROFILE.headline,
          location: profileData?.location || INITIAL_PROFILE.location,
          bio: profileData?.bio || INITIAL_PROFILE.bio,
          socialLinks: {
            ...INITIAL_PROFILE.socialLinks,
            ...(profileData?.socialLinks || {}),
          },
        };

        setProfile(mergedProfile);
        setDraft(mergedProfile);
        writeProfileSnapshot(mergedProfile);
      } catch {
        if (isMounted) {
          setSavedMessage("Using local profile data. Could not fetch server profile right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

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
    setAvatarFile(null);
    setAvatarPreview("");
    resetUploadState();
    setIsEditing(true);
    setSavedMessage("");
  };

  const onCancel = () => {
    setDraft(profile);
    setAvatarFile(null);
    if (avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview("");
    resetUploadState();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsEditing(false);
    setSavedMessage("");
  };

  const handleAvatarSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSavedMessage("Please select a valid image file.");
      return;
    }

    if (avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    const objectUrl = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatarPreview(objectUrl);
    setSavedMessage("");
  };

  const clearSelectedAvatar = () => {
    if (avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarFile(null);
    setAvatarPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSave = async () => {
    setIsSaving(true);
    setSavedMessage("");

    const nextProfile = {
      ...draft,
      fullName: draft.fullName.trim(),
      emailId: draft.emailId.trim(),
      rollId: draft.rollId.trim(),
      headline: draft.headline.trim(),
      location: draft.location.trim(),
      bio: draft.bio.trim(),
      socialLinks: {
        github: draft.socialLinks.github.trim(),
        linkedin: draft.socialLinks.linkedin.trim(),
        twitter: draft.socialLinks.twitter.trim(),
        portfolio: draft.socialLinks.portfolio.trim(),
      },
    };

    try {
      if (avatarFile) {
        const uploadResult = await uploadFile(avatarFile, {
          allowedType: "image",
          maxFileSizeMb: 5,
          uploadType: "profile-pic",
          fileName: `${nextProfile.rollId || "profile"}-${Date.now()}`,
          tags: ["profile", "avatar"],
        });

        nextProfile.avatar = uploadResult?.cdnUrl || uploadResult?.url || "";
      }

      await updateMyUser({
        fullName: nextProfile.fullName,
        emailId: nextProfile.emailId,
        rollId: nextProfile.rollId,
      });

      const profilePayload = {
        avatar: nextProfile.avatar || null,
        headline: nextProfile.headline || null,
        location: nextProfile.location || null,
        bio: nextProfile.bio || null,
        socialLinks: {
          github: nextProfile.socialLinks.github || null,
          linkedin: nextProfile.socialLinks.linkedin || null,
          twitter: nextProfile.socialLinks.twitter || null,
          portfolio: nextProfile.socialLinks.portfolio || null,
        },
      };

      try {
        await updateMyProfile(profilePayload);
      } catch (error) {
        if (error?.response?.status === 404) {
          await createMyProfile(profilePayload);
        } else {
          throw error;
        }
      }

      setProfile(nextProfile);
      setDraft(nextProfile);
      writeProfileSnapshot(nextProfile);
      setIsEditing(false);
      clearSelectedAvatar();
      resetUploadState();
      setSavedMessage("Profile updated successfully. Photo uploaded to ImageKit.");
    } catch (error) {
      const apiMessage = error?.response?.data?.message;
      setSavedMessage(apiMessage || error?.message || "Could not save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
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
                  <button type="button" className="pf-btn pf-btn--ghost" onClick={onCancel} disabled={isSaving || isUploading}>
                    <X size={14} strokeWidth={2} />
                    Cancel
                  </button>
                  <button type="button" className="pf-btn pf-btn--primary" onClick={onSave} disabled={isSaving || isUploading}>
                    <Check size={14} strokeWidth={2} />
                    {isSaving || isUploading ? "Saving..." : "Save Changes"}
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

          {uploadError && (
            <div className="pf-notice">
              <X size={14} strokeWidth={2.5} />
              {uploadError}
            </div>
          )}

          {isLoadingProfile && (
            <div className="pf-notice">
              <Check size={14} strokeWidth={2.5} />
              Loading profile details...
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
                    <div className="pf-field pf-field--full">
                      <label className="pf-field__label" htmlFor="avatarUpload">
                        <Image size={12} strokeWidth={2.2} />
                        Profile Photo
                      </label>

                      <div className="pf-photo-editor">
                        <div className="pf-photo-preview">
                          {avatarPreview || draft.avatar ? (
                            <img src={avatarPreview || draft.avatar} alt="Profile preview" className="pf-photo-preview__img" />
                          ) : (
                            <span className="pf-photo-preview__initials">
                              {draft.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="pf-photo-actions">
                          <input
                            id="avatarUpload"
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="pf-photo-input-hidden"
                            onChange={handleAvatarSelect}
                          />
                          <button
                            type="button"
                            className="pf-btn pf-btn--ghost"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isSaving || isUploading}
                          >
                            Choose Photo
                          </button>
                          {avatarFile && (
                            <button
                              type="button"
                              className="pf-btn pf-btn--ghost"
                              onClick={clearSelectedAvatar}
                              disabled={isSaving || isUploading}
                            >
                              Remove
                            </button>
                          )}
                          <p className="pf-photo-help">
                            JPG, PNG, WEBP up to 5MB. Uploaded to ImageKit on Save.
                          </p>
                        </div>
                      </div>
                    </div>

                    <FieldEdit icon={User}      label="Full Name"  id="fullName"  value={draft.fullName}  onChange={(v) => onFieldChange("fullName", v)}  placeholder="Your full name" />
                    <FieldEdit icon={Mail}      label="Email"      id="emailId"   value={draft.emailId}   onChange={(v) => onFieldChange("emailId", v)}   type="email" placeholder="you@example.com" />
                    <FieldEdit icon={Hash}      label="Roll ID"    id="rollId"    value={draft.rollId}    onChange={(v) => onFieldChange("rollId", v)}    placeholder="22BCEXXXX" />
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