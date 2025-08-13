import { useState } from "react";
import {
  BiUser,
  BiRuler,
  BiFolder,
  BiCalendar,
  BiGrid,
  BiBrain,
  BiMenu,
  BiX,
} from "react-icons/bi";
import { Link } from "react-router";
import Button from "../components/ui/Button";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            Kunibi Fashion Software
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link to="/login">
              <Button className="py-2 px-6 rounded-md border-gray-300 text-gray-700 hover:bg-gray-50">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="py-2 px-6 rounded-md bg-black/90 text-white hover:bg-black/80">
                Sign Up
              </Button>
            </Link>
          </nav>
          <div className="md:hidden">
            <button onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? (
                <BiX className="h-6 w-6 text-gray-900" />
              ) : (
                <BiMenu className="h-6 w-6 text-gray-900" />
              )}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="flex flex-col items-center py-4 space-y-2">
              <Link to="/login" onClick={toggleMenu}>
                <Button className="py-2 px-6 rounded-md w-32 border-gray-300 text-gray-700 hover:bg-gray-50">
                  Login
                </Button>
              </Link>
              <Link to="/signup" onClick={toggleMenu}>
                <Button className="py-2 px-6 rounded-md w-32 bg-black/90 text-white hover:bg-black/80">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Streamline Your Design Business
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Manage clients, measurements, projects, and schedules with ease. Boost
          productivity with our all-in-one solution.
        </p>
        <Link to="/signup">
          <Button className="py-2 px-6 rounded-md bg-black/90 text-white hover:bg-black/80 text-lg">
            Get Started
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Features
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
            <BiUser className="h-12 w-12 text-gray-900 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Client Management
            </h3>
            <p className="text-gray-600">
              Organize client details, track interactions, and maintain strong
              relationships effortlessly.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
            <BiRuler className="h-12 w-12 text-gray-900 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Measurements
            </h3>
            <p className="text-gray-600">
              Store and manage precise client measurements for perfect designs
              every time.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
            <BiFolder className="h-12 w-12 text-gray-900 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Project Management
            </h3>
            <p className="text-gray-600">
              Track project progress, budgets, and deadlines to deliver on time.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
            <BiCalendar className="h-12 w-12 text-gray-900 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Calendar Scheduling
            </h3>
            <p className="text-gray-600">
              Schedule appointments, fittings, and deadlines with a powerful
              calendar.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
            <BiGrid className="h-12 w-12 text-gray-900 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Patterns
            </h3>
            <p className="text-gray-600">
              Create and manage design patterns for efficient workflows (coming
              soon).
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
            <BiBrain className="h-12 w-12 text-gray-900 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              AI-Patterns
            </h3>
            <p className="text-gray-600">
              Leverage AI to generate innovative design patterns (coming soon).
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-200 text-center">
        <p className="text-gray-600">
          &copy; 2025 DesignPro. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
