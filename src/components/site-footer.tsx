type SiteFooterProps = {
  text: string;
};

export default function SiteFooter({ text }: SiteFooterProps) {
  return (
    <footer className="border-t-2 border-dashed border-line bg-cream/80 px-6 py-8 text-center">
      <p className="font-hand text-xl text-muted">{text}</p>
      <p className="mt-1 text-xs text-muted/70">
        Crafted with paper, ink &amp; a little bit of magic.
      </p>
    </footer>
  );
}
