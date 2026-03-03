import { Link } from "react-router-dom";

export default function Footer() {
  const footerLinks = {
    platform: [
      { name: "Browse Internships", path: "/internships" },
      { name: "For Students", path: "/register" },
      { name: "For Employers", path: "/employer" },
    ],
    company: [
      { name: "About Us", path: "/about" },
      { name: "Contact", path: "/contact" },
      { name: "Careers", path: "/careers" },
    ],
    support: [
      { name: "Help Center", path: "/help" },
      { name: "FAQs", path: "/faqs" },
      { name: "Safety", path: "/safety" },
    ],
  };

  return (
    <footer className="bg-slate-900 text-gray-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-white">MicroIntern</span>
            </Link>
            <p className="text-sm text-gray-500">
              Connecting students with their dream internships from top companies.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm hover:text-blue-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm hover:text-blue-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm hover:text-blue-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} MicroIntern. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/terms" className="hover:text-blue-400 transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

