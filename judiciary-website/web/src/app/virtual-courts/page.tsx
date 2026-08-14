import Header from "@/components/Header";

const virtualCourts = [
  {
    court: "District Court, New Delhi – Court No. 12",
    judge: "Hon’ble Shri A.K. Verma",
    time: "10:30 AM – 01:30 PM",
    link: "#",
    status: "Live",
  },
  {
    court: "District Court, New Delhi – Court No. 8",
    judge: "Hon’ble Smt. P. Sharma",
    time: "10:30 AM – 01:30 PM",
    link: "#",
    status: "Scheduled",
  },
  {
    court: "High Court of Delhi – Court No. 5",
    judge: "Hon’ble Mr. Justice X",
    time: "10:30 AM – 01:00 PM",
    link: "#",
    status: "Scheduled",
  },
  {
    court: "Family Court, Saket",
    judge: "Hon’ble Smt. R. Kapoor",
    time: "11:00 AM – 02:00 PM",
    link: "#",
    status: "Live",
  },
  {
    court: "Commercial Court, New Delhi",
    judge: "Hon’ble Shri V. Mehta",
    time: "02:00 PM – 05:00 PM",
    link: "#",
    status: "Upcoming",
  },
];

export default function VirtualCourtsPage() {
  return (
    <>
      <Header active="virtual-courts" />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1">
        <h1 className="text-2xl font-bold text-primary-900 mb-2">
          Virtual Courts
        </h1>
        <p className="text-gray-600 mb-8">
          Join video hearings from anywhere. Select your court and join at the
          scheduled time.
        </p>

        {/* Filters */}
        <div className="bg-white border rounded-xl p-6 shadow-sm mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Court Level</label>
              <select className="w-full border rounded-lg px-3 py-2.5 bg-white">
                <option>All</option>
                <option>District Courts</option>
                <option>High Courts</option>
                <option>Supreme Court</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State / Complex</label>
              <select className="w-full border rounded-lg px-3 py-2.5 bg-white">
                <option>Delhi</option>
                <option>Maharashtra</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                defaultValue="2026-08-14"
                className="w-full border rounded-lg px-3 py-2.5"
              />
            </div>
            <div className="flex items-end">
              <button className="w-full bg-primary-700 hover:bg-primary-800 text-white py-2.5 rounded-lg font-medium">
                Show Courts
              </button>
            </div>
          </div>
        </div>

        {/* Court cards */}
        <div className="space-y-4">
          {virtualCourts.map((c) => (
            <div
              key={c.court}
              className="bg-white border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-primary-900">{c.court}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      c.status === "Live"
                        ? "bg-red-100 text-red-800"
                        : c.status === "Scheduled"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {c.status === "Live" && "● "}
                    {c.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{c.judge}</p>
                <p className="text-sm text-gray-500 mt-1">Timing: {c.time}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <a
                  href={c.link}
                  className={`px-5 py-2.5 rounded-lg font-medium text-sm transition ${
                    c.status === "Live"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-primary-700 hover:bg-primary-800 text-white"
                  }`}
                >
                  {c.status === "Live" ? "Join Now" : "Join Hearing"}
                </a>
                <button className="px-4 py-2.5 border rounded-lg text-sm hover:bg-gray-50">
                  Instructions
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Help */}
        <div className="mt-10 bg-blue-50 border border-blue-100 rounded-xl p-6">
          <h2 className="font-semibold text-primary-900 mb-3">
            How to join a virtual hearing
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Ensure you have a stable internet connection and a device with camera & microphone.</li>
            <li>Click “Join Hearing” at least 10 minutes before the scheduled time.</li>
            <li>Enter the meeting using the link or meeting ID provided by the court.</li>
            <li>Keep your video on and mute when not speaking. Dress appropriately.</li>
            <li>Have your case number and identity proof ready if asked by the court.</li>
          </ol>
          <p className="mt-4 text-sm text-gray-600">
            For technical support during hearings, contact the court helpline or
            e-Sewa Kendra.
          </p>
        </div>
      </main>
    </>
  );
}
