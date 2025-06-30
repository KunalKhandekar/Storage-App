// GitHubLoginButton.jsx
import { FaGithub } from "react-icons/fa";

export default function GitHubButton() {
  const handleLogin = () => {
    window.location.href = "http://localhost:3000/auth/github";
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center justify-center gap-3 px-6 py-3 bg-black text-white text-sm font-medium rounded-md shadow-md hover:bg-gray-900 transition-colors"
      aria-label="Continue with GitHub"
    >
      <FaGithub size={20} />
      Continue with GitHub
    </button>
  );
}
