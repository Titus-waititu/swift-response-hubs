import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-blue-950 dark:bg-slate-950 text-blue-50 dark:text-slate-300 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-teal-600 rounded-sm flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <h3 className="font-semibold text-lg">SARS</h3>
            </div>
            <p className="text-sm text-blue-100 dark:text-slate-400 leading-relaxed">
              Smart Accident Reporting System. Empowering emergency response
              with intelligence and speed.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white dark:text-slate-50">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-sm text-blue-100 dark:text-slate-400 hover:text-teal-400 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-sm text-blue-100 dark:text-slate-400 hover:text-teal-400 transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-sm text-blue-100 dark:text-slate-400 hover:text-teal-400 transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="/documentation"
                  className="text-sm text-blue-100 dark:text-slate-400 hover:text-teal-400 transition-colors"
                >
                  Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white dark:text-slate-50">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about"
                  className="text-sm text-blue-100 dark:text-slate-400 hover:text-teal-400 transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-sm text-blue-100 dark:text-slate-400 hover:text-teal-400 transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/help"
                  className="text-sm text-blue-100 dark:text-slate-400 hover:text-teal-400 transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-sm text-blue-100 dark:text-slate-400 hover:text-teal-400 transition-colors"
                >
                  Terms
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white dark:text-slate-50">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/privacy"
                  className="text-sm text-blue-100 dark:text-slate-400 hover:text-teal-400 transition-colors"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-sm text-blue-100 dark:text-slate-400 hover:text-teal-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/cookies"
                  className="text-sm text-blue-100 dark:text-slate-400 hover:text-teal-400 transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-900 dark:border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          {/* Copyright */}
          <p className="text-sm text-blue-100 dark:text-slate-400">
            © 2024 Smart Accident Reporting System. All rights reserved.
          </p>

          {/* Social Links (Optional) */}
          <div className="flex gap-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-blue-100 dark:text-slate-400 hover:text-teal-400 transition-colors text-sm"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-blue-100 dark:text-slate-400 hover:text-teal-400 transition-colors text-sm"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="text-blue-100 dark:text-slate-400 hover:text-teal-400 transition-colors text-sm"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
