import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChefHat,
  BarChart2,
  LineChart,
  Utensils,
  Clock,
  ArrowRight,
  ChevronRight,
  CheckCircle,
  RefreshCw,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Landing() {
  const [activeFeature, setActiveFeature] = useState("inventory");

  return (
    <div className="bg-gradient-to-b from-amber-50 to-white min-h-screen">
      {/* Nav */}
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ChefHat className="h-8 w-8 text-orange-600" />
          <span className="font-bold text-xl">SmartRasoi</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium hover:text-orange-600"
          >
            Login
          </Link>
          <Button
            variant="default"
            className="bg-orange-600 hover:bg-orange-700"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 space-y-6">
          <div className="inline-block bg-orange-100 text-orange-800 px-4 py-1 rounded-full text-sm font-medium">
            Smart Kitchen Management for Indian Restaurants
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Transform Your Restaurant with{" "}
            <span className="text-orange-600">AI-Powered Insights</span>
          </h1>
          <p className="text-lg text-gray-600">
            SmartRasoi helps Indian restaurants reduce food waste, optimize
            inventory, and maximize profits with AI-driven menu planning and
            real-time analytics.
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
              Schedule Demo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
          <div className="flex items-center gap-6 pt-6">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden"
                >
                  <img
                    src={`https://randomuser.me/api/portraits/men/${
                      20 + i
                    }.jpg`}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="text-sm">
              <div className="font-medium">Trusted by 500+ restaurants</div>
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
                <span className="text-gray-600 ml-1">4.9/5</span>
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 p-4 bg-white rounded-xl shadow-xl">
          <img
            src="/hero-dashboard.png"
            alt="SmartRasoi Dashboard"
            className="w-full h-auto rounded-lg border border-gray-200"
            // If you don't have this image, use a placeholder:
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/600x400/orange/white?text=SmartRasoi+Dashboard";
            }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Designed for Indian Restaurant Operations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform is specifically tailored for Indian cuisine and
              restaurant management, from inventory tracking to AI-powered menu
              suggestions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-amber-50 p-6 rounded-xl">
              <div className="bg-orange-100 p-3 rounded-full w-fit mb-4">
                <RefreshCw className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Reduce Food Waste</h3>
              <p className="text-gray-600">
                Track expiry dates and get AI-suggested recipes to use
                ingredients before they expire, reducing waste by up to 30%.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Real-time expiry tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Smart inventory management</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-orange-50 p-6 rounded-xl">
              <div className="bg-orange-100 p-3 rounded-full w-fit mb-4">
                <Utensils className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Menu Planning</h3>
              <p className="text-gray-600">
                Generate creative dishes from your inventory optimized for
                Indian cuisine - from regional specialties to fusion dishes.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Regional cuisine algorithms</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Seasonal menu suggestions</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-amber-50 p-6 rounded-xl">
              <div className="bg-orange-100 p-3 rounded-full w-fit mb-4">
                <BarChart2 className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Profit Optimization</h3>
              <p className="text-gray-600">
                Analyze sales trends and food costs to optimize your menu
                pricing and increase profitability.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Menu engineering</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Cost-to-menu price analysis</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Features Demo */}
      <section className="py-20 bg-gradient-to-b from-white to-amber-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            How SmartRasoi Works
          </h2>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 space-y-6">
              <div
                className={`p-4 rounded-lg cursor-pointer ${
                  activeFeature === "inventory"
                    ? "bg-orange-100 border-l-4 border-orange-600"
                    : "bg-white hover:bg-orange-50"
                }`}
                onClick={() => setActiveFeature("inventory")}
              >
                <h3 className="font-bold flex items-center">
                  <span className="bg-orange-200 p-2 rounded-md mr-3">
                    <Clock className="h-5 w-5 text-orange-700" />
                  </span>
                  Smart Inventory Management
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Track inventory in real-time with expiry alerts and automated
                  reordering.
                </p>
              </div>

              <div
                className={`p-4 rounded-lg cursor-pointer ${
                  activeFeature === "menu"
                    ? "bg-orange-100 border-l-4 border-orange-600"
                    : "bg-white hover:bg-orange-50"
                }`}
                onClick={() => setActiveFeature("menu")}
              >
                <h3 className="font-bold flex items-center">
                  <span className="bg-orange-200 p-2 rounded-md mr-3">
                    <ChefHat className="h-5 w-5 text-orange-700" />
                  </span>
                  AI Recipe Generation
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Create data-driven recipes from your on-hand ingredients with
                  one click.
                </p>
              </div>

              <div
                className={`p-4 rounded-lg cursor-pointer ${
                  activeFeature === "analytics"
                    ? "bg-orange-100 border-l-4 border-orange-600"
                    : "bg-white hover:bg-orange-50"
                }`}
                onClick={() => setActiveFeature("analytics")}
              >
                <h3 className="font-bold flex items-center">
                  <span className="bg-orange-200 p-2 rounded-md mr-3">
                    <LineChart className="h-5 w-5 text-orange-700" />
                  </span>
                  Restaurant Analytics
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Gain insights from your sales data to optimize menu and
                  pricing strategies.
                </p>
              </div>
            </div>

            <div className="md:w-2/3 bg-white p-6 rounded-xl shadow-lg">
              {activeFeature === "inventory" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">
                    Keep Track of Your Ingredients
                  </h3>
                  <p>
                    SmartRasoi monitors your ingredient levels and alerts you
                    when items are running low or nearing expiry.
                  </p>
                  <img
                    src="/inventory-demo.png"
                    alt="Inventory tracking demo"
                    className="w-full h-auto rounded-lg border border-gray-200 mt-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/800x500/orange/white?text=Inventory+Management";
                    }}
                  />
                  <div className="bg-amber-50 p-4 rounded-lg mt-4 border-l-4 border-amber-500">
                    <p className="text-sm font-medium">Real customer result:</p>
                    <p className="text-sm">
                      Taj Spice Restaurant reduced food waste by 37% in their
                      first month using SmartRasoi's inventory management.
                    </p>
                  </div>
                </div>
              )}

              {activeFeature === "menu" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">
                    AI-Powered Menu Generation
                  </h3>
                  <p>
                    Generate creative Indian dishes based on your available
                    ingredients, cuisine preferences, and sales data.
                  </p>
                  <img
                    src="/menu-demo.png"
                    alt="AI Menu demo"
                    className="w-full h-auto rounded-lg border border-gray-200 mt-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/800x500/orange/white?text=AI+Menu+Generation";
                    }}
                  />
                  <div className="bg-amber-50 p-4 rounded-lg mt-4 border-l-4 border-amber-500">
                    <p className="text-sm font-medium">Real customer result:</p>
                    <p className="text-sm">
                      Punjab Grill created 12 new profitable dishes in one
                      quarter using SmartRasoi's AI recipe generator.
                    </p>
                  </div>
                </div>
              )}

              {activeFeature === "analytics" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Data-Driven Insights</h3>
                  <p>
                    Understand your restaurant's performance with visual
                    analytics and actionable recommendations.
                  </p>
                  <img
                    src="/analytics-demo.png"
                    alt="Analytics demo"
                    className="w-full h-auto rounded-lg border border-gray-200 mt-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/800x500/orange/white?text=Restaurant+Analytics";
                    }}
                  />
                  <div className="bg-amber-50 p-4 rounded-lg mt-4 border-l-4 border-amber-500">
                    <p className="text-sm font-medium">Real customer result:</p>
                    <p className="text-sm">
                      Curry Leaf Kitchen increased their profit margin by 23%
                      after implementing menu pricing changes based on
                      SmartRasoi insights.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Trusted by Restaurants Across India
          </h2>

          <Tabs defaultValue="north" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-4">
              <TabsTrigger value="north">North</TabsTrigger>
              <TabsTrigger value="south">South</TabsTrigger>
              <TabsTrigger value="east">East</TabsTrigger>
              <TabsTrigger value="west">West</TabsTrigger>
            </TabsList>

            <div className="mt-8">
              <TabsContent
                value="north"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <TestimonialCard
                  name="Vikram Singh"
                  role="Owner, Punjab Grill"
                  quote="SmartRasoi has revolutionized how we manage our kitchen inventory. We've cut food waste by 40% and discovered new profitable dishes using their AI suggestions."
                  image="https://randomuser.me/api/portraits/men/32.jpg"
                />
                <TestimonialCard
                  name="Priya Sharma"
                  role="Head Chef, Delhi Darbar"
                  quote="The AI-powered recipe suggestions are tailored perfectly for North Indian cuisine. We've added 6 new popular dishes to our menu in just 2 months."
                  image="https://randomuser.me/api/portraits/women/44.jpg"
                />
              </TabsContent>

              <TabsContent
                value="south"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <TestimonialCard
                  name="Rajeev Menon"
                  role="Manager, Chennai Express"
                  quote="SmartRasoi understands the unique ingredients in South Indian cuisine and helps us track everything from curry leaves to coconuts efficiently."
                  image="https://randomuser.me/api/portraits/men/22.jpg"
                />
                <TestimonialCard
                  name="Lakshmi Iyer"
                  role="Owner, Dosa Factory"
                  quote="The analytics have helped us optimize our menu pricing. Our profit margins have increased by 22% since we started using SmartRasoi."
                  image="https://randomuser.me/api/portraits/women/29.jpg"
                />
              </TabsContent>

              <TabsContent
                value="east"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <TestimonialCard
                  name="Debashish Roy"
                  role="Owner, Kolkata Kitchen"
                  quote="The seasonal menu suggestions align perfectly with Bengali cuisine traditions. It's like having a local expert in our kitchen."
                  image="https://randomuser.me/api/portraits/men/52.jpg"
                />
                <TestimonialCard
                  name="Anjali Chatterjee"
                  role="Manager, Eastern Spice"
                  quote="We've reduced our ordering costs significantly. The inventory predictions are remarkably accurate for our specific needs."
                  image="https://randomuser.me/api/portraits/women/33.jpg"
                />
              </TabsContent>

              <TabsContent
                value="west"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <TestimonialCard
                  name="Rajesh Patel"
                  role="Owner, Bombay Brasserie"
                  quote="Our staff adapted to SmartRasoi instantly. The interface is intuitive and the Gujarati menu suggestions are spot on."
                  image="https://randomuser.me/api/portraits/men/42.jpg"
                />
                <TestimonialCard
                  name="Meera Desai"
                  role="Head Chef, Goa Coastal"
                  quote="The seafood inventory tracking helps us maintain freshness. The system understands the unique challenges of coastal cuisine."
                  image="https://randomuser.me/api/portraits/women/68.jpg"
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join hundreds of Indian restaurants using SmartRasoi to reduce
            waste, increase profits, and delight customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="default"
              className="bg-white text-orange-600 hover:bg-gray-100"
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-orange-700"
            >
              Schedule Demo
            </Button>
          </div>
          <p className="mt-6 text-sm text-orange-100">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ChefHat className="h-6 w-6 text-orange-500" />
                <span className="font-bold text-white text-lg">SmartRasoi</span>
              </div>
              <p className="text-sm">
                AI-powered kitchen management designed specifically for Indian
                restaurants.
              </p>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Recipe Database
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Partner Program
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-sm text-center">
            <p>© 2025 SmartRasoi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Testimonial Card Component
function TestimonialCard({ name, role, quote, image }) {
  return (
    <div className="bg-amber-50 p-6 rounded-xl relative">
      <div className="flex items-center mb-4">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full mr-4"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/100/orange/white?text=User";
          }}
        />
        <div>
          <h4 className="font-bold">{name}</h4>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
      <p className="text-gray-700 italic relative">
        <span className="text-orange-400 text-4xl absolute -top-2 -left-1">
          "
        </span>
        <span className="pl-4">{quote}</span>
      </p>
      <div className="flex text-orange-500 mt-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    </div>
  );
}
