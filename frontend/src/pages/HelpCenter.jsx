export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Help Center</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">How do I apply for an internship?</h3>
            <p className="text-gray-600">Browse our internship listings and click on any position to view details and apply.</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">How do I create an account?</h3>
            <p className="text-gray-600">Click on "Register" in the navigation and choose either Student or Employer registration.</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">How do employers post tasks?</h3>
            <p className="text-gray-600">Employers can post tasks from their dashboard after logging in.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">How do I verify my student status?</h3>
            <p className="text-gray-600">Go to the Verify section in your dashboard and submit your student ID for verification.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

