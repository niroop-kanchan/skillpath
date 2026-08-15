import { addPropertyControls, ControlType } from "framer"
import { useEffect, useMemo, useState } from "react"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */

const COURSES_URL =
    "https://syncsphere-hiv6.onrender.com/assignment/course-data"

const COUNTRY_URL =
    "https://syncsphere-hiv6.onrender.com/assignment/country-code"

type Course = {
    courseName: string
    courseCode: string
    description: string
    mainCategory: string
    shortCourse: string
    courseType: string
    pricePaise: number
    priceUsdCents: number
    mangoId: string
    refundable: boolean
}

type Country = "IN" | "US"

type Props = {
    accentColor: string
    cardRadius: number
}

export default function SkillpathCourses({
    accentColor = "#111111",
    cardRadius = 18,
}: Props) {
    const [courses, setCourses] = useState<Course[]>([])
    const [country, setCountry] = useState<Country | null>(null)

    const [loading, setLoading] = useState(true)
    const [courseError, setCourseError] = useState(false)
    const [countryError, setCountryError] = useState(false)

    const [search, setSearch] = useState("")
    const [sortOrder, setSortOrder] = useState<"default" | "low" | "high">(
        "default"
    )

    const [retryCount, setRetryCount] = useState(0)

    async function loadData() {
        setLoading(true)
        setCourseError(false)
        setCountryError(false)

        const [courseResult, countryResult] = await Promise.allSettled([
            fetch(COURSES_URL, {
                method: "GET",
            }),
            fetch(COUNTRY_URL, {
                method: "GET",
            }),
        ])

        if (courseResult.status === "fulfilled") {
            const response = courseResult.value

            if (response.ok) {
                try {
                    const data = await response.json()

                    if (Array.isArray(data)) {
                        setCourses(data)
                    } else {
                        setCourses([])
                        setCourseError(true)
                    }
                } catch {
                    setCourses([])
                    setCourseError(true)
                }
            } else {
                setCourses([])
                setCourseError(true)
            }
        } else {
            setCourses([])
            setCourseError(true)
        }

        if (countryResult.status === "fulfilled") {
            const response = countryResult.value

            if (response.ok) {
                try {
                    const data = await response.json()

                    if (
                        data.country_code === "IN" ||
                        data.country_code === "US"
                    ) {
                        setCountry(data.country_code)
                    } else {
                        setCountry(null)
                        setCountryError(true)
                    }
                } catch {
                    setCountry(null)
                    setCountryError(true)
                }
            } else {
                setCountry(null)
                setCountryError(true)
            }
        } else {
            setCountry(null)
            setCountryError(true)
        }

        setLoading(false)
    }

    useEffect(() => {
        loadData()
    }, [retryCount])

    const visibleCourses = useMemo(() => {
        let result = [...courses]

        const query = search.trim().toLowerCase()

        if (query) {
            result = result.filter((course) => {
                return (
                    course.courseName.toLowerCase().includes(query) ||
                    course.description.toLowerCase().includes(query) ||
                    course.mainCategory.toLowerCase().includes(query) ||
                    course.shortCourse.toLowerCase().includes(query)
                )
            })
        }

        if (sortOrder !== "default") {
            result.sort((a, b) => {
                const priceA = getNumericPrice(a, country)
                const priceB = getNumericPrice(b, country)

                return sortOrder === "low" ? priceA - priceB : priceB - priceA
            })
        }

        return result
    }, [courses, search, sortOrder, country])

    function retry() {
        setRetryCount((value) => value + 1)
    }

    if (loading) {
        return (
            <section style={styles.section}>
                <style>{responsiveCSS}</style>

                <div style={styles.header}>
                    <div style={styles.titleArea}>
                        <div style={styles.eyebrow}>SKILLPATH</div>

                        <h2 style={styles.heading}>Explore courses</h2>

                        <p style={styles.subheading}>
                            Learn practical skills and build something real.
                        </p>
                    </div>
                </div>

                <div className="skillpath-grid">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <SkeletonCard key={index} radius={cardRadius} />
                    ))}
                </div>
            </section>
        )
    }

    if (courseError) {
        return (
            <section style={styles.section}>
                <style>{responsiveCSS}</style>

                <div style={styles.header}>
                    <div style={styles.titleArea}>
                        <div style={styles.eyebrow}>SKILLPATH</div>

                        <h2 style={styles.heading}>Explore courses</h2>
                    </div>
                </div>

                <div style={styles.stateBox}>
                    <div style={styles.stateIcon}>!</div>

                    <h3 style={styles.stateTitle}>
                        Courses couldn't be loaded
                    </h3>

                    <p style={styles.stateText}>
                        The course service is temporarily unavailable. Please
                        try again.
                    </p>

                    <button
                        onClick={retry}
                        style={{
                            ...styles.retryButton,
                            backgroundColor: accentColor,
                        }}
                    >
                        Retry
                    </button>
                </div>
            </section>
        )
    }

    if (courses.length === 0) {
        return (
            <section style={styles.section}>
                <style>{responsiveCSS}</style>

                <div style={styles.header}>
                    <div style={styles.titleArea}>
                        <div style={styles.eyebrow}>SKILLPATH</div>

                        <h2 style={styles.heading}>Explore courses</h2>
                    </div>
                </div>

                <div style={styles.stateBox}>
                    <div style={styles.stateIcon}>0</div>

                    <h3 style={styles.stateTitle}>No courses available</h3>

                    <p style={styles.stateText}>
                        There aren't any courses available right now.
                    </p>

                    <button
                        onClick={retry}
                        style={{
                            ...styles.retryButton,
                            backgroundColor: accentColor,
                        }}
                    >
                        Try again
                    </button>
                </div>
            </section>
        )
    }

    return (
        <section style={styles.section}>
            <style>{responsiveCSS}</style>

            <div style={styles.header}>
                <div style={styles.titleArea}>
                    <div
                        style={{
                            ...styles.eyebrow,
                            color: accentColor,
                        }}
                    >
                        SKILLPATH
                    </div>

                    <h2 style={styles.heading}>Explore courses</h2>

                    <p style={styles.subheading}>
                        Learn practical skills and build something real.
                    </p>

                    <p style={styles.courseCount}>
                        {courses.length}{" "}
                        {courses.length === 1 ? "course" : "courses"} available
                    </p>
                </div>

                <div className="skillpath-controls">
                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search courses..."
                        style={styles.search}
                        aria-label="Search courses"
                    />

                    <select
                        value={sortOrder}
                        onChange={(event) =>
                            setSortOrder(
                                event.target.value as "default" | "low" | "high"
                            )
                        }
                        style={styles.select}
                        aria-label="Sort courses by price"
                    >
                        <option value="default">Sort by price</option>

                        <option value="low">Price: Low to high</option>

                        <option value="high">Price: High to low</option>
                    </select>
                </div>
            </div>

            {countryError && (
                <div style={styles.countryWarning}>
                    <span>
                        Currency information is temporarily unavailable. Course
                        prices will appear when the currency service is
                        available.
                    </span>

                    <button onClick={retry} style={styles.smallRetry}>
                        Retry
                    </button>
                </div>
            )}

            {visibleCourses.length === 0 ? (
                <div style={styles.stateBox}>
                    <div style={styles.stateIcon}>⌕</div>

                    <h3 style={styles.stateTitle}>No matching courses</h3>

                    <p style={styles.stateText}>Try a different search term.</p>

                    <button
                        onClick={() => setSearch("")}
                        style={{
                            ...styles.retryButton,
                            backgroundColor: accentColor,
                        }}
                    >
                        Clear search
                    </button>
                </div>
            ) : (
                <div className="skillpath-grid">
                    {visibleCourses.map((course) => (
                        <CourseCard
                            key={course.courseCode}
                            course={course}
                            country={country}
                            radius={cardRadius}
                            accentColor={accentColor}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}

function CourseCard({
    course,
    country,
    radius,
    accentColor,
}: {
    course: Course
    country: Country | null
    radius: number
    accentColor: string
}) {
    const [hovered, setHovered] = useState(false)

    return (
        <article
            style={{
                ...styles.card,
                borderRadius: radius,
                transform: hovered ? "translateY(-4px)" : "translateY(0)",
                boxShadow: hovered
                    ? "0 16px 35px rgba(0,0,0,0.10)"
                    : "0 4px 18px rgba(0,0,0,0.04)",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={styles.cardTop}>
                <span
                    style={{
                        ...styles.category,
                        color: accentColor,
                    }}
                >
                    {course.mainCategory}
                </span>

                {course.refundable && (
                    <span style={styles.refundable}>Refundable</span>
                )}
            </div>

            <h3 style={styles.courseName}>{course.courseName}</h3>

            <p style={styles.description}>{course.description}</p>

            <div style={styles.cardBottom}>
                <div>
                    <div style={styles.fieldLabel}>Course</div>

                    <div style={styles.fieldValue}>{course.shortCourse}</div>
                </div>

                <div style={styles.priceArea}>
                    <div style={styles.fieldLabel}>Price</div>

                    <div style={styles.price}>
                        {formatPrice(course, country)}
                    </div>
                </div>
            </div>
        </article>
    )
}

function SkeletonCard({ radius }: { radius: number }) {
    return (
        <div
            style={{
                ...styles.card,
                borderRadius: radius,
            }}
        >
            <div
                style={{
                    ...styles.skeleton,
                    width: "35%",
                    height: 12,
                }}
            />

            <div
                style={{
                    ...styles.skeleton,
                    width: "80%",
                    height: 24,
                    marginTop: 22,
                }}
            />

            <div
                style={{
                    ...styles.skeleton,
                    width: "100%",
                    height: 12,
                    marginTop: 18,
                }}
            />

            <div
                style={{
                    ...styles.skeleton,
                    width: "85%",
                    height: 12,
                    marginTop: 8,
                }}
            />

            <div
                style={{
                    ...styles.skeleton,
                    width: "35%",
                    height: 25,
                    marginTop: 35,
                }}
            />
        </div>
    )
}

function getNumericPrice(course: Course, country: Country | null): number {
    if (country === "IN") {
        return course.pricePaise / 100
    }

    if (country === "US") {
        return course.priceUsdCents / 100
    }

    return Number.POSITIVE_INFINITY
}

function formatPrice(course: Course, country: Country | null): string {
    if (country === "IN") {
        const rupees = course.pricePaise / 100

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(rupees)
    }

    if (country === "US") {
        const dollars = course.priceUsdCents / 100

        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(dollars)
    }

    return "Price unavailable"
}

const styles: Record<string, any> = {
    section: {
        width: "100%",
        boxSizing: "border-box",
        padding: "72px 6%",
        background: "#FFFFFF",
        color: "#111111",
        fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },

    header: {
        maxWidth: 1200,
        margin: "0 auto 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: 32,
    },

    titleArea: {
        maxWidth: 620,
    },

    eyebrow: {
        marginBottom: 10,
        fontSize: 12,
        lineHeight: 1,
        fontWeight: 700,
        letterSpacing: "0.14em",
        color: "#777777",
    },

    heading: {
        margin: 0,
        fontSize: 42,
        lineHeight: 1.08,
        letterSpacing: "-0.04em",
        fontWeight: 700,
    },

    subheading: {
        margin: "14px 0 0",
        fontSize: 17,
        lineHeight: 1.5,
        color: "#666666",
    },

    courseCount: {
        margin: "10px 0 0",
        fontSize: 13,
        lineHeight: 1.4,
        fontWeight: 600,
        color: "#888888",
    },

    search: {
        width: 220,
        height: 46,
        boxSizing: "border-box",
        padding: "0 14px",
        border: "1px solid #DDDDDD",
        borderRadius: 10,
        background: "#FFFFFF",
        color: "#111111",
        fontSize: 14,
        outline: "none",
    },

    select: {
        width: 175,
        height: 46,
        boxSizing: "border-box",
        padding: "0 12px",
        border: "1px solid #DDDDDD",
        borderRadius: 10,
        background: "#FFFFFF",
        color: "#111111",
        fontSize: 14,
        outline: "none",
        cursor: "pointer",
    },

    card: {
        minWidth: 0,
        minHeight: 300,
        boxSizing: "border-box",
        padding: 25,
        background: "#F7F7F5",
        border: "1px solid #E7E7E4",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        willChange: "transform, box-shadow",
    },

    cardTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        marginBottom: 20,
    },

    category: {
        fontSize: 11,
        lineHeight: 1,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
    },

    refundable: {
        padding: "5px 9px",
        borderRadius: 999,
        background: "#E8F6ED",
        color: "#287A45",
        fontSize: 11,
        fontWeight: 700,
        whiteSpace: "nowrap",
    },

    courseName: {
        margin: 0,
        fontSize: 22,
        lineHeight: 1.2,
        letterSpacing: "-0.025em",
        fontWeight: 700,
    },

    description: {
        margin: "13px 0 0",
        fontSize: 14,
        lineHeight: 1.5,
        color: "#666666",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
    },

    cardBottom: {
        marginTop: "auto",
        paddingTop: 28,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: 20,
        borderTop: "1px solid #E5E5E2",
    },

    fieldLabel: {
        marginBottom: 5,
        fontSize: 10,
        lineHeight: 1,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "#999999",
    },

    fieldValue: {
        fontSize: 13,
        fontWeight: 600,
        color: "#333333",
    },

    priceArea: {
        textAlign: "right",
    },

    price: {
        fontSize: 20,
        lineHeight: 1,
        fontWeight: 700,
        letterSpacing: "-0.02em",
    },

    stateBox: {
        maxWidth: 1200,
        minHeight: 280,
        margin: "0 auto",
        padding: 40,
        boxSizing: "border-box",
        border: "1px dashed #D5D5D5",
        borderRadius: 18,
        background: "#FAFAF9",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
    },

    stateIcon: {
        width: 44,
        height: 44,
        marginBottom: 15,
        borderRadius: 999,
        background: "#EEEEEC",
        color: "#555555",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        fontWeight: 700,
    },

    stateTitle: {
        margin: 0,
        fontSize: 22,
        lineHeight: 1.2,
        fontWeight: 700,
    },

    stateText: {
        maxWidth: 430,
        margin: "10px 0 20px",
        fontSize: 14,
        lineHeight: 1.5,
        color: "#777777",
    },

    retryButton: {
        border: 0,
        padding: "11px 19px",
        borderRadius: 10,
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: 700,
        cursor: "pointer",
    },

    countryWarning: {
        maxWidth: 1200,
        margin: "0 auto 20px",
        padding: "12px 14px",
        boxSizing: "border-box",
        borderRadius: 10,
        background: "#FFF8E6",
        color: "#775900",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 15,
        fontSize: 13,
        lineHeight: 1.4,
    },

    smallRetry: {
        border: 0,
        padding: 0,
        background: "transparent",
        color: "#775900",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        textDecoration: "underline",
        whiteSpace: "nowrap",
    },

    skeleton: {
        borderRadius: 7,
        background:
            "linear-gradient(90deg, #EEEEEC 25%, #F7F7F5 50%, #EEEEEC 75%)",
        backgroundSize: "200% 100%",
        animation: "skillpathSkeleton 1.5s infinite",
    },
}

const responsiveCSS = `
    @keyframes skillpathSkeleton {
        0% {
            background-position: 200% 0;
        }

        100% {
            background-position: -200% 0;
        }
    }

    .skillpath-grid {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 20px;
    }

    .skillpath-controls {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
    }

    @media (max-width: 900px) {
        .skillpath-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .skillpath-controls {
            width: 100%;
        }

        .skillpath-controls input {
            flex: 1;
            width: auto !important;
        }
    }

    @media (max-width: 700px) {
        .skillpath-grid {
            grid-template-columns: 1fr;
        }

        .skillpath-controls {
            flex-direction: column;
            align-items: stretch;
        }

        .skillpath-controls input,
        .skillpath-controls select {
            width: 100% !important;
        }

        .skillpath-header {
            flex-direction: column;
            align-items: stretch;
        }
    }
`

addPropertyControls(SkillpathCourses, {
    accentColor: {
        title: "Accent Color",
        type: ControlType.Color,
        defaultValue: "#111111",
    },

    cardRadius: {
        title: "Card Radius",
        type: ControlType.Number,
        defaultValue: 18,
        min: 0,
        max: 40,
        step: 1,
        unit: "px",
    },
})

