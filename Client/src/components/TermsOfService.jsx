import React from 'react';
import { FileText, Mail, MapPin, Calendar } from 'lucide-react';

export default function TermsOfService() {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-6 text-4xl font-bold text-gray-900">Terms of Service</h1>
          
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Last Updated: {currentDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Mumbai, Maharashtra, India</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <a href="mailto:kunalkhandekar.dev@gmail.com" className="text-blue-600 hover:underline">
                kunalkhandekar.dev@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 prose prose-gray max-w-none">
          <style>{`
            .prose ul {
              list-style-type: disc;
              padding-left: 1.5rem;
            }
            .prose li {
              margin-top: 0.25rem;
              margin-bottom: 0.25rem;
            }
          `}</style>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
          <p className="mb-6">
            Welcome to StoreMyStuff ("we", "our", "us"). By creating an account or using our services, you ("user", "you") agree to these Terms of Service ("Terms"). StoreMyStuff is a personal project offering online file storage, syncing, and sharing services. These Terms apply to all users from all countries. If you do not agree with any part of these Terms, please do not use the service.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Eligibility</h2>
          <p className="mb-6">
            There is no minimum age requirement to use StoreMyStuff. However, users must ensure local laws allow them to access cloud storage services.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Services Provided</h2>
          <p className="mb-3">StoreMyStuff allows users to:</p>
          <ul className="mb-6 space-y-1">
            <li>Upload, store, and manage files online</li>
            <li>Access files across multiple devices</li>
            <li>Share files via public or private links</li>
            <li>Use Google OAuth or GitHub OAuth for login</li>
            <li>Use Google Drive Read-Only access (only when user authorizes) for downloading files to our server</li>
          </ul>
          <p className="mb-6">We offer both free and paid plans.</p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Accounts</h2>
          <p className="mb-3">By creating an account:</p>
          <ul className="mb-6 space-y-1">
            <li>You agree to provide accurate information</li>
            <li>You may log in from multiple devices</li>
            <li>You may delete your account anytime</li>
            <li>We may temporarily disable or permanently suspend accounts involved in abuse or policy violations</li>
            <li>You are responsible for maintaining the security of your login credentials</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Free and Paid Plans</h2>
          <p className="mb-3"><strong>Free Plan:</strong> Storage limit of 500 MB per user</p>
          <p className="mb-6"><strong>Paid Plans:</strong> Paid plans offer additional storage and features (details available on the website). We may modify pricing or features in the future with notice.</p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. User Content & Responsibility</h2>
          <p className="mb-3">You may upload any file type, but:</p>
          <ul className="mb-3 space-y-1">
            <li>You are fully responsible for the content you upload</li>
            <li>You must ensure you have rights to store and share your files</li>
            <li>You are liable for any misuse, distribution, or harm caused by files you upload or share</li>
            <li>Public/guest links remain active until you manually revoke them</li>
          </ul>
          <p className="mb-6 font-medium text-amber-800">
            StoreMyStuff does not review, monitor, or scan uploaded files for illegal content, malware, copyrighted material, or harmful data.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Prohibited Activities</h2>
          <p className="mb-3">You must not:</p>
          <ul className="mb-3 space-y-1">
            <li>Upload malware, viruses, or harmful code</li>
            <li>Abuse the system or attempt unauthorized access</li>
            <li>Use the platform for unlawful purposes</li>
            <li>Share files or links that violate local or international laws</li>
          </ul>
          <p className="mb-6 font-medium text-red-700">Violation may lead to suspension or account termination.</p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Storage Policy</h2>
          <ul className="mb-6 space-y-1">
            <li>Files remain stored until the user deletes them</li>
            <li>We do not automatically expire or remove files</li>
            <li>Deleted files cannot be recovered</li>
            <li>We do not scan, alter, or process content except for storage and sharing features</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Privacy & Data Usage</h2>
          <p className="mb-3">
            StoreMyStuff does not collect analytics such as IP addresses, device information, or behavioral logs.
          </p>
          <p className="mb-2">We store only:</p>
          <ul className="mb-3 space-y-1">
            <li>Account details (email, OAuth identifiers)</li>
            <li>File metadata (filename, size, timestamp)</li>
            <li>Sharing information (who has access to shared files)</li>
          </ul>
          <p className="mb-4">We do not store EXIF metadata from your images.</p>
          
          <p className="mb-2 font-medium">Third-Party Services Used:</p>
          <ul className="mb-6 space-y-1">
            <li><strong>Amazon S3</strong> – storage of user files</li>
            <li><strong>AWS CloudFront</strong> – content delivery</li>
            <li><strong>Resend</strong> – sending OTP and notification emails</li>
            <li><strong>Google OAuth</strong> – user authentication</li>
            <li><strong>GitHub OAuth</strong> – user authentication</li>
          </ul>
          <p className="mb-6 text-sm text-gray-600">
            Your data may be stored or processed by these services according to their individual privacy policies.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Security</h2>
          <p className="mb-3">We implement industry-standard practices including:</p>
          <ul className="mb-3 space-y-1">
            <li>Hashed passwords</li>
            <li>Signed and secure cookies</li>
            <li>OTP verification for actions</li>
            <li>OAuth-based login</li>
            <li>Input sanitization</li>
            <li>Rate limiting</li>
            <li>Redis session storage</li>
            <li>Encrypted storage on S3.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Account Termination</h2>
          <p className="mb-3">We reserve the right to:</p>
          <ul className="mb-3 space-y-1">
            <li>Suspend accounts involved in abuse</li>
            <li>Delete content violating laws or policies</li>
            <li>Block suspicious activity</li>
            <li>Restrict features for misbehaving accounts</li>
          </ul>
          <p className="mb-6 font-medium text-green-700">Users may delete their own account at any time.</p>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Reporting Abuse/Misuse</h2>
          <p className="mb-3">
            If you discover illegal or harmful content being shared via StoreMyStuff, report it to <a href="mailto:kunalkhandekar.dev@gmail.com" className="text-blue-600 hover:underline">kunalkhandekar.dev@gmail.com</a>
          </p>
          <p className="mb-6 text-sm text-gray-600">
            We will take appropriate action based on the severity and laws of India.
          </p>
    
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>© 2025 StoreMyStuff. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}