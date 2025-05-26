"use client"
import { useActionState } from "react"
import { submitMentoringForm } from "@/app/actions/forms"

interface MentoringContactFormProps {
  mentorName: string
  mentorEmail: string
}

function MentoringContactForm({ mentorName, mentorEmail }: MentoringContactFormProps) {
  const initialState = { message: null }
  const [state, dispatch] = useActionState(submitMentoringForm, initialState)

  return (
    <form action={dispatch} className="max-w-lg mx-auto">
      <input type="hidden" name="mentorName" value={mentorName} />
      <input type="hidden" name="mentorEmail" value={mentorEmail} />

      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
          Your Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your Name"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
          Your Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your Email"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="currentRole" className="block text-gray-700 text-sm font-bold mb-2">
          Current Role:
        </label>
        <input
          type="text"
          id="currentRole"
          name="currentRole"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your Current Role"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="yearsInTech" className="block text-gray-700 text-sm font-bold mb-2">
          Years in Tech:
        </label>
        <select
          id="yearsInTech"
          name="yearsInTech"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Select years of experience</option>
          <option value="0-2">0-2 years</option>
          <option value="3-5">3-5 years</option>
          <option value="6-10">6-10 years</option>
          <option value="11-15">11-15 years</option>
          <option value="15+">15+ years</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="timeZone" className="block text-gray-700 text-sm font-bold mb-2">
          Time Zone:
        </label>
        <select
          id="timeZone"
          name="timeZone"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Select your time zone</option>
          <option value="EST">Eastern Time (EST)</option>
          <option value="CST">Central Time (CST)</option>
          <option value="MST">Mountain Time (MST)</option>
          <option value="PST">Pacific Time (PST)</option>
          <option value="other">Other (Currently not available)</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Preferred Meeting Times:</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" name="preferredTimes" value="morning" className="mr-2" />
            Morning (9 AM - 12 PM)
          </label>
          <label className="flex items-center">
            <input type="checkbox" name="preferredTimes" value="afternoon" className="mr-2" />
            Afternoon (12 PM - 5 PM)
          </label>
          <label className="flex items-center">
            <input type="checkbox" name="preferredTimes" value="evening" className="mr-2" />
            Evening (5 PM - 8 PM)
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="hearAbout" className="block text-gray-700 text-sm font-bold mb-2">
          How did you hear about me? (Optional):
        </label>
        <input
          type="text"
          id="hearAbout"
          name="hearAbout"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="LinkedIn, referral, blog, etc."
        />
      </div>

      <div className="mb-6">
        <label htmlFor="currentChallenge" className="block text-gray-700 text-sm font-bold mb-2">
          Current Challenge or Goal:
        </label>
        <textarea
          id="currentChallenge"
          name="currentChallenge"
          rows={4}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Describe your current leadership challenge or what you'd like to work on..."
          required
        ></textarea>
      </div>

      {state?.message && (
        <div className={`mb-4 ${state.error ? "text-red-500" : "text-green-500"}`}>{state.message}</div>
      )}

      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          type="submit"
        >
          Submit Application
        </button>
      </div>
    </form>
  )
}

export { MentoringContactForm }
