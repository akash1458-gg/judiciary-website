"use client";

import { useState } from "react";

export default function AdminOrdersPage() {
  const [uploaded, setUploaded] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders & Judgments</h1>
        <p className="text-gray-600 mt-1">
          Upload and publish orders / judgments to the public portal
        </p>
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm max-w-2xl">
        <h2 className="font-semibold mb-4">Upload New Order / Judgment</h2>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setUploaded(true);
          }}
        >
          <div>
            <label className="block text-sm font-medium mb-1">CNR / Case Number *</label>
            <input
              type="text"
              required
              placeholder="e.g. DLCT01-000123-2024"
              className="w-full border rounded-lg px-3 py-2.5"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Order Date *</label>
              <input type="date" required className="w-full border rounded-lg px-3 py-2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select required className="w-full border rounded-lg px-3 py-2.5 bg-white">
                <option value="">Select</option>
                <option>Interim Order</option>
                <option>Final Judgment</option>
                <option>Order</option>
                <option>Decree</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title / Description</label>
            <input
              type="text"
              placeholder="Short title of the order"
              className="w-full border rounded-lg px-3 py-2.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">PDF File *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 cursor-pointer">
              <p className="text-sm text-gray-600">Click or drag PDF here</p>
              <p className="text-xs text-gray-400 mt-1">Max 15 MB</p>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="rounded text-primary-600" />
            Mark as final judgment
          </label>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary-700 hover:bg-primary-800 text-white rounded-lg font-medium"
            >
              Upload & Publish
            </button>
            <button type="button" className="px-5 py-2.5 border rounded-lg hover:bg-gray-50">
              Save as Draft
            </button>
          </div>
        </form>

        {uploaded && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
            ✓ Order uploaded and published successfully. It is now visible on the public Judgments page.
          </div>
        )}
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold">Recently Uploaded</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-5 py-3 font-medium">Case</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Uploaded by</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr className="hover:bg-gray-50">
              <td className="px-5 py-3 font-mono text-primary-700">CS/123/2024</td>
              <td className="px-5 py-3">Interim Order</td>
              <td className="px-5 py-3">10 Jul 2026</td>
              <td className="px-5 py-3">Court Staff</td>
              <td className="px-5 py-3">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Published</span>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-5 py-3 font-mono text-primary-700">WP/112/2025</td>
              <td className="px-5 py-3">Final Judgment</td>
              <td className="px-5 py-3">15 Jun 2026</td>
              <td className="px-5 py-3">Court Staff</td>
              <td className="px-5 py-3">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Published</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
