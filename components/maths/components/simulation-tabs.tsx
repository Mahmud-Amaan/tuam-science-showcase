"use client"

interface Tab {
  id: string
  label: {
    en: string
    bn: string
  }
  icon: string
  category: "function" | "geometry"
}

const tabs: Tab[] = [
  { id: "linear", label: { en: "Linear Functions", bn: "রৈখিক ফাংশন" }, icon: "📈", category: "function" },
  { id: "quadratic", label: { en: "Quadratic Functions", bn: "দ্বিঘাত ফাংশন" }, icon: "∩", category: "function" },
  { id: "logarithmic", label: { en: "Logarithmic Functions", bn: "লগারিদমিক ফাংশন" }, icon: "📊", category: "function" },
  { id: "exponential", label: { en: "Exponential Functions", bn: "সূচকীয় ফাংশন" }, icon: "🚀", category: "function" },
  { id: "distance", label: { en: "Distance Formula", bn: "দূরত্ব সূত্র" }, icon: "📏", category: "geometry" },
  {
    id: "lineThrough",
    label: { en: "Line Through 2 Points", bn: "২ বিন্দুর মধ্য দিয়ে রেখা" },
    icon: "↗️",
    category: "geometry",
  },
  { id: "circle", label: { en: "Circle Equation", bn: "বৃত্ত সমীকরণ" }, icon: "⭕", category: "geometry" },
  { id: "triangle", label: { en: "Triangle", bn: "ত্রিভুজ" }, icon: "▲", category: "geometry" },
  { id: "square", label: { en: "Square/Rectangle", bn: "বর্গ/আয়তক্ষেত্র" }, icon: "■", category: "geometry" },
  { id: "areaTriangle", label: { en: "Triangle Area", bn: "ত্রিভুজ ক্ষেত্রফল" }, icon: "📐", category: "geometry" },
]

export default function SimulationTabs({
  activeSimulation,
  onTabChange,
  language,
}: {
  activeSimulation: string
  onTabChange: (id: string) => void
  language: "en" | "bn"
}) {
  const functionTabs = tabs.filter((t) => t.category === "function")
  const geometryTabs = tabs.filter((t) => t.category === "geometry")

  const renderTabGroup = (tabList: Tab[]) => (
    <div className="flex flex-wrap gap-3">
      {tabList.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-5 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 text-sm whitespace-nowrap ${
            activeSimulation === tab.id
              ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg scale-105"
              : "bg-muted text-muted-foreground hover:bg-secondary/10"
          }`}
        >
          <span className="text-lg">{tab.icon}</span>
          {tab.label[language]}
        </button>
      ))}
    </div>
  )

  return (
    <div className="space-y-4 p-4 bg-card rounded-xl border border-border shadow-sm">
      {/* Functions Section */}
      <div>
        <h3 className="text-xs font-bold text-muted-foreground uppercase mb-3">
          {language === "en" ? "Functions" : "ফাংশন"}
        </h3>
        {renderTabGroup(functionTabs)}
      </div>

      {/* Geometry Section */}
      <div>
        <h3 className="text-xs font-bold text-muted-foreground uppercase mb-3">
          {language === "en" ? "Coordinate Geometry" : "স্থানাঙ্ক জ্যামিতি"}
        </h3>
        {renderTabGroup(geometryTabs)}
      </div>
    </div>
  )
}
