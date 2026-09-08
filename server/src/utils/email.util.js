import sendEmail from "../services/email.service.js";

export async function otpTemplate(email, otp) {
  const otpSubject = `OTP Verificatoin Code For TargetIssue`;
  const otpText = `Yout OTP code is ${otp}`;
  const otpHtml = `
    <div className="max-w-2xl mx-auto my-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-indigo-600 py-6 px-8">
            <h1 className="text-3xl font-bold text-white text-center">Your OTP Code</h1>
        </div>
        <div className="p-8">
            <p className="text-gray-700 mb-6">Hello,</p>
            <p className="text-gray-700 mb-6">Your One-Time Password (OTP) for account verification is:</p>
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <p className="text-4xl font-bold text-center text-indigo-600">${otp}</p>
            </div>
            <p className="text-gray-700 mb-6">This OTP is valid for <span className="font-semibold">2 minutes</span>. Please do not share this code with anyone.</p>
            <p className="text-gray-700 mb-2">If you didn't request this code, please ignore this email.</p>
            <p className="text-gray-700">Thank you for using our service!</p>
        </div>
        <div className="bg-gray-100 py-4 px-8">
            <p className="text-sm text-gray-600 text-center">&copy; 2026 TargetIssue | All rights reserved.</p>
        </div>
    </div>
    `;
  await sendEmail(email, otpSubject, otpText, otpHtml);
}

export async function passwordResetTemplate(email, link) {
  const linkSubject = `Password Reset Request For TargetIssue`;
  const linkText = `Your password reset link is: ${link} 
  Do not Share this link with anyone.
  `;
  const linkHtml = `
    <div className="max-w-2xl mx-auto my-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-indigo-600 py-6 px-8">
            <h1 className="text-3xl font-bold text-white text-center">Click the button below</h1>
        </div>
        <div className="p-8">
           
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
               <a href"${link}" className="bg-indigo-600 py-2 px-3 rounded-lg text-white hover:bg-indigo-700 hover:scale-105 transition-all duration-200"   target="_blank">link</a></p>
            </div>
            <p className="text-gray-700 mb-6">This password reset link is valid for <span className="font-semibold">5 minutes</span>. Please do not share this link with anyone.</p>
            <p className="text-gray-700 mb-2">If you didn't request this link, please ignore this email.</p>
             <p className="text-gray-700 mb-2">Incase if the button dose not work: <a href"${link}"  target="_blank">link</a></p>

            <p className="text-gray-700">Thank you for using our service!</p>
        </div>
        <div className="bg-gray-100 py-4 px-8">
            <p className="text-sm text-gray-600 text-center">&copy; 2026 TargetIssue | All rights reserved.</p>
        </div>
    </div>
    `;
  await sendEmail(email, linkSubject, linkText, linkHtml);
}
