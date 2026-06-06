function Logo({ className = "", size = "md", variant = "full" }) {
  const sizes = {
    xs: { wrapper: "h-8", text: "text-lg", tag: "text-[0.4rem]", sub: "hidden" },
    sm: { wrapper: "h-12", text: "text-xl", tag: "text-[0.5rem]", sub: "hidden" },
    md: { wrapper: "h-16", text: "text-2xl", tag: "text-[0.55rem]", sub: "text-[0.45rem]" },
    lg: { wrapper: "h-24", text: "text-4xl", tag: "text-[0.65rem]", sub: "text-[0.5rem]" },
    xl: { wrapper: "h-32", text: "text-5xl", tag: "text-xs", sub: "text-[0.6rem]" },
    hero: { wrapper: "h-44", text: "text-7xl", tag: "text-sm", sub: "text-xs" },
  };

  const s = sizes[size] || sizes.md;

  if (variant === "wordmark") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className={`font-display ${s.text} font-bold tracking-wide text-brand-gold`}>
          Rizoura
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Emblem circle */}
      <div className={`${s.wrapper} aspect-square relative`}>
        <svg viewBox="0 0 120 120" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`gold-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#C9A55C" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
            <radialGradient id={`scene-${size}`} cx="50%" cy="60%" r="40%">
              <stop offset="0%" stopColor="#2d5a3f" />
              <stop offset="100%" stopColor="#173D34" />
            </radialGradient>
          </defs>
          {/* Outer ring */}
          <circle cx="60" cy="60" r="57" fill="none" stroke={`url(#gold-${size})`} strokeWidth="2" />
          <circle cx="60" cy="60" r="52" fill="none" stroke={`url(#gold-${size})`} strokeWidth="0.5" opacity="0.4" />
          {/* Inner scene bg */}
          <circle cx="60" cy="60" r="48" fill={`url(#scene-${size})`} />
          {/* Wheat leaves left */}
          <g fill="#C9A55C" opacity="0.85">
            <ellipse cx="28" cy="38" rx="6" ry="2.5" transform="rotate(-45 28 38)" />
            <ellipse cx="23" cy="48" rx="6" ry="2.5" transform="rotate(-30 23 48)" />
            <ellipse cx="20" cy="58" rx="6" ry="2.5" transform="rotate(-10 20 58)" />
            <ellipse cx="22" cy="68" rx="6" ry="2.5" transform="rotate(10 22 68)" />
            <ellipse cx="27" cy="76" rx="6" ry="2.5" transform="rotate(25 27 76)" />
          </g>
          {/* Wheat leaves right */}
          <g fill="#C9A55C" opacity="0.85">
            <ellipse cx="92" cy="38" rx="6" ry="2.5" transform="rotate(45 92 38)" />
            <ellipse cx="97" cy="48" rx="6" ry="2.5" transform="rotate(30 97 48)" />
            <ellipse cx="100" cy="58" rx="6" ry="2.5" transform="rotate(10 100 58)" />
            <ellipse cx="98" cy="68" rx="6" ry="2.5" transform="rotate(-10 98 68)" />
            <ellipse cx="93" cy="76" rx="6" ry="2.5" transform="rotate(-25 93 76)" />
          </g>
          {/* Sun */}
          <circle cx="60" cy="52" r="8" fill="#D4AF37" opacity="0.6" />
          <circle cx="60" cy="52" r="5" fill="#D4AF37" opacity="0.9" />
          {/* Sun rays */}
          {[0, 30, 60, 90, 120, 150].map((angle) => (
            <line
              key={angle}
              x1="60"
              y1="52"
              x2={60 + 14 * Math.cos((angle * Math.PI) / 180)}
              y2={52 - 14 * Math.sin((angle * Math.PI) / 180)}
              stroke="#D4AF37"
              strokeWidth="0.5"
              opacity="0.4"
            />
          ))}
          {/* Paddy field lines */}
          <g stroke="#4a8a5c" strokeWidth="0.5" opacity="0.5">
            <path d="M35 72 Q60 60 85 72" fill="none" />
            <path d="M32 78 Q60 66 88 78" fill="none" />
            <path d="M30 84 Q60 72 90 84" fill="none" />
          </g>
          {/* Ornament top */}
          <path d="M57 8 L60 4 L63 8" stroke="#C9A55C" strokeWidth="1" fill="none" opacity="0.6" />
        </svg>
      </div>
      {/* Brand text */}
      <p className={`mt-1 font-display ${s.text} font-bold tracking-wider text-brand-gold`}>
        Rizoura
        <span className={`${s.tag} align-super font-sans font-normal`}>&reg;</span>
      </p>
      <p className={`${s.tag} mt-0.5 font-semibold uppercase tracking-[0.3em] text-brand-gold/80`}>
        Pure Grain. Honest Taste.
      </p>
      <p className={`${s.sub} mt-0.5 font-medium uppercase tracking-[0.25em] text-brand-gold/50`}>
        Premium Basmati Rice
      </p>
    </div>
  );
}

export default Logo;
