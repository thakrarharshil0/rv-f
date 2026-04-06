const PageHeader = ({ title, subtitle }) => {
  return <header className="pr-6 py-16 border-b border-border">
      <h1 className="text-4xl md:text-5xl font-light text-foreground mb-4">
        {title}
      </h1>
      {subtitle && <p className="text-lg text-muted-foreground">
          {subtitle}
        </p>}
    </header>;
};
var stdin_default = PageHeader;
export {
  stdin_default as default
};
