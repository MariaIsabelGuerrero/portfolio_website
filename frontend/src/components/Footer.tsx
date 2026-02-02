import { personalInfo } from "@/config/portfolio";

export default function Footer() {
  return (
    <footer className="py-8 border-t border-primary/30 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            Designed & Built by{" "}
            <span className="text-accent hover:underline cursor-pointer">{personalInfo.name}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
