import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, SearchX, SlidersHorizontal, Users } from "lucide-react";
import "../../styles/portfolio/Projects.css";
import "../../styles/faculty/SearchStudents.css";
import { searchDirectoryUsers } from "../../authentication/api";

const ROLE_FILTERS = ["all", "student", "faculty"];

export default function SearchStudents() {
    const [query, setQuery] = useState("");
    const [role, setRole] = useState("all");
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const timerId = window.setTimeout(async () => {
            try {
                const params = { q: query.trim(), limit: 60 };
                if (role !== "all") params.role = role;

                const response = await searchDirectoryUsers(params);

                if (!isMounted) return;
                setUsers(response?.data || []);
                setError("");
            } catch (requestError) {
                if (!isMounted) return;
                setUsers([]);
                setError(requestError?.response?.data?.message || "Could not fetch directory users.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }, 250);

        return () => {
            isMounted = false;
            window.clearTimeout(timerId);
        };
    }, [query, role]);

    const resultsMeta = useMemo(() => {
        if (isLoading) return "Loading…";
        const roleLabel = role === "all" ? "all roles" : role;
        return `${users.length} result${users.length === 1 ? "" : "s"} · ${roleLabel}`;
    }, [isLoading, role, users.length]);

    return (
        <div className="container-fluid search-students-wrap">

            {/* ── Compact header ── */}
            <div className="section-header animate-in">
                <h1>Directory</h1>
                <p className="search-students-meta">{resultsMeta}</p>
            </div>

            {/* ── Error ── */}
            {error && <p className="directory-error">{error}</p>}

            {/* ── Filters ── */}
            <div className="directory-filter-row">
                <span className="directory-pill" aria-hidden="true">
                    <SlidersHorizontal size={11} style={{ marginRight: 3 }} />
                    Filter
                </span>
                {ROLE_FILTERS.map((filter) => (
                    <button
                        key={filter}
                        type="button"
                        className={`directory-filter-btn${role === filter ? " is-active" : ""}`}
                        onClick={() => {
                            setIsLoading(true);
                            setRole(filter);
                        }}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* ── Search bar ── */}
            <div className="project-searchbar">
                <span className="project-search-icon">
                    <Search size={14} strokeWidth={2} />
                </span>
                <input
                    type="text"
                    placeholder="Search by name, roll number, or email"
                    value={query}
                    onChange={(e) => {
                        setIsLoading(true);
                        setQuery(e.target.value);
                    }}
                    className="project-search-input"
                />
            </div>

            {/* ── Results ── */}
            {!isLoading && users.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state__icon">
                        <SearchX size={26} strokeWidth={1.4} />
                    </div>
                    <h3 className="empty-state__heading">No matches found</h3>
                    <p className="empty-state__body">Try a different keyword or role filter.</p>
                </div>
            ) : (
                <div className="directory-grid animate-in delay-1">
                    {users.map((user) => (
                        <article key={user.id} className="directory-card">
                            <div className="directory-card__top">
                                <div style={{ minWidth: 0 }}>
                                    <h3 className="directory-card__name">{user.fullName}</h3>
                                    <p className="directory-card__role">{user.emailId}</p>
                                </div>
                                <span className="directory-pill">
                                    <Users size={11} style={{ marginRight: 3 }} />
                                    {user.role}
                                </span>
                            </div>

                            <div className="directory-card__meta">
                                <p><strong>Roll</strong>{user.rollId || "—"}</p>
                                <p><strong>Email</strong>{user.emailId || "—"}</p>
                            </div>

                            <div className="directory-card__actions">
                                <Link to={`/profile/${user.id}`} className="directory-card__profile-link">
                                    View profile →
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}