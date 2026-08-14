"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

const STEPS = [
  { id: 1, label: "Case Details" },
  { id: 2, label: "Parties" },
  { id: 3, label: "Documents" },
  { id: 4, label: "Payment & Submit" },
];

export default function EFilingPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  if (submitted) {
    return (
      <>
        <Header active="efiling" />
        <main className="max-w-2xl mx-auto px-4 py-16 text-center flex-1">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-primary-900 mb-2">
            Filing Submitted Successfully
          </h1>
          <p className="text-gray-600 mb-6">
            Your case has been submitted for scrutiny. You will receive an SMS
            and email once a CNR is generated.
          </p>
          <div className="bg-white border rounded-xl p-6 text-left mb-8">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Temporary Filing No.</dt>
                <dd className="font-mono font-medium">TMP-2026-084521</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Status</dt>
                <dd>
                  <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                    Under Scrutiny
                  </span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Submitted at</dt>
                <dd>14 Aug 2026, 11:45 PM</dd>
              </div>
            </dl>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 bg-primary-700 text-white rounded-lg font-medium hover:bg-primary-800"
            >
              Go to Dashboard
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setStep(1);
              }}
              className="px-5 py-2.5 border rounded-lg hover:bg-gray-50"
            >
              File Another Case
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header active="efiling" />

      <main className="max-w-5xl mx-auto px-4 py-8 flex-1">
        <h1 className="text-2xl font-bold text-primary-900 mb-2">e-Filing</h1>
        <p className="text-gray-600 mb-8">
          File new cases and applications online. All steps are saved as draft.
        </p>

        {/* Progress steps */}
        <div className="flex items-center justify-between mb-10 max-w-2xl mx-auto">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition ${
                    step === s.id
                      ? "bg-primary-700 text-white"
                      : step > s.id
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > s.id ? "✓" : s.id}
                </div>
                <span
                  className={`text-xs mt-1.5 whitespace-nowrap ${
                    step === s.id
                      ? "font-medium text-primary-800"
                      : "text-gray-500"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded ${
                    step > s.id ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white border rounded-xl p-6 md:p-8 shadow-sm">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-primary-900 mb-2">
                Step 1: Basic Case Information
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1">Court Level *</label>
                  <select className="w-full border rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-primary-500">
                    <option>Select Court Level</option>
                    <option>District / Taluka Court</option>
                    <option>High Court</option>
                    <option>Supreme Court</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State *</label>
                  <select className="w-full border rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-primary-500">
                    <option>Select State</option>
                    <option>Delhi</option>
                    <option>Maharashtra</option>
                    <option>Karnataka</option>
                    <option>Tamil Nadu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Court Complex *</label>
                  <select className="w-full border rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-primary-500">
                    <option>Select Court Complex</option>
                    <option>District Court Complex, New Delhi</option>
                    <option>Tis Hazari Courts</option>
                    <option>Patiala House Courts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Case Type *</label>
                  <select className="w-full border rounded-lg px-3 py-2.5 bg-white focus:ring-2 focus:ring-primary-500">
                    <option>Select Case Type</option>
                    <option>Civil Suit</option>
                    <option>Criminal Case</option>
                    <option>Writ Petition</option>
                    <option>Bail Application</option>
                    <option>Appeal</option>
                    <option>Revision</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject / Cause Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Recovery of money / Quashing of FIR"
                  className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Brief Facts / Prayer</label>
                <textarea
                  rows={4}
                  className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter brief description of the case..."
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-primary-900">Step 2: Parties & Advocates</h2>
              <div className="border rounded-lg p-5 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-primary-800">Petitioner / Applicant</h3>
                  <button type="button" className="text-sm text-primary-700 hover:underline">+ Add another</button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                    <input type="text" className="w-full border rounded-lg px-3 py-2.5 bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Age / Gender</label>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Age" className="w-24 border rounded-lg px-3 py-2.5 bg-white" />
                      <select className="flex-1 border rounded-lg px-3 py-2.5 bg-white">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <textarea rows={2} className="w-full border rounded-lg px-3 py-2.5 bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Advocate Name</label>
                    <input type="text" placeholder="Search or enter name" className="w-full border rounded-lg px-3 py-2.5 bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Enrollment No.</label>
                    <input type="text" placeholder="e.g. D/1234/2015" className="w-full border rounded-lg px-3 py-2.5 bg-white" />
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-5 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-primary-800">Respondent / Opposite Party</h3>
                  <button type="button" className="text-sm text-primary-700 hover:underline">+ Add another</button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                    <input type="text" className="w-full border rounded-lg px-3 py-2.5 bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <input type="text" className="w-full border rounded-lg px-3 py-2.5 bg-white" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-primary-900">Step 3: Upload Documents</h2>
              <p className="text-sm text-gray-600">
                Upload all supporting documents in PDF format (max 10 MB each). You can e-Sign after upload.
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition cursor-pointer bg-gray-50">
                <div className="text-4xl mb-3">📄</div>
                <p className="font-medium text-gray-800">Drag & drop files here or click to browse</p>
                <p className="text-sm text-gray-500 mt-1">PDF, JPG, PNG • Max 10 MB per file</p>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Uploaded files</h3>
                {[
                  { name: "Petition.pdf", size: "1.2 MB", status: "Uploaded" },
                  { name: "Annexure-A.pdf", size: "850 KB", status: "Uploaded" },
                  { name: "Vakalatnama.pdf", size: "320 KB", status: "Pending e-Sign" },
                ].map((f) => (
                  <div key={f.name} className="flex items-center justify-between bg-white border rounded-lg px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📎</span>
                      <div>
                        <p className="text-sm font-medium">{f.name}</p>
                        <p className="text-xs text-gray-500">{f.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${f.status === "Uploaded" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                        {f.status}
                      </span>
                      <button className="text-sm text-red-600 hover:underline">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm">
                <p className="font-medium text-primary-800 mb-1">e-Sign available</p>
                <p className="text-gray-600">After uploading, you can e-Sign documents using Aadhaar eSign or Digital Signature Certificate (DSC).</p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-primary-900">Step 4: Fee Payment & Final Submit</h2>
              <div className="bg-gray-50 border rounded-lg p-5">
                <h3 className="font-medium mb-3">Fee Summary</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between"><dt>Court Fee</dt><dd>₹ 500.00</dd></div>
                  <div className="flex justify-between"><dt>Process Fee</dt><dd>₹ 100.00</dd></div>
                  <div className="flex justify-between"><dt>Miscellaneous</dt><dd>₹ 50.00</dd></div>
                  <div className="flex justify-between border-t pt-2 font-semibold text-base">
                    <dt>Total Payable</dt>
                    <dd className="text-primary-800">₹ 650.00</dd>
                  </div>
                </dl>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <div className="grid sm:grid-cols-3 gap-3">
                  {["UPI / QR", "Net Banking", "Card"].map((m) => (
                    <label key={m} className="flex items-center gap-2 border rounded-lg px-4 py-3 cursor-pointer hover:border-primary-400 has-[:checked]:border-primary-600 has-[:checked]:bg-primary-50">
                      <input type="radio" name="payment" defaultChecked={m === "UPI / QR"} className="text-primary-600" />
                      <span className="text-sm font-medium">{m}</span>
                    </label>
                  ))}
                </div>
              </div>
              <label className="flex items-start gap-2 text-sm text-gray-600">
                <input type="checkbox" required className="mt-1 rounded text-primary-600" />
                <span>
                  I confirm that all information and documents submitted are true and correct to the best of my knowledge. I understand that providing false information may attract legal consequences.
                </span>
              </label>
            </div>
          )}

          <div className="flex justify-between pt-8 mt-6 border-t">
            <div>
              {step > 1 ? (
                <button type="button" onClick={back} className="px-5 py-2.5 border rounded-lg hover:bg-gray-50 font-medium">
                  ← Back
                </button>
              ) : (
                <Link href="/" className="px-5 py-2.5 border rounded-lg hover:bg-gray-50 inline-block">
                  Cancel
                </Link>
              )}
            </div>
            <div className="flex gap-3">
              <button type="button" className="px-5 py-2.5 border rounded-lg hover:bg-gray-50 text-sm">
                Save Draft
              </button>
              {step < 4 ? (
                <button type="button" onClick={next} className="px-6 py-2.5 bg-primary-700 hover:bg-primary-800 text-white rounded-lg font-medium">
                  Continue →
                </button>
              ) : (
                <button type="button" onClick={() => setSubmitted(true)} className="px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-lg font-medium">
                  Pay & Submit Filing
                </button>
              )}
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm">
            <h3 className="font-semibold text-primary-800 mb-2">Before you start</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Keep scanned copies of all documents ready (PDF preferred, max 10 MB each).</li>
              <li>You will need a valid mobile number / email for OTP verification and e-Sign.</li>
              <li>Court fees can be paid online in the final step.</li>
              <li>Drafts are saved automatically for 30 days.</li>
            </ul>
          </div>
        )}
      </main>
    </>
  );
}
