export default function Footer() {
  return (
    <footer className="bg-primary-900 text-blue-100 pt-12 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-white mb-3">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/case-status" className="hover:text-white">
                  Case Status
                </a>
              </li>
              <li>
                <a href="/cause-list" className="hover:text-white">
                  Cause List
                </a>
              </li>
              <li>
                <a href="/efiling" className="hover:text-white">
                  e-Filing
                </a>
              </li>
              <li>
                <a href="/judgments" className="hover:text-white">
                  Judgments
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  About the Portal
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Organizational Structure
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>Helpline: 1800-XXX-XXXX</li>
              <li>support@judiciary.gov</li>
              <li>Working Hours: 9:30 AM – 6:00 PM</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-800 pt-6 text-center text-sm">
          <p>
            © 2026 National Judiciary Portal. All rights reserved. Designed for
            transparency and access to justice.
          </p>
        </div>
      </div>
    </footer>
  );
}
