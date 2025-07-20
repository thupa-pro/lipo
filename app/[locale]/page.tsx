export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Local Services Redefined
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with AI-matched, verified local professionals who deliver exceptional quality service.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/browse" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Find Services Now
            </a>
            <a href="/become-provider" className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Become a Provider
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
