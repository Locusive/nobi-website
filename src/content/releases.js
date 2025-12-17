// Minimal, easy-to-maintain release notes.
// Add objects to the array; newest first is ideal but sorting is handled below.
const releases = [
  {
    slug: "2025-12-17-december-polish",
    title: "December polish and groundwork",
    date: "2025-12-17",
    highlights: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    ],
  },
  {
    slug: "2025-12-10-early-december",
    title: "Early December updates",
    date: "2025-12-10",
    highlights: [
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    ],
  },
];

export const releaseNotes = releases
  .slice()
  .sort((a, b) => new Date(b.date) - new Date(a.date));
