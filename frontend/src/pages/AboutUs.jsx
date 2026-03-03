import { useState } from "react";

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState("story");

  const stats = [
    { value: "5000+", label: "Students Placed" },
    { value: "200+", label: "Partner Companies" },
    { value: "50+", label: "Universities" },
    { value: "95%", label: "Success Rate" },
  ];

  const timeline = [
    { year: "2023", title: "The Beginning", description: "MicroIntern was founded with a vision to transform internship opportunities" },
    { year: "2024", title: "Rapid Growth", description: "Reached 1000+ students and 50+ company partners" },
    { year: "2025", title: "Expansion", description: "Expanded to multiple universities across the country" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold  bg-clip-text text-transparent mb-4">
            About MicroIntern
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connecting students with their dream internships, powered by innovation and dedication.
          </p>
        </div>

        {/* Founder Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-6xl font-bold">KM</span>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Kanhaiya Modanwal</h2>
              <p className="text-blue-600 font-semibold mb-2">Founder & CEO</p>
              <p className="text-gray-600 mb-4">BTech in Computer Science & Engineering</p>
              <p className="text-gray-600 leading-relaxed">
                As a CSE graduate, Kanhaiya experienced firsthand the challenges students face in finding quality internships. 
                This inspired him to create MicroIntern - a platform that bridges the gap between students and their dream companies.
                With his technical expertise and passion for education, he's building the future of student internships.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Tabs */}
        <div className="mb-12">
          <div className="flex justify-center gap-4 mb-8">
            {["story", "mission", "vision"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-blue-50"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            {activeTab === "story" && (
              <div className="animate-fadeIn">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h3>
                <p className="text-gray-600 leading-relaxed">
                  MicroIntern started in 2023 when our founder, Kanhaiya Modanwal, was pursuing his BTech in CSE.
                  Frustrated by the lack of quality internship opportunities for freshers, he decided to build a solution.
                  What began as a college project has grown into a platform helping thousands of students find their dream internships.
                </p>
              </div>
            )}
            {activeTab === "mission" && (
              <div className="animate-fadeIn">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To democratize access to quality internships for every student, regardless of their background.
                  We believe that every student deserves a chance to gain real-world experience and kickstart their career.
                </p>
              </div>
            )}
            {activeTab === "vision" && (
              <div className="animate-fadeIn">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  To become the go-to platform for student internships globally, creating a world where every student 
                  has equal opportunity to gain experience and build their career.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Timeline Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Journey</h3>
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="w-24 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">{item.year}</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Community</h3>
          <p className="text-gray-600 mb-6">Start your journey to a successful career today!</p>
          <div className="flex justify-center gap-4">
            <a
              href="/register"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Get Started
            </a>
            <a
              href="/contact"
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

