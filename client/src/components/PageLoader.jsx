function PageLoader() {
  return (
    <div className="loader-wrap">
      <div className="brand-row">
        <span className="mark" style={{ width: 46, height: 46, fontSize: 24 }}>P</span>
        <span className="word" style={{ fontSize: 28 }}>Path<em>Forge</em></span>
      </div>
      <div className="spin" style={{ width: 34, height: 34, borderWidth: 4, borderTopColor: 'var(--ember)' }} />
      <p className="dim" style={{ fontSize: 13, letterSpacing: '.18em', textTransform: 'uppercase', margin: 0 }}>
        Heating the forge...
      </p>
    </div>
  );
}

export default PageLoader;
