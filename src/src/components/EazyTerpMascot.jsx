// Full-size Eazy Terp - Jazz frog on cannabis lily pad
export const EazyTerpFull = ({ className = "" }) => {
  return (
    <svg 
      viewBox="0 0 400 450" 
      preserveAspectRatio="xMidYMid meet"
      className={`block w-full h-auto max-w-md mx-auto drop-shadow-2xl ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cannabis Lily Pad */}
      <g transform="translate(200, 400)">
        {/* Center leaf pointing down */}
        <path d="M0,-50 L-8,-10 L-3,0 L0,5 L3,0 L8,-10 Z" fill="#D4B748" stroke="#4A5F3A" strokeWidth="2"/>
        
        {/* Left leaves */}
        <path d="M-10,-40 L-45,-35 L-60,-25 L-45,-30 L-15,-35 Z" fill="#C4A747" stroke="#4A5F3A" strokeWidth="2"/>
        <path d="M-15,-25 L-50,-15 L-65,-5 L-50,-12 L-20,-20 Z" fill="#D4B748" stroke="#4A5F3A" strokeWidth="2"/>
        
        {/* Right leaves */}
        <path d="M10,-40 L45,-35 L60,-25 L45,-30 L15,-35 Z" fill="#C4A747" stroke="#4A5F3A" strokeWidth="2"/>
        <path d="M15,-25 L50,-15 L65,-5 L50,-12 L20,-20 Z" fill="#D4B748" stroke="#4A5F3A" strokeWidth="2"/>
        
        {/* Bottom left leaves */}
        <path d="M-8,-8 L-30,5 L-40,18 L-28,8 L-10,0 Z" fill="#C4A747" stroke="#4A5F3A" strokeWidth="2"/>
        
        {/* Bottom right leaves */}
        <path d="M8,-8 L30,5 L40,18 L28,8 L10,0 Z" fill="#C4A747" stroke="#4A5F3A" strokeWidth="2"/>
      </g>

      {/* Lower body - sitting crossed legs */}
      <path d="M180 360 Q160 370 155 385 L145 390 Q150 378 165 365 Z" 
            fill="#6B9B5F" stroke="#2D5016" strokeWidth="3"/>
      <path d="M220 360 Q240 370 245 385 L255 390 Q250 378 235 365 Z" 
            fill="#6B9B5F" stroke="#2D5016" strokeWidth="3"/>

      {/* Feet sticking out */}
      <ellipse cx="150" cy="388" rx="22" ry="14" fill="#6B9B5F" stroke="#2D5016" strokeWidth="2"/>
      <ellipse cx="250" cy="388" rx="22" ry="14" fill="#6B9B5F" stroke="#2D5016" strokeWidth="2"/>
      
      {/* Toe lines */}
      <line x1="142" y1="388" x2="137" y2="390" stroke="#2D5016" strokeWidth="2"/>
      <line x1="150" y1="390" x2="150" y2="394" stroke="#2D5016" strokeWidth="2"/>
      <line x1="158" y1="388" x2="163" y2="390" stroke="#2D5016" strokeWidth="2"/>
      <line x1="242" y1="388" x2="237" y2="390" stroke="#2D5016" strokeWidth="2"/>
      <line x1="250" y1="390" x2="250" y2="394" stroke="#2D5016" strokeWidth="2"/>
      <line x1="258" y1="388" x2="263" y2="390" stroke="#2D5016" strokeWidth="2"/>

      {/* Blue jeans */}
      <ellipse cx="200" cy="340" rx="45" ry="30" fill="#567A8C" stroke="#2D5016" strokeWidth="3"/>
      <path d="M195 325 Q195 340 195 350" stroke="#3D5A6A" strokeWidth="2" fill="none"/>
      <path d="M205 325 Q205 340 205 350" stroke="#3D5A6A" strokeWidth="2" fill="none"/>

      {/* Main body/torso */}
      <ellipse cx="200" cy="270" rx="50" ry="60" fill="#7BA36A" stroke="#2D5016" strokeWidth="3"/>

      {/* Yellow belly */}
      <ellipse cx="200" cy="285" rx="32" ry="40" fill="#E8D775" stroke="#2D5016" strokeWidth="2"/>

      {/* Orange jacket */}
      <path d="M158 250 Q155 270 160 300 L168 305 Q165 280 168 260 Z" 
            fill="#E07850" stroke="#2D5016" strokeWidth="3"/>
      <path d="M242 250 Q245 270 240 300 L232 305 Q235 280 232 260 Z" 
            fill="#E07850" stroke="#2D5016" strokeWidth="3"/>

      {/* White tank with peace sign */}
      <ellipse cx="200" cy="275" rx="30" ry="38" fill="#F5F5DC" stroke="#2D5016" strokeWidth="2"/>
      
      {/* Peace symbol */}
      <circle cx="200" cy="280" r="16" fill="none" stroke="#3D5A3A" strokeWidth="3"/>
      <line x1="200" y1="264" x2="200" y2="296" stroke="#3D5A3A" strokeWidth="3"/>
      <line x1="200" y1="280" x2="187" y2="292" stroke="#3D5A3A" strokeWidth="3"/>
      <line x1="200" y1="280" x2="213" y2="292" stroke="#3D5A3A" strokeWidth="3"/>

      {/* Right arm with joint */}
      <ellipse cx="248" cy="280" rx="16" ry="32" fill="#6B9B5F" stroke="#2D5016" strokeWidth="3"
               transform="rotate(30 248 280)"/>
      <ellipse cx="262" cy="258" rx="14" ry="22" fill="#7BA36A" stroke="#2D5016" strokeWidth="3"
               transform="rotate(35 262 258)"/>
      
      {/* Hand with joint */}
      <circle cx="272" cy="240" r="12" fill="#6B9B5F" stroke="#2D5016" strokeWidth="2"/>
      <path d="M268 232 Q266 228 267 224" stroke="#2D5016" strokeWidth="2" fill="none"/>
      <path d="M275 235 Q277 231 279 227" stroke="#2D5016" strokeWidth="2" fill="none"/>
      
      {/* Joint */}
      <rect x="276" y="233" width="14" height="3" fill="#F5F5DC" stroke="#2D5016" strokeWidth="1"
            transform="rotate(-25 283 234)"/>
      <circle cx="288" cy="230" r="2.5" fill="#FF6347"/>
      
      {/* Smoke wisp */}
      <path d="M290 228 Q292 224 291 220 Q290 216 292 212" 
            stroke="#D3D3D3" strokeWidth="1.5" fill="none" opacity="0.6"/>

      {/* Left arm resting on knee */}
      <ellipse cx="152" cy="295" rx="16" ry="32" fill="#6B9B5F" stroke="#2D5016" strokeWidth="3"
               transform="rotate(-30 152 295)"/>
      <ellipse cx="140" cy="325" rx="14" ry="20" fill="#7BA36A" stroke="#2D5016" strokeWidth="3"
               transform="rotate(-20 140 325)"/>
      
      {/* Left hand */}
      <ellipse cx="138" cy="348" rx="13" ry="16" fill="#6B9B5F" stroke="#2D5016" strokeWidth="2"
               transform="rotate(-10 138 348)"/>
      <path d="M133 343 Q131 339 130 335" stroke="#2D5016" strokeWidth="2" fill="none"/>
      <path d="M138 345 Q136 341 135 337" stroke="#2D5016" strokeWidth="2" fill="none"/>
      <path d="M143 345 Q142 341 141 337" stroke="#2D5016" strokeWidth="2" fill="none"/>

      {/* Head */}
      <ellipse cx="200" cy="195" rx="55" ry="50" fill="#7BA36A" stroke="#2D5016" strokeWidth="3"/>

      {/* Yellow chin/throat */}
      <ellipse cx="200" cy="215" rx="32" ry="28" fill="#E8D775" stroke="#2D5016" strokeWidth="2"/>

      {/* Dark sunglasses */}
      <ellipse cx="178" cy="188" rx="23" ry="16" fill="#1a1a1a" stroke="#2D5016" strokeWidth="3"/>
      <ellipse cx="222" cy="188" rx="23" ry="16" fill="#1a1a1a" stroke="#2D5016" strokeWidth="3"/>
      
      {/* Bridge of sunglasses */}
      <rect x="199" y="184" width="3" height="8" fill="#2D5016"/>
      
      {/* Glare on sunglasses */}
      <ellipse cx="173" cy="184" rx="7" ry="4" fill="#4a4a4a" opacity="0.5"/>
      <ellipse cx="217" cy="184" rx="7" ry="4" fill="#4a4a4a" opacity="0.5"/>

      {/* Nostrils */}
      <circle cx="192" cy="208" r="2.5" fill="#2D5016"/>
      <circle cx="208" cy="208" r="2.5" fill="#2D5016"/>

      {/* Mouth - relaxed smile */}
      <path d="M180 280 Q220 295 260 280" stroke="#2D5016" strokeWidth="3" fill="none" strokeLinecap="round"/>

      {/* Red beanie */}
      <g>
        {/* Main beanie shape */}
        <ellipse cx="200" cy="160" rx="58" ry="32" fill="#E07850" stroke="#2D5016" strokeWidth="3"/>
        
        {/* Top part */}
        <path d="M145 160 Q200 142 255 160" fill="#D06840" stroke="#2D5016" strokeWidth="2"/>
        
        {/* Folded rim - dark green */}
        <ellipse cx="200" cy="175" rx="56" ry="10" fill="#3D5A3A" stroke="#2D5016" strokeWidth="2"/>
        
        {/* Knit lines */}
        <line x1="152" y1="155" x2="154" y2="170" stroke="#C85838" strokeWidth="1.5"/>
        <line x1="170" y1="150" x2="171" y2="170" stroke="#C85838" strokeWidth="1.5"/>
        <line x1="188" y1="148" x2="188" y2="170" stroke="#C85838" strokeWidth="1.5"/>
        <line x1="206" y1="148" x2="206" y2="170" stroke="#C85838" strokeWidth="1.5"/>
        <line x1="224" y1="150" x2="223" y2="170" stroke="#C85838" strokeWidth="1.5"/>
        <line x1="242" y1="155" x2="238" y2="170" stroke="#C85838" strokeWidth="1.5"/>
        
        {/* Top of beanie */}
        <ellipse cx="200" cy="145" rx="42" ry="18" fill="#D06840" stroke="#2D5016" strokeWidth="2"/>
      </g>

      {/* Skin spots */}
      <circle cx="168" cy="200" r="3.5" fill="#6B9B5F" opacity="0.4"/>
      <circle cx="232" cy="200" r="3.5" fill="#6B9B5F" opacity="0.4"/>
      <circle cx="175" cy="212" r="2.5" fill="#6B9B5F" opacity="0.4"/>
      <circle cx="225" cy="212" r="2.5" fill="#6B9B5F" opacity="0.4"/>
    </svg>
  );
};

// Mini Eazy Terp for results page
export const EazyTerpMini = ({ className = "" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      preserveAspectRatio="xMidYMid meet"
      className={`w-16 h-auto flex-shrink-0 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head */}
      <ellipse cx="50" cy="48" rx="32" ry="28" fill="#7BA36A" stroke="#2D5016" strokeWidth="2"/>
      
      {/* Yellow throat */}
      <ellipse cx="50" cy="56" rx="18" ry="16" fill="#E8D775" stroke="#2D5016" strokeWidth="1.5"/>

      {/* Sunglasses */}
      <ellipse cx="40" cy="44" rx="11" ry="8" fill="#1a1a1a" stroke="#2D5016" strokeWidth="2"/>
      <ellipse cx="60" cy="44" rx="11" ry="8" fill="#1a1a1a" stroke="#2D5016" strokeWidth="2"/>
      <rect x="49" y="42" width="2" height="4" fill="#2D5016"/>
      
      {/* Glare */}
      <ellipse cx="37" cy="42" rx="3" ry="2" fill="#4a4a4a" opacity="0.5"/>
      <ellipse cx="57" cy="42" rx="3" ry="2" fill="#4a4a4a" opacity="0.5"/>

      {/* Nostrils */}
      <circle cx="46" cy="51" r="1.5" fill="#2D5016"/>
      <circle cx="54" cy="51" r="1.5" fill="#2D5016"/>

      {/* Mouth */}
      <path d="M35 55 Q50 60 65 55" stroke="#2D5016" strokeWidth="2" fill="none" strokeLinecap="round"/>

      {/* Red beanie */}
      <ellipse cx="50" cy="28" rx="33" ry="18" fill="#E07850" stroke="#2D5016" strokeWidth="2"/>
      <ellipse cx="50" cy="35" rx="32" ry="6" fill="#3D5A3A" stroke="#2D5016" strokeWidth="1.5"/>
      <ellipse cx="50" cy="22" rx="24" ry="10" fill="#D06840" stroke="#2D5016" strokeWidth="1.5"/>

      {/* Spots */}
      <circle cx="36" cy="48" r="2" fill="#6B9B5F" opacity="0.4"/>
      <circle cx="64" cy="48" r="2" fill="#6B9B5F" opacity="0.4"/>
    </svg>
  );
};