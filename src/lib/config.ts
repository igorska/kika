export const APP_CONFIG = {
  productName: "Гайд: Как собрать идеальную косметичку",
  adminEmail: process.env.ADMIN_EMAIL ?? "kristar@mailinator.com",
  pdfPath: "private/guide.pdf",
  senderEmail: "onboarding@resend.dev",
} as const;
