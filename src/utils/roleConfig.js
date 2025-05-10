export const roleConfig = {
  volunteer: {
    color: "bg-purple-100 text-purple-800",
    icon: "👨‍⚕️",
    badge: "Volunteer",
    stats: (userData) => [
      { label: "Active Requests", value: userData?.activeRequests || "0" },
      { label: "Completed", value: userData?.completedRequests || "0" },
      { label: "Rating", value: userData?.rating || "4.8" }
    ]
  },
  admin: {
    color: "bg-blue-100 text-blue-800",
    icon: "👔",
    badge: "Admin",
    stats: (userData) => [
      { label: "Users", value: userData?.userCount || "142" },
      { label: "Requests", value: userData?.requestCount || "86" },
      { label: "Centers", value: userData?.centerCount || "7" }
    ]
  },
  donor: {
    color: "bg-green-100 text-green-800",
    icon: "💉",
    badge: "Donor",
    stats: (userData) => [
      { label: "Donations", value: userData?.donationCount || "5" },
      { label: "Saved Lives", value: "15+" },
      { label: "Last Donation", value: userData?.lastDonation || "2w ago" }
    ]
  },
  default: {
    color: "bg-gray-100 text-gray-800",
    icon: "👤",
    badge: "Member",
    stats: (userData) => [
      { label: "Activity", value: "New" },
      { label: "Engagement", value: "100%" },
      { label: "Member Since", value: userData?.joinDate?.split('-')[0] || "2023" }
    ]
  }
};