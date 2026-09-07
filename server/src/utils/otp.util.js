import sendEmail from "../services/email.service.js";

export default async function otpTemplate(email, otp) {
  const otpSubject = `OTP Verificatoin Code For TargetIssue`;
  const otpText = `Yout OTP code is ${otp}`;
  const otpHtml = `
    <div class="max-w-2xl mx-auto my-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div class="bg-indigo-600 py-6 px-8">
            <h1 class="text-3xl font-bold text-white text-center">Your OTP Code</h1>
        </div>
        <div class="p-8">
            <p class="text-gray-700 mb-6">Hello,</p>
            <p class="text-gray-700 mb-6">Your One-Time Password (OTP) for account verification is:</p>
            <div class="bg-gray-100 rounded-lg p-4 mb-6">
                <p class="text-4xl font-bold text-center text-indigo-600">${otp}</p>
            </div>
            <p class="text-gray-700 mb-6">This OTP is valid for <span class="font-semibold">2 minutes</span>. Please do not share this code with anyone.</p>
            <p class="text-gray-700 mb-2">If you didn't request this code, please ignore this email.</p>
            <p class="text-gray-700">Thank you for using our service!</p>
        </div>
        <div class="bg-gray-100 py-4 px-8">
            <p class="text-sm text-gray-600 text-center">&copy; 2026 TargetIssue | All rights reserved.</p>
        </div>
    </div>
    `;
  await sendEmail(email, otpSubject, otpText, otpHtml);
}
