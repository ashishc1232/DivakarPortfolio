import fs from 'fs';

const css = fs.readFileSync('src/components/sections/hero.css', 'utf8');

const target = `@media (prefers-reduced-motion: no-preference) {
  .poster[data-motion="true"] .poster-title img {
    animation-duration: 0.75s;
  }
  .poster[data-motion="true"] .poster-person img {
    animation: portrait-depth 1s cubic-bezier(0.2, 0.75, 0.2, 1) 0.62s both;
  }
  .poster[data-motion="true"] .poster-name {
    animation: credit-in 0.55s ease-out 1.45s both;
  }
  .poster[data-motion="true"] .poster-role {
    animation: credit-in 0.55s ease-out 1.85s both;
  }
  .poster[data-motion="true"] .poster-tool {
    animation: tool-orbit 2.5s linear calc(2.3s + var(--slot) * 0.43s) both;
  }
  .poster[data-paused="true"] .poster-take * {
    animation-play-state: paused !important;
  }
  @keyframes portrait-depth {
    from {
      opacity: 0;
      transform: perspective(1100px) translateZ(-180px) translateY(5%) rotateY(-11deg);
    }
    to {
      opacity: 1;
      transform: perspective(1100px) translateZ(0);
    }
  }
  @keyframes credit-in {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
  @keyframes tool-orbit {
    0% {
      opacity: 0;
      left: 50%;
      top: 47%;
      z-index: 1;
      transform: translate(-50%, -50%) scale(0.45) rotateY(-40deg);
    }
    12% {
      opacity: 1;
      z-index: 1;
      top: 45%;
      left: 35%;
    }
    28% {
      left: 18%;
      top: 49%;
      z-index: 1;
      transform: translate(-50%, -50%) scale(0.74) rotate(-9deg);
    }
    33% {
      left: 17%;
      top: 53%;
      z-index: 4;
    }
    52% {
      left: 42%;
      top: 63%;
      z-index: 4;
      transform: translate(-50%, -50%) scale(1.16) rotate(3deg);
    }
    66% {
      left: 70%;
      top: 61%;
      z-index: 4;
      transform: translate(-50%, -50%) scale(1.06) rotate(7deg);
    }
    74% {
      left: 80%;
      top: 56%;
      z-index: 4;
      animation-timing-function: cubic-bezier(0.22, 0.8, 0.24, 1);
    }
    100% {
      opacity: 1;
      left: var(--dock-x);
      top: var(--dock-y);
      z-index: 4;
      transform: translate(-50%, -50%);
    }
  }
}`;

