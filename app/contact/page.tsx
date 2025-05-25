import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLinkedin, faGithub, faMedium, faDev } from "@fortawesome/free-brands-svg-icons"

export default function Contact() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Contact Me</h1>
      <p className="mb-4">I'd love to hear from you! Feel free to reach out through the following channels:</p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Email</h2>
        <p>john@johnmunn.tech</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Social Media</h2>
        <div className="flex space-x-4">
          <a href="https://www.linkedin.com/in/john-munn-bbab434b/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} size="2x" className="text-blue-500 hover:text-blue-700" />
          </a>
          <a href="https://github.com/Tawe" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} size="2x" className="text-gray-800 hover:text-gray-600" />
          </a>
          <a href="https://medium.com/@johnmunn" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faMedium} size="2x" className="text-green-500 hover:text-green-700" />
          </a>
          <a href="https://dev.to/tawe" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faDev} size="2x" className="text-orange-500 hover:text-orange-700" />
          </a>
        </div>
      </div>
    </div>
  )
}
