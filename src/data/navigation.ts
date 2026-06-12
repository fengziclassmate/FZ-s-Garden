export const navigation = [
  { href: "/", label: "Home" },
  {
    href: "/journal",
    label: "Journal",
    children: [
      { href: "/journal/moment", label: "Moment" },
      { href: "/journal/whisper", label: "Whisper" },
      { href: "/blogs?type=journal", label: "Blogs" },
    ],
  },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/me", label: "Me" },
  { href: "/behind", label: "Behind" },
];