const replacement = `@media (prefers-reduced-motion: no-preference) {
  .poster[data-motion="true"] .poster-back {
    animation: backdrop-dolly 2.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .poster[data-motion="true"] .poster-flare {
    animation: flare-sweep 2.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
  }
  .poster[data-motion="true"] .poster-title img {
    animation: title-cinematic 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both;
  }
  .poster[data-motion="true"] .poster-person img {
    animation: protagonist-reveal 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
  }
  .poster[data-motion="true"] .poster-name {
    animation: credits-title 0.85s cubic-bezier(0.16, 1, 0.3, 1) 1.25s both;
  }
  .poster[data-motion="true"] .poster-role {
    animation: credits-role 0.85s cubic-bezier(0.16, 1, 0.3, 1) 1.55s both;
  }
  .poster[data-motion="true"] .poster-actions {
    animation: actions-appear 0.75s cubic-bezier(0.16, 1, 0.3, 1) 1.85s both;
  }
  .poster[data-motion="true"] .poster-tool {
    animation: tool-orbit 2.2s cubic-bezier(0.16, 1, 0.3, 1) calc(1.95s + var(--slot) * 0.32s) both;
  }
  .poster[data-paused="true"] .poster-take * {
    animation-play-state: paused !important;
  }

  @keyframes backdrop-dolly {
    0% {
      opacity: 0.1;
      transform: scale(1.15) translate3d(calc(var(--px) * -6px), calc(var(--py) * -4px), 0);
      filter: brightness(0.3) saturate(1.4);
    }
    50% {
      opacity: 0.9;
      filter: brightness(1.2) saturate(1.15);
    }
    100% {
      opacity: 1;
      transform: scale(1) translate3d(calc(var(--px) * -6px), calc(var(--py) * -4px), 0);
      filter: brightness(1) saturate(1);
    }
  }

  @keyframes flare-sweep {
    0% {
      opacity: 0;
      transform: scale(0.7) translate(-10%, -8%);
    }
    35% {
      opacity: 0.95;
      transform: scale(1.15) translate(0, 0);
    }
    100% {
      opacity: 0.25;
      transform: scale(1) translate(0, 0);
    }
  }

  @keyframes title-cinematic {
    0% {
      opacity: 0;
      filter: blur(18px) brightness(0.15);
      transform: perspective(1200px) translateZ(-280px) translateY(14%) rotateX(-20deg) scale(0.9);
    }
    60% {
      opacity: 0.95;
      filter: blur(2px) brightness(1.25);
    }
    100% {
      opacity: 1;
      filter: blur(0) brightness(1);
      transform: perspective(1200px) translateZ(0) translateY(0) rotateX(0) scale(1);
    }
  }

  @keyframes protagonist-reveal {
    0% {
      opacity: 0;
      filter: brightness(0.15) contrast(1.5) drop-shadow(0 0 50px rgba(163, 28, 27, 0.9));
      transform: perspective(1100px) translateY(16%) translateZ(-160px) rotateY(-8deg) scale(1.1);
    }
    50% {
      opacity: 0.95;
      filter: brightness(1.25) contrast(1.2) drop-shadow(0 0 45px rgba(235, 101, 92, 0.6));
    }
    100% {
      opacity: 1;
      filter: brightness(1) contrast(1) drop-shadow(0 20px 40px rgba(0, 0, 0, 0.7));
      transform: perspective(1100px) translateY(0) translateZ(0) rotateY(0) scale(1);
    }
  }

  @keyframes credits-title {
    0% {
      opacity: 0;
      filter: blur(10px);
      transform: translateY(32px) translateZ(-40px);
    }
    100% {
      opacity: 1;
      filter: blur(0);
      transform: translateY(0) translateZ(0);
    }
  }

  @keyframes credits-role {
    0% {
      opacity: 0;
      filter: blur(10px);
      transform: translateX(35px) translateZ(-40px);
    }
    100% {
      opacity: 1;
      filter: blur(0);
      transform: translateX(0) translateZ(0);
    }
  }

  @keyframes actions-appear {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes tool-orbit {
    0% {
      opacity: 0;
      left: 50%;
      top: 47%;
      z-index: 1;
      transform: translate(-50%, -50%) scale(0.45) rotateY(-40deg);
    }
    12% {
      opacity: 1;
      z-index: 1;
      top: 45%;
      left: 35%;
    }
    28% {
      left: 18%;
      top: 49%;
      z-index: 1;
      transform: translate(-50%, -50%) scale(0.74) rotate(-9deg);
    }
    33% {
      left: 17%;
      top: 53%;
      z-index: 4;
    }
    52% {
      left: 42%;
      top: 63%;
      z-index: 4;
      transform: translate(-50%, -50%) scale(1.16) rotate(3deg);
    }
    66% {
      left: 70%;
      top: 61%;
      z-index: 4;
      transform: translate(-50%, -50%) scale(1.06) rotate(7deg);
    }
    74% {
      left: 80%;
      top: 56%;
      z-index: 4;
      animation-timing-function: cubic-bezier(0.22, 0.8, 0.24, 1);
    }
    100% {
      opacity: 1;
      left: var(--dock-x);
      top: var(--dock-y);
      z-index: 4;
      transform: translate(-50%, -50%);
    }
  }
}`;

const normCss = css.replace(/\r\n/g, '\n');
const normTarget = target.replace(/\r\n/g, '\n');
if (normCss.includes(normTarget)) {
  const updated = normCss.replace(normTarget, replacement);
  fs.writeFileSync('src/components/sections/hero.css', updated, 'utf8');
  console.log('SUCCESS: hero.css updated!');
} else {
  console.error('FAIL: target not found');
}

