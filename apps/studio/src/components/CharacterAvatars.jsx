import React from "react";

/**
 * CharacterAvatars renders the high-fidelity plush companions grounded directly
 * in the reference artwork:
 * - Pomo: dome blob, sprout coral pom-pom, ivory belly, floating idea bubbles
 * - Fynn: plush fox, upright pointed ears, chest ruff, bushy tail, artist palette & brush
 * - Olli: mint owl, feathered ear-tufts, scalloped chest, coral wings, 3D bar chart
 * - Nixi: axolotl, 6 branching coral gills, joyful smile, retro app/browser console
 * - Ember: baby dragon, ivory horns, coral spine/wings, belly plates, musical notes
 * - Kipi: hooded maker, glowing antenna orb, floppy ears, chest power core, equalizer spectrum
 */

export function PomoAvatar({ motion = "Idle", size = 180, isAnimating = true }) {
  const isThinking = motion === "Think";
  const isWorking = motion === "Work";
  const isSleeping = motion === "Sleep";
  const isWalking = motion === "Walk";

  return (
    <div
      className={`companion-figure figure-pomo motion-${motion.toLowerCase()}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Pomo, the Mind & Ideation Master"
    >
      <svg viewBox="0 0 200 200" className="character-svg">
        <defs>
          <radialGradient id="pomo-grad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#48e3d8" />
            <stop offset="60%" stopColor="#32c5ba" />
            <stop offset="100%" stopColor="#1e9c93" />
          </radialGradient>
          <radialGradient id="pomo-belly" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="90%" stopColor="#f3efe0" />
            <stop offset="100%" stopColor="#e3dcbf" />
          </radialGradient>
          <radialGradient id="pomo-coral" cx="35%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#ffa796" />
            <stop offset="80%" stopColor="#ff745f" />
            <stop offset="100%" stopColor="#d94b37" />
          </radialGradient>
          <filter id="pomo-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Floating Idea Bubbles for Thinking */}
        {(isThinking || isWorking) && (
          <g className="floating-accessory idea-bubbles-group" filter="url(#pomo-glow)">
            <circle cx="75" cy="42" r="7" fill="#61e5d8" opacity="0.85" className="float-bubble-1" />
            <circle cx="65" cy="24" r="11" fill="#46d9cb" opacity="0.9" className="float-bubble-2" />
            <circle cx="50" cy="8" r="5" fill="#ffa796" opacity="0.8" className="float-bubble-3" />
            <circle cx="68" cy="22" r="3" fill="#ffffff" opacity="0.8" />
          </g>
        )}

        {/* Antenna stalk and coral pom-pom */}
        <g className="pomo-antenna">
          <path d="M 100 70 Q 95 38 90 28" stroke="#32c5ba" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="89" cy="24" r="13" fill="url(#pomo-coral)" filter="url(#pomo-glow)" />
          <circle cx="86" cy="21" r="4" fill="#ffffff" opacity="0.75" />
        </g>

        {/* Main plush dome body */}
        <g className="pomo-body">
          <path
            d="M 40 160 C 25 140, 25 85, 75 62 C 100 50, 130 50, 155 70 C 185 95, 185 145, 160 165 C 135 180, 65 180, 40 160 Z"
            fill="url(#pomo-grad)"
          />

          {/* Ivory belly patch */}
          <ellipse cx="102" cy="142" rx="46" ry="32" fill="url(#pomo-belly)" />

          {/* Tiny feet */}
          <ellipse cx="65" cy="172" rx="15" ry="9" fill="#24a69c" />
          <ellipse cx="140" cy="172" rx="15" ry="9" fill="#24a69c" />
          <ellipse cx="32" cy="148" rx="10" ry="7" fill="#28aba1" />
          <ellipse cx="170" cy="148" rx="10" ry="7" fill="#28aba1" />

          {/* Coral blush cheeks */}
          <circle cx="58" cy="132" r="11" fill="url(#pomo-coral)" opacity="0.85" />
          <circle cx="148" cy="132" r="11" fill="url(#pomo-coral)" opacity="0.85" />

          {/* Eyes & Smile */}
          {isSleeping ? (
            <g className="pomo-sleeping-face">
              <path d="M 68 118 Q 78 126 88 118" stroke="#0e3a39" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 118 118 Q 128 126 138 118" stroke="#0e3a39" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 100 134 Q 103 138 106 134" stroke="#0e3a39" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            <g className="pomo-awake-face">
              {/* Left Eye */}
              <ellipse cx="76" cy="116" rx="9.5" ry="12" fill="#0d2e2d" />
              <circle cx="73" cy="111" r="4.5" fill="#ffffff" />
              <circle cx="79" cy="120" r="2" fill="#ffffff" />
              <circle cx="78" cy="113" r="1.5" fill="#48e3d8" />

              {/* Right Eye */}
              <ellipse cx="130" cy="116" rx="9.5" ry="12" fill="#0d2e2d" />
              <circle cx="127" cy="111" r="4.5" fill="#ffffff" />
              <circle cx="133" cy="120" r="2" fill="#ffffff" />
              <circle cx="132" cy="113" r="1.5" fill="#48e3d8" />

              {/* Cheerful Mouth */}
              <path d="M 98 128 Q 103 138 108 128" stroke="#0e3a39" strokeWidth="3" strokeLinecap="round" fill="#e85b4f" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}

export function FynnAvatar({ motion = "Idle", size = 180 }) {
  const isThinking = motion === "Think";
  const isWorking = motion === "Work";
  const isSleeping = motion === "Sleep";

  return (
    <div
      className={`companion-figure figure-fynn motion-${motion.toLowerCase()}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Fynn, the Visual Artist & Canvas Magician"
    >
      <svg viewBox="0 0 200 200" className="character-svg">
        <defs>
          <radialGradient id="fynn-fur" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#43dfd5" />
            <stop offset="65%" stopColor="#2abcb5" />
            <stop offset="100%" stopColor="#148782" />
          </radialGradient>
          <radialGradient id="fynn-coral" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ff9f8e" />
            <stop offset="70%" stopColor="#ff705c" />
            <stop offset="100%" stopColor="#d13d29" />
          </radialGradient>
          <radialGradient id="fynn-white" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="85%" stopColor="#f5f0e3" />
            <stop offset="100%" stopColor="#dfd6c0" />
          </radialGradient>
        </defs>

        {/* Floating Painter's Palette & Brush for Fynn */}
        {(isWorking || isThinking) && (
          <g className="floating-accessory fynn-palette-group" transform="translate(130, 8) scale(0.85)">
            <path
              d="M 25 15 C 38 2, 60 12, 62 28 C 64 45, 45 60, 28 58 C 12 55, 4 35, 12 22 C 16 18, 22 22, 25 15 Z"
              fill="#edd9b4"
              stroke="#b5996f"
              strokeWidth="2"
            />
            {/* Paint spots on palette */}
            <circle cx="28" cy="22" r="4" fill="#ff6150" />
            <circle cx="44" cy="24" r="4.5" fill="#44dfd5" />
            <circle cx="50" cy="38" r="4" fill="#ffd159" />
            <circle cx="34" cy="46" r="3.5" fill="#756bf0" />
            {/* Paintbrush */}
            <path d="M 52 50 L 72 20" stroke="#795548" strokeWidth="4" strokeLinecap="round" />
            <path d="M 72 20 L 78 12" stroke="#ff705c" strokeWidth="5" strokeLinecap="round" />
          </g>
        )}

        {/* Large pointed fox ears with coral inner fluff */}
        <g className="fynn-ears">
          {/* Left Ear */}
          <path d="M 45 78 L 26 22 C 40 18, 65 35, 72 58 Z" fill="url(#fynn-fur)" />
          <path d="M 43 70 L 32 30 C 42 27, 58 40, 62 56 Z" fill="url(#fynn-coral)" />
          {/* Right Ear */}
          <path d="M 155 78 L 174 22 C 160 18, 135 35, 128 58 Z" fill="url(#fynn-fur)" />
          <path d="M 157 70 L 168 30 C 158 27, 142 40, 138 56 Z" fill="url(#fynn-coral)" />
        </g>

        {/* Fluffy tail on the side with white/coral tip */}
        <g className="fynn-tail">
          <path d="M 35 150 C 5 140, 2 175, 25 185 C 45 192, 60 178, 55 160 Z" fill="url(#fynn-fur)" />
          <path d="M 12 165 C 5 155, 8 180, 25 185 C 32 188, 38 180, 32 172 Z" fill="url(#fynn-white)" />
          <path d="M 8 160 Q 15 168 22 162" stroke="#ff705c" strokeWidth="4" fill="none" />
        </g>

        {/* Body & Legs */}
        <g className="fynn-body">
          <ellipse cx="100" cy="148" rx="44" ry="38" fill="url(#fynn-fur)" />
          {/* White chest ruff */}
          <path
            d="M 78 125 C 70 145, 82 170, 100 172 C 118 170, 130 145, 122 125 C 115 136, 85 136, 78 125 Z"
            fill="url(#fynn-white)"
          />
          {/* Dark paws with pads */}
          <ellipse cx="78" cy="178" rx="14" ry="10" fill="#1b4b52" />
          <circle cx="78" cy="176" r="3.5" fill="#44dfd5" />
          <ellipse cx="122" cy="178" rx="14" ry="10" fill="#1b4b52" />
          <circle cx="122" cy="176" r="3.5" fill="#44dfd5" />
        </g>

        {/* Fox Head & Face */}
        <g className="fynn-head">
          <ellipse cx="100" cy="95" rx="52" ry="44" fill="url(#fynn-fur)" />
          {/* Forehead tuft */}
          <path d="M 92 52 Q 100 40 108 52 Q 100 48 92 52 Z" fill="url(#fynn-fur)" />

          {/* White muzzle & cheeks */}
          <path
            d="M 60 105 C 52 120, 75 134, 100 134 C 125 134, 148 120, 140 105 C 130 92, 115 106, 100 106 C 85 106, 70 92, 60 105 Z"
            fill="url(#fynn-white)"
          />

          {/* Coral blush */}
          <circle cx="62" cy="115" r="9" fill="url(#fynn-coral)" opacity="0.8" />
          <circle cx="138" cy="115" r="9" fill="url(#fynn-coral)" opacity="0.8" />

          {/* Tiny dark nose */}
          <path d="M 97 106 L 103 106 L 100 110 Z" fill="#112d30" />

          {/* Eyes */}
          {isSleeping ? (
            <g className="fynn-sleeping-eyes">
              <path d="M 72 94 Q 82 102 92 94" stroke="#0f3438" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 108 94 Q 118 102 128 94" stroke="#0f3438" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            <g className="fynn-smiling-eyes">
              {/* Joyful squint / big happy eyes */}
              <ellipse cx="80" cy="94" rx="8" ry="11" fill="#0d2b2e" />
              <circle cx="78" cy="90" r="4" fill="#ffffff" />
              <circle cx="83" cy="98" r="1.5" fill="#ffffff" />
              <ellipse cx="120" cy="94" rx="8" ry="11" fill="#0d2b2e" />
              <circle cx="118" cy="90" r="4" fill="#ffffff" />
              <circle cx="123" cy="98" r="1.5" fill="#ffffff" />
            </g>
          )}

          {/* Happy Open Mouth */}
          <path d="M 95 114 Q 100 125 105 114" stroke="#0e2a2e" strokeWidth="2.5" fill="#f0584b" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

export function OlliAvatar({ motion = "Idle", size = 180 }) {
  const isThinking = motion === "Think";
  const isWorking = motion === "Work";
  const isSleeping = motion === "Sleep";

  return (
    <div
      className={`companion-figure figure-olli motion-${motion.toLowerCase()}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Olli, the Data Sage & Quantum Analyst"
    >
      <svg viewBox="0 0 200 200" className="character-svg">
        <defs>
          <radialGradient id="olli-feather" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#78eee3" />
            <stop offset="65%" stopColor="#57d8cc" />
            <stop offset="100%" stopColor="#2aa096" />
          </radialGradient>
          <radialGradient id="olli-peach" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffa596" />
            <stop offset="75%" stopColor="#ff8573" />
            <stop offset="100%" stopColor="#db4a35" />
          </radialGradient>
          <radialGradient id="olli-chest" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="85%" stopColor="#f7f5e9" />
            <stop offset="100%" stopColor="#e5e0cb" />
          </radialGradient>
        </defs>

        {/* Floating 3D Analytics Bar Chart for Olli */}
        {(isWorking || isThinking) && (
          <g className="floating-accessory olli-chart-group" transform="translate(130, 10)">
            <rect x="0" y="24" width="7" height="18" rx="2" fill="#57d8cc" />
            <rect x="11" y="14" width="7" height="28" rx="2" fill="#41c6ba" />
            <rect x="22" y="4" width="7" height="38" rx="2" fill="#ff8573" />
            <circle cx="3" cy="20" r="2" fill="#ffffff" />
            <circle cx="14" cy="10" r="2" fill="#ffffff" />
            <circle cx="25" cy="1" r="2.5" fill="#ffd55a" />
          </g>
        )}

        {/* Feathered Ear-Tufts on head */}
        <g className="olli-ear-tufts">
          <path d="M 58 55 Q 40 38 48 24 Q 65 38 68 50 Z" fill="url(#olli-feather)" />
          <path d="M 142 55 Q 160 38 152 24 Q 135 38 132 50 Z" fill="url(#olli-feather)" />
        </g>

        {/* Peach-coral feathered wings spread out */}
        <g className="olli-wings">
          {/* Left Wing */}
          <path d="M 52 110 C 22 118, 12 145, 34 158 C 45 152, 54 138, 56 122 Z" fill="url(#olli-peach)" />
          {/* Right Wing */}
          <path d="M 148 110 C 178 118, 188 145, 166 158 C 155 152, 146 138, 144 122 Z" fill="url(#olli-peach)" />
        </g>

        {/* Owl Round Body */}
        <g className="olli-body">
          <ellipse cx="100" cy="120" rx="55" ry="50" fill="url(#olli-feather)" />

          {/* Scalloped Ivory Chest Plumage */}
          <ellipse cx="100" cy="138" rx="38" ry="32" fill="url(#olli-chest)" />
          <path d="M 85 132 Q 92 140 100 132 Q 108 140 115 132" stroke="#d5ceb8" strokeWidth="2.5" fill="none" />
          <path d="M 88 144 Q 95 152 100 144 Q 106 152 112 144" stroke="#d5ceb8" strokeWidth="2.5" fill="none" />

          {/* Talons */}
          <ellipse cx="80" cy="176" rx="10" ry="6" fill="url(#olli-peach)" />
          <ellipse cx="120" cy="176" rx="10" ry="6" fill="url(#olli-peach)" />
        </g>

        {/* Owl Face & Oversized Eyes */}
        <g className="olli-face">
          {/* Eye rim frame */}
          <circle cx="76" cy="94" r="26" fill="#f7f5e9" />
          <circle cx="124" cy="94" r="26" fill="#f7f5e9" />

          {isSleeping ? (
            <g className="olli-sleeping">
              <path d="M 64 96 Q 76 106 88 96" stroke="#123d38" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 112 96 Q 124 106 136 96" stroke="#123d38" strokeWidth="4" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            <g className="olli-big-eyes">
              {/* Left Eye */}
              <circle cx="76" cy="94" r="18" fill="#0d2b29" />
              <circle cx="76" cy="94" r="15" fill="#134743" />
              <circle cx="73" cy="88" r="6.5" fill="#ffffff" />
              <circle cx="81" cy="99" r="2.5" fill="#ffffff" />
              <circle cx="72" cy="96" r="2" fill="#57d8cc" />

              {/* Right Eye */}
              <circle cx="124" cy="94" r="18" fill="#0d2b29" />
              <circle cx="124" cy="94" r="15" fill="#134743" />
              <circle cx="121" cy="88" r="6.5" fill="#ffffff" />
              <circle cx="129" cy="99" r="2.5" fill="#ffffff" />
              <circle cx="120" cy="96" r="2" fill="#57d8cc" />
            </g>
          )}

          {/* Peach curved beak */}
          <path d="M 96 100 L 104 100 L 100 114 Z" fill="url(#olli-peach)" />
        </g>
      </svg>
    </div>
  );
}

export function NixiAvatar({ motion = "Idle", size = 180 }) {
  const isThinking = motion === "Think";
  const isWorking = motion === "Work";
  const isSleeping = motion === "Sleep";

  return (
    <div
      className={`companion-figure figure-nixi motion-${motion.toLowerCase()}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Nixi, the Web Navigator & API Explorer"
    >
      <svg viewBox="0 0 200 200" className="character-svg">
        <defs>
          <radialGradient id="nixi-body" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#5de2db" />
            <stop offset="65%" stopColor="#39c8c1" />
            <stop offset="100%" stopColor="#1a918a" />
          </radialGradient>
          <radialGradient id="nixi-gill" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ff9a8a" />
            <stop offset="70%" stopColor="#ff7461" />
            <stop offset="100%" stopColor="#d64431" />
          </radialGradient>
          <radialGradient id="nixi-belly" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="85%" stopColor="#fcf8ea" />
            <stop offset="100%" stopColor="#e4ddc8" />
          </radialGradient>
        </defs>

        {/* Floating Browser & Console for Nixi */}
        {(isWorking || isThinking) && (
          <g className="floating-accessory nixi-console-group" transform="translate(130, 10)">
            <rect x="0" y="8" width="44" height="30" rx="6" fill="#e7f8f6" stroke="#39c8c1" strokeWidth="2.5" />
            {/* Browser top-bar dots */}
            <circle cx="8" cy="15" r="2.5" fill="#ff7461" />
            <circle cx="15" cy="15" r="2.5" fill="#fbd35c" />
            <circle cx="22" cy="15" r="2.5" fill="#58d97e" />
            {/* URL / console area */}
            <rect x="6" y="22" width="32" height="10" rx="3" fill="#20535a" />
            <circle cx="12" cy="27" r="2" fill="#5de2db" />
          </g>
        )}

        {/* 6 Feathery Coral External Gill Frills */}
        <g className="nixi-gills">
          {/* Left Gills */}
          <path d="M 52 75 C 28 68, 20 84, 40 90 Z" fill="url(#nixi-gill)" />
          <path d="M 46 92 C 16 92, 14 110, 38 112 Z" fill="url(#nixi-gill)" />
          <path d="M 50 115 C 22 125, 25 142, 46 130 Z" fill="url(#nixi-gill)" />

          {/* Right Gills */}
          <path d="M 148 75 C 172 68, 180 84, 160 90 Z" fill="url(#nixi-gill)" />
          <path d="M 154 92 C 184 92, 186 110, 162 112 Z" fill="url(#nixi-gill)" />
          <path d="M 150 115 C 178 125, 175 142, 154 130 Z" fill="url(#nixi-gill)" />
        </g>

        {/* Axolotl Body & Tail */}
        <g className="nixi-body">
          {/* Swimming tail with coral fin */}
          <path d="M 130 145 C 170 140, 175 175, 140 178 Z" fill="url(#nixi-body)" />
          <path d="M 145 142 C 175 146, 175 168, 150 172 Z" fill="url(#nixi-gill)" opacity="0.8" />

          {/* Main rounded body */}
          <ellipse cx="100" cy="136" rx="46" ry="40" fill="url(#nixi-body)" />
          <ellipse cx="100" cy="145" rx="32" ry="26" fill="url(#nixi-belly)" />

          {/* Cute little front paws */}
          <ellipse cx="70" cy="172" rx="12" ry="8" fill="#249d97" />
          <ellipse cx="130" cy="172" rx="12" ry="8" fill="#249d97" />
        </g>

        {/* Axolotl Face */}
        <g className="nixi-head">
          <ellipse cx="100" cy="98" rx="52" ry="42" fill="url(#nixi-body)" />

          {/* Coral blush */}
          <circle cx="56" cy="116" r="10" fill="url(#nixi-gill)" opacity="0.85" />
          <circle cx="144" cy="116" r="10" fill="url(#nixi-gill)" opacity="0.85" />

          {/* Big smiling mouth */}
          {isSleeping ? (
            <g className="nixi-sleeping">
              <path d="M 70 96 Q 80 105 90 96" stroke="#0e3230" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 110 96 Q 120 105 130 96" stroke="#0e3230" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            <g className="nixi-awake">
              <ellipse cx="78" cy="96" rx="9" ry="12" fill="#0d2826" />
              <circle cx="75" cy="91" r="4.5" fill="#ffffff" />
              <circle cx="81" cy="100" r="2" fill="#ffffff" />

              <ellipse cx="122" cy="96" rx="9" ry="12" fill="#0d2826" />
              <circle cx="119" cy="91" r="4.5" fill="#ffffff" />
              <circle cx="125" cy="100" r="2" fill="#ffffff" />

              {/* Joyful open mouth with tongue */}
              <path d="M 88 114 Q 100 132 112 114 Z" fill="#cf3f33" stroke="#0e3230" strokeWidth="2" />
              <ellipse cx="100" cy="122" rx="7" ry="4" fill="#ff7461" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}

export function EmberAvatar({ motion = "Idle", size = 180 }) {
  const isThinking = motion === "Think";
  const isWorking = motion === "Work";
  const isSleeping = motion === "Sleep";

  return (
    <div
      className={`companion-figure figure-ember motion-${motion.toLowerCase()}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Ember, the Master Builder & Musical Architect"
    >
      <svg viewBox="0 0 200 200" className="character-svg">
        <defs>
          <radialGradient id="ember-body" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#3de0d6" />
            <stop offset="65%" stopColor="#21b9b2" />
            <stop offset="100%" stopColor="#11837e" />
          </radialGradient>
          <radialGradient id="ember-coral" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ff9584" />
            <stop offset="70%" stopColor="#ff6f5b" />
            <stop offset="100%" stopColor="#c73c28" />
          </radialGradient>
          <radialGradient id="ember-horn" cx="45%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="75%" stopColor="#f8f3df" />
            <stop offset="100%" stopColor="#d8cfaf" />
          </radialGradient>
          <radialGradient id="ember-belly" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffded6" />
            <stop offset="70%" stopColor="#fed3c7" />
            <stop offset="100%" stopColor="#e5a999" />
          </radialGradient>
        </defs>

        {/* Floating Musical Notes for Ember */}
        {(isWorking || isThinking) && (
          <g className="floating-accessory ember-music-group" transform="translate(130, 8)">
            {/* Eighth note */}
            <path d="M 8 26 L 8 10 Q 18 8 20 15" stroke="#21b9b2" strokeWidth="3" fill="none" />
            <circle cx="7" cy="26" r="4.5" fill="#21b9b2" />
            {/* Beamed sixteenth notes */}
            <g transform="translate(20, 2)">
              <rect x="6" y="8" width="16" height="3" rx="1" fill="#ff6f5b" />
              <line x1="6" y1="8" x2="6" y2="24" stroke="#ff6f5b" strokeWidth="2.5" />
              <line x1="22" y1="8" x2="22" y2="24" stroke="#ff6f5b" strokeWidth="2.5" />
              <circle cx="5" cy="24" r="3.5" fill="#ff6f5b" />
              <circle cx="21" cy="24" r="3.5" fill="#ff6f5b" />
            </g>
          </g>
        )}

        {/* Ivory curved dragon horns and coral crest */}
        <g className="ember-horns">
          {/* Left horn */}
          <path d="M 68 62 C 55 42, 42 32, 38 20 C 54 24, 70 42, 76 56 Z" fill="url(#ember-horn)" />
          {/* Right horn */}
          <path d="M 132 62 C 145 42, 158 32, 162 20 C 146 24, 130 42, 124 56 Z" fill="url(#ember-horn)" />
          {/* Coral center head crest */}
          <path d="M 94 48 C 96 32, 104 32, 106 48 Z" fill="url(#ember-coral)" />
        </g>

        {/* Coral dragon wings */}
        <g className="ember-wings">
          {/* Left wing */}
          <path d="M 52 115 C 20 102, 15 135, 38 152 C 45 138, 50 126, 52 115 Z" fill="url(#ember-coral)" />
          <path d="M 52 115 L 22 108" stroke="#21b9b2" strokeWidth="3" strokeLinecap="round" />
          {/* Right wing */}
          <path d="M 148 115 C 180 102, 185 135, 162 152 C 155 138, 150 126, 148 115 Z" fill="url(#ember-coral)" />
          <path d="M 148 115 L 178 108" stroke="#21b9b2" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Dragon Body and segmented chest plates */}
        <g className="ember-body">
          {/* Tail with coral ridges */}
          <path d="M 130 148 C 165 145, 172 175, 145 180 Z" fill="url(#ember-body)" />
          <polygon points="152,150 158,142 162,152" fill="url(#ember-coral)" />
          <polygon points="160,158 168,152 168,162" fill="url(#ember-coral)" />

          {/* Main body */}
          <ellipse cx="100" cy="138" rx="46" ry="40" fill="url(#ember-body)" />

          {/* Segmented chest plates */}
          <path
            d="M 80 125 C 75 145, 84 168, 100 170 C 116 168, 125 145, 120 125 Z"
            fill="url(#ember-belly)"
          />
          <line x1="86" y1="138" x2="114" y2="138" stroke="#f1a695" strokeWidth="2" strokeLinecap="round" />
          <line x1="88" y1="148" x2="112" y2="148" stroke="#f1a695" strokeWidth="2" strokeLinecap="round" />
          <line x1="92" y1="158" x2="108" y2="158" stroke="#f1a695" strokeWidth="2" strokeLinecap="round" />

          {/* Feet */}
          <ellipse cx="75" cy="175" rx="14" ry="9" fill="#1b8b85" />
          <circle cx="70" cy="177" r="2.5" fill="#f8f3df" />
          <circle cx="75" cy="178" r="2.5" fill="#f8f3df" />
          <circle cx="80" cy="177" r="2.5" fill="#f8f3df" />

          <ellipse cx="125" cy="175" rx="14" ry="9" fill="#1b8b85" />
          <circle cx="120" cy="177" r="2.5" fill="#f8f3df" />
          <circle cx="125" cy="178" r="2.5" fill="#f8f3df" />
          <circle cx="130" cy="177" r="2.5" fill="#f8f3df" />
        </g>

        {/* Dragon Head */}
        <g className="ember-head">
          <ellipse cx="100" cy="94" rx="50" ry="42" fill="url(#ember-body)" />

          {/* Coral cheeks */}
          <circle cx="62" cy="112" r="9.5" fill="url(#ember-coral)" opacity="0.85" />
          <circle cx="138" cy="112" r="9.5" fill="url(#ember-coral)" opacity="0.85" />

          {/* Tiny nostrils */}
          <circle cx="96" cy="106" r="1.5" fill="#0d2b29" />
          <circle cx="104" cy="106" r="1.5" fill="#0d2b29" />

          {/* Eyes */}
          {isSleeping ? (
            <g className="ember-sleeping">
              <path d="M 72 92 Q 82 100 92 92" stroke="#0e2a28" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 108 92 Q 118 100 128 92" stroke="#0e2a28" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            <g className="ember-awake">
              <ellipse cx="80" cy="92" rx="9" ry="12" fill="#0a211f" />
              <circle cx="77" cy="87" r="4.5" fill="#ffffff" />
              <circle cx="83" cy="96" r="1.8" fill="#ffffff" />

              <ellipse cx="120" cy="92" rx="9" ry="12" fill="#0a211f" />
              <circle cx="117" cy="87" r="4.5" fill="#ffffff" />
              <circle cx="123" cy="96" r="1.8" fill="#ffffff" />
            </g>
          )}

          {/* Open dragon smile */}
          <path d="M 94 112 Q 100 124 106 112" stroke="#0a211f" strokeWidth="2.5" fill="#e85b4d" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

export function KipiAvatar({ motion = "Idle", size = 180 }) {
  const isThinking = motion === "Think";
  const isWorking = motion === "Work";
  const isSleeping = motion === "Sleep";

  return (
    <div
      className={`companion-figure figure-kipi motion-${motion.toLowerCase()}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Kipi, the Universal Orchestrator & System Maker"
    >
      <svg viewBox="0 0 200 200" className="character-svg">
        <defs>
          <radialGradient id="kipi-hood" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#4de2d9" />
            <stop offset="65%" stopColor="#29c3bc" />
            <stop offset="100%" stopColor="#158d87" />
          </radialGradient>
          <radialGradient id="kipi-coral" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffa091" />
            <stop offset="70%" stopColor="#ff745f" />
            <stop offset="100%" stopColor="#cc412d" />
          </radialGradient>
          <radialGradient id="kipi-face" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="85%" stopColor="#fdf8ee" />
            <stop offset="100%" stopColor="#e5decb" />
          </radialGradient>
          <radialGradient id="kipi-navy" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#2e4e61" />
            <stop offset="80%" stopColor="#183140" />
            <stop offset="100%" stopColor="#0c1b24" />
          </radialGradient>
        </defs>

        {/* Floating Equalizer Waveform for Kipi */}
        {(isWorking || isThinking) && (
          <g className="floating-accessory kipi-equalizer-group" transform="translate(130, 8)">
            <rect x="0" y="24" width="4.5" height="18" rx="2" fill="#29c3bc" />
            <rect x="7" y="14" width="4.5" height="28" rx="2" fill="#ff745f" />
            <rect x="14" y="6" width="4.5" height="36" rx="2" fill="#4de2d9" />
            <rect x="21" y="18" width="4.5" height="24" rx="2" fill="#ff745f" />
            <rect x="28" y="26" width="4.5" height="16" rx="2" fill="#29c3bc" />
          </g>
        )}

        {/* Spherical glowing antenna orb */}
        <g className="kipi-antenna">
          <line x1="100" y1="58" x2="100" y2="34" stroke="#ff745f" strokeWidth="5" strokeLinecap="round" />
          <circle cx="100" cy="28" r="11" fill="url(#kipi-coral)" />
          <circle cx="97" cy="25" r="3.5" fill="#ffffff" opacity="0.8" />
        </g>

        {/* Long floppy ears with coral inner lining */}
        <g className="kipi-ears">
          {/* Left floppy ear */}
          <path d="M 55 80 C 25 95, 20 145, 45 155 C 55 145, 58 115, 60 92 Z" fill="url(#kipi-hood)" />
          <path d="M 48 95 C 32 108, 30 140, 44 148 C 50 140, 52 118, 52 102 Z" fill="url(#kipi-coral)" />
          {/* Right floppy ear */}
          <path d="M 145 80 C 175 95, 180 145, 155 155 C 145 145, 142 115, 140 92 Z" fill="url(#kipi-hood)" />
          <path d="M 152 95 C 168 108, 170 140, 156 148 C 150 140, 148 118, 148 102 Z" fill="url(#kipi-coral)" />
        </g>

        {/* Body and glowing power button */}
        <g className="kipi-body">
          <ellipse cx="100" cy="142" rx="42" ry="36" fill="url(#kipi-hood)" />

          {/* Ivory belly with glowing coral power button */}
          <ellipse cx="100" cy="146" rx="28" ry="24" fill="url(#kipi-face)" />
          <circle cx="100" cy="146" r="9" fill="url(#kipi-coral)" />
          <circle cx="100" cy="146" r="4.5" fill="#ffffff" />

          {/* Dark navy plush boots and mittens */}
          <ellipse cx="78" cy="176" rx="14" ry="10" fill="url(#kipi-navy)" />
          <ellipse cx="122" cy="176" rx="14" ry="10" fill="url(#kipi-navy)" />
          <circle cx="48" cy="138" r="9" fill="url(#kipi-navy)" />
          <circle cx="152" cy="138" r="9" fill="url(#kipi-navy)" />
        </g>

        {/* Hood & Ivory Face */}
        <g className="kipi-head">
          <circle cx="100" cy="94" r="48" fill="url(#kipi-hood)" />
          <ellipse cx="100" cy="98" rx="36" ry="32" fill="url(#kipi-face)" />

          {/* Coral blush */}
          <circle cx="74" cy="108" r="8" fill="url(#kipi-coral)" opacity="0.8" />
          <circle cx="126" cy="108" r="8" fill="url(#kipi-coral)" opacity="0.8" />

          {/* Face */}
          {isSleeping ? (
            <g className="kipi-sleeping">
              <path d="M 76 96 Q 84 104 92 96" stroke="#12363b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 108 96 Q 116 104 124 96" stroke="#12363b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            <g className="kipi-awake">
              <ellipse cx="84" cy="95" rx="7.5" ry="10" fill="#0d292d" />
              <circle cx="82" cy="91" r="3.5" fill="#ffffff" />
              <circle cx="86" cy="98" r="1.5" fill="#ffffff" />

              <ellipse cx="116" cy="95" rx="7.5" ry="10" fill="#0d292d" />
              <circle cx="114" cy="91" r="3.5" fill="#ffffff" />
              <circle cx="118" cy="98" r="1.5" fill="#ffffff" />

              {/* Gentle smile */}
              <path d="M 96 108 Q 100 115 104 108" stroke="#0d292d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}

/**
 * Universal dynamic companion renderer based on character ID
 */
export function CompanionRenderer({ characterId = "ember", motion = "Idle", size = 180 }) {
  switch (characterId.toLowerCase()) {
    case "pomo":
      return <PomoAvatar motion={motion} size={size} />;
    case "fynn":
      return <FynnAvatar motion={motion} size={size} />;
    case "olli":
      return <OlliAvatar motion={motion} size={size} />;
    case "nixi":
      return <NixiAvatar motion={motion} size={size} />;
    case "ember":
      return <EmberAvatar motion={motion} size={size} />;
    case "kipi":
    default:
      return <KipiAvatar motion={motion} size={size} />;
  }
}
