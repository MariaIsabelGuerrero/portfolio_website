'use client';

const weeklyData = [
  { day: 'Mon', hours: 76.54 },
  { day: 'Tue', hours: 14.7 },
  { day: 'Wens', hours: 66.33 },
  { day: 'Thurs', hours: 17.15 },
  { day: 'Fri', hours: 34.56 },
  { day: 'Sat', hours: 30.52 },
  { day: 'Sun', hours: 90.61 },
  { day: 'Mon', hours: 17.05 },
  { day: 'Tue', hours: 89.37 },
  { day: 'Wens', hours: 71.84 },
  { day: 'Thurs', hours: 88.83 },
  { day: 'Fri', hours: 25.55 },
];

const languageData = [
  { name: 'TypeScript', hours: 10.98, color: '#3178c6' },
  { name: 'Python', hours: 64.24, color: '#3572A5' },
  { name: 'JSON', hours: 15.17, color: '#292929' },
  { name: 'JavaScript', hours: 95.7, color: '#f1e05a' },
  { name: 'Bash', hours: 52.91, color: '#89e051' },
  { name: 'Other', hours: 16.07, color: '#8892b0' },
  { name: 'Markdown', hours: 27.07, color: '#083fa1' },
  { name: 'MDX', hours: 54.83, color: '#fcb32c' },
  { name: 'CSS', hours: 40.48, color: '#563d7c' },
  { name: 'TSConfig', hours: 49.6, color: '#e34c26' },
  { name: 'Git Config', hours: 63.22, color: '#F44D27' },
];

const totalHours = languageData.reduce((acc, lang) => acc + lang.hours, 0);

export default function Activity() {
  const maxHours = Math.max(...weeklyData.map((d) => d.hours));

  return (
    <section id="activity" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-12">
          <span className="section-number">4</span>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-[#e6f1ff] mb-2">
              Coding activity
            </h2>
            <div className="accent-line w-full max-w-xs"></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Bar Chart */}
          <div className="bg-[#112240] rounded-lg p-6">
            <div className="flex items-end justify-between h-64 gap-2">
              {weeklyData.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-[#64ffda]/80 rounded-t transition-all hover:bg-[#64ffda]"
                    style={{ height: `${(item.hours / maxHours) * 100}%` }}
                  ></div>
                  <span className="text-[#8892b0] text-xs mt-2 truncate w-full text-center">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[#8892b0] text-sm">
              <span>2025</span>
              <div className="flex gap-4">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
              </div>
            </div>
          </div>

          {/* Pie Chart / Language Stats */}
          <div className="bg-[#112240] rounded-lg p-6">
            <div className="flex items-center gap-8">
              {/* Donut Chart */}
              <div className="relative w-48 h-48 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  {languageData.reduce(
                    (acc, lang) => {
                      const percentage = (lang.hours / totalHours) * 100;
                      const offset = acc.offset;
                      acc.elements.push(
                        <circle
                          key={lang.name}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke={lang.color}
                          strokeWidth="20"
                          strokeDasharray={`${percentage * 2.51} ${251 - percentage * 2.51}`}
                          strokeDashoffset={-offset * 2.51}
                          className="transition-all duration-300 hover:opacity-80"
                        />
                      );
                      acc.offset += percentage;
                      return acc;
                    },
                    { elements: [] as JSX.Element[], offset: 0 }
                  ).elements}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#e6f1ff]">
                    {totalHours.toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {languageData.map((lang) => (
                  <div key={lang.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: lang.color }}
                    ></div>
                    <span className="text-[#8892b0]">{lang.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
