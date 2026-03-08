export const APP_CONFIG = {
  productName: "Гайд: Как собрать идеальную косметичку",
  adminEmail: process.env.ADMIN_EMAIL ?? "kristar@mailinator.com",
  pdfPath: "public/read_guide/guide.pdf",
  senderEmail: "onboarding@resend.dev",
  price: "$30",
  priceOriginal: "$45",
} as const;
