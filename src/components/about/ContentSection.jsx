const ContentSection = ({ title, children, className = "" }) => {
  return <section className={`pr-6 py-16 ${className}`}>
      {title && <h2 className="text-3xl font-light text-foreground mb-8">
          {title}
        </h2>}
      {children}
    </section>;
};
var stdin_default = ContentSection;
export {
  stdin_default as default
};
