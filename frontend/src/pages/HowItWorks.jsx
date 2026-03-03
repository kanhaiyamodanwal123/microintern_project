import { useNavigate } from "react-router-dom";

export default function HowItWorks() {
  const navigate = useNavigate();

  const steps = [
    {
      icon: "📝",
      title: "Create Your Profile",
      description: "Sign up as a student and complete your profile with your education details, skills, and interests.",
    },
    {
      icon: "🎓",
      title: "Get Verified",
      description: "Verify your student identity using your college ID to unlock more opportunities and build trust with employers.",
    },
    {
      icon: "🔍",
      title: "Browse Internships",
      description: "Explore thousands of internship opportunities from top companies that match your skills and interests.",
    },
    {
      icon: "📤",
      title: "Apply with One Click",
      description: "Submit your application directly through the platform. Your profile and verified status help you stand out.",
    },
    {
      icon: "💬",
      title: "Connect with Employers",
      description: "Receive messages from employers, attend interviews, and negotiate your internship terms.",
    },
    {
      icon: "🚀",
      title: "Start Your Career",
      description: "Get hired, gain real-world experience, and kickstart your professional journey.",
    },
  ];

  const features = [
    {
      icon: "✅",
      title: "Verified Students",
      description: "Verified students get 3x more responses from employers",
    },
    {
      icon: "💰",
      title: "Stipend Protection",
      description: "All internships come with guaranteed stipend payments",
    },
    {
      icon: "🏢",
      title: "Top Companies",
      description: "Access internships from MNCs and growing startups",
    },
    {
      icon: "📊",
      title: "Easy Tracking",
      description: "Track all your applications in one dashboard",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold">
            How <span className="text-blue-600">MicroIntern</span> Works
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your journey from registration to landing your dream internship in just 6 simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:bg-gray-100 transition duration-300 relative"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-4xl mb-6">
                  {step.icon}
                </div>
                <div className="absolute top-8 right-8 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose <span className="text-blue-600">MicroIntern</span>?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-blue-50 border border-blue-200 rounded-xl p-6"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-3xl p-12 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-8">
              Join thousands of students who have already found their dream internships
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition"
              >
                Sign Up as Student →
              </button>
              <button
                onClick={() => navigate("/employer")}
                className="px-8 py-4 bg-gray-200 hover:bg-gray-300 border border-gray-300 text-gray-800 rounded-full font-semibold transition"
              >
                I'm an Employer
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: "Is it free to register?",
                a: "Yes! Registration is completely free for students.",
              },
              {
                q: "How do I verify my student status?",
                a: "Upload your college ID card or any document proving your student status in the verification section.",
              },
              {
                q: "Are these internships paid?",
                a: "Most internships on our platform offer stipend. You can filter by stipend amount while searching.",
              },
              {
                q: "How long does verification take?",
                a: "Verification typically takes 24-48 hours once you submit your documents.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-xl p-6"
              >
                <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
