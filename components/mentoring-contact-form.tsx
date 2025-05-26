"use client"
import { useState } from "react"
import { useActionState } from "react-dom"
import { submitMentoringForm } from "@/app/actions/forms"

interface MentoringContactFormProps {
  mentorName: string
  mentorEmail: string
}

function MentoringContactForm({ mentorName, mentorEmail }: MentoringContactFormProps) {
  const initialState = { message: null }
  const [state, dispatch] = useActionState(submitMentoringForm, initialState)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

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
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your Email"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
          Message:
        </label>
        <textarea
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your Message"
          required
        ></textarea>
      </div>

      {state?.message && <div className="mb-4 text-red-500">{state.message}</div>}

      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Send Message
        </button>
      </div>
    </form>
  )
}

export { MentoringContactForm }
