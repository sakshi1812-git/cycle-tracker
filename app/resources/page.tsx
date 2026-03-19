import Link from 'next/link'

const resources = [
  {
    label: 'Find Gynecologists Near Me',
    href: 'https://www.google.com/maps/search/gynecologist+near+me',
  },
  {
    label: "Find Women's Health Clinics Near Me",
    href: "https://www.google.com/maps/search/women's+health+clinic+near+me",
  },
  {
    label: 'Find Planned Parenthood Near Me',
    href: 'https://www.google.com/maps/search/planned+parenthood+near+me',
  },
]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-8 rounded-3xl border border-pink-100 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-pink-800">Find Help 🩺</h1>
          <p className="mt-3 text-pink-600">
            You are not alone. Support is nearby, and reaching out is a strong
            and caring step for your health.
          </p>
          <p className="mt-4 rounded-xl border border-purple-100 bg-purple-50 px-4 py-3 text-sm text-purple-700">
            Click any button below and Google Maps will automatically use your
            current location to find options near you.
          </p>
        </div>

        <div className="space-y-4">
          {resources.map((resource) => (
            <a
              key={resource.label}
              href={resource.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl border border-pink-100 bg-white px-5 py-4 text-center text-base font-semibold text-pink-700 shadow-sm transition hover:border-pink-200 hover:bg-pink-50 hover:text-purple-700"
            >
              {resource.label}
            </a>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-rose-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-rose-700">Emergency Support</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <p>National Women&apos;s Health Hotline: 1-800-994-9662</p>
            <p>Planned Parenthood Hotline: 1-800-230-PLAN</p>
            <p>Crisis Text Line: Text HOME to 741741</p>
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/dashboard"
            className="inline-flex rounded-xl border border-pink-200 bg-white px-4 py-2 text-sm font-medium text-pink-700 transition hover:bg-pink-100"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
