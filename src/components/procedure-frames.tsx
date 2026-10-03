import type { ReactNode } from "react";
import type { FrameDraw, FrameSpec } from "@/data/topics";

/**
 * Shared shapes for the procedure-day drawings.
 * Rendered once per strip so `<use href="#side">` and marker/pattern urls resolve.
 */
function SchematicSprite() {
  return (
    <svg
      width="0"
      height="0"
      className="pointer-events-none absolute h-0 w-0 overflow-hidden"
      aria-hidden="true"
    >
      <defs>
        <g id="side">
          <path d="M62 31A40 40 0 1 1 62 89Q38 60 62 31Z" fill="#fff" />
          <path
            d="M100 27.7A34 34 0 0 1 100 92.3"
            stroke="#e58a8a"
            strokeWidth="3"
            opacity=".55"
          />
        </g>
        <g id="irisS">
          <path d="M64 30V47M64 73V90" stroke="#7a8fa6" strokeWidth="3" />
        </g>
        <g id="lid">
          <path d="M25 60Q80 15 135 60Q80 105 25 60Z" fill="#fff" />
        </g>
        <g id="iris">
          <circle cx="80" cy="60" r="19" fill="#7bb6e8" />
          <circle cx="80" cy="60" r="8" fill="#2b3a4a" />
          <circle cx="85" cy="55" r="3" fill="#fff" stroke="none" />
        </g>
        <g id="irisBig">
          <circle cx="80" cy="60" r="19" fill="#7bb6e8" />
          <circle cx="80" cy="60" r="14" fill="#2b3a4a" />
        </g>
        <g id="dropper">
          <rect x="-6" y="-20" width="12" height="10" rx="5" fill="#f28ab2" />
          <path d="M-4 -10V-3L-1.5 2H1.5L4 -3V-10Z" fill="#fff" />
          <path d="M0 6C4 10 4 14 0 14C-4 14 -4 10 0 6Z" fill="#5bb4f0" />
        </g>
        <g id="toric">
          <circle r="6" strokeDasharray="2 2" />
          <path d="M-9 3L9 -3" strokeWidth="2" />
        </g>
        <pattern
          id="hatch"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <path d="M0 2.5H5M2.5 0V5" stroke="#8a4b2a" strokeWidth="1" />
        </pattern>
        <marker
          id="arK"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto"
        >
          <path d="M0 0L10 5L0 10z" fill="#2b3a4a" stroke="none" />
        </marker>
        <marker
          id="arB"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto"
        >
          <path d="M0 0L10 5L0 10z" fill="#2f7fd8" stroke="none" />
        </marker>
      </defs>
    </svg>
  );
}

function Draw({ draw }: { draw: FrameDraw }): ReactNode {
  switch (draw) {
    case "ivt-concept":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="眼球側面，玻璃體內一點" className="proc-svg">
          <use href="#side" />
          <circle cx="90" cy="58" r="6" fill="#2f7fd8" />
          <path d="M90 66V78" strokeWidth="1.5" />
          <text x="90" y="92" textAnchor="middle">
            類別
          </text>
        </svg>
      );
    case "ivt-drops":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="眼藥水瓶在眼睛上方，一滴" className="proc-svg">
          <use href="#lid" />
          <use href="#iris" />
          <use href="#dropper" transform="translate(80 22) scale(.8)" />
        </svg>
      );
    case "ivt-hold":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="手指撐開眼皮，眼白上有一個記號" className="proc-svg">
          <use href="#lid" />
          <use href="#iris" transform="translate(-16 0)" />
          <rect x="50" y="20" width="60" height="16" rx="8" fill="#f8d9bd" />
          <rect x="50" y="84" width="60" height="16" rx="8" fill="#f8d9bd" />
          <path d="M80 15V5" markerEnd="url(#arK)" />
          <path d="M80 105V115" markerEnd="url(#arK)" />
          <path d="M22 60H8" markerEnd="url(#arK)" />
          <g transform="translate(114 60)">
            <circle r="5.5" fill="#fff" stroke="#e0433a" />
            <path d="M-3 0H3M0-3V3" stroke="#e0433a" strokeWidth="2" />
          </g>
        </svg>
      );
    case "ivt-enter":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="虛線由眼白上的記號通向玻璃體內的點" className="proc-svg">
          <use href="#side" />
          <circle cx="78" cy="21.7" r="4.5" fill="#fff" stroke="#e0433a" />
          <circle cx="90" cy="58" r="6" fill="#2f7fd8" />
          <path d="M79 27L88 50" stroke="#2f7fd8" strokeDasharray="4 4" markerEnd="url(#arB)" />
        </svg>
      );
    case "ivt-spot":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="視野中有一個虛線圓圈" className="proc-svg">
          <rect x="20" y="14" width="120" height="92" rx="16" fill="#fff" />
          <circle cx="44" cy="38" r="7" fill="#ffd25a" stroke="none" />
          <path d="M30 84Q58 64 86 82T130 76" />
          <circle cx="100" cy="52" r="14" fill="#333" fillOpacity=".25" strokeDasharray="4 4" />
        </svg>
      );
    case "ivt-red":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="眼白上有一塊紅" className="proc-svg">
          <use href="#lid" />
          <use href="#iris" />
          <ellipse cx="113" cy="60" rx="9" ry="6" fill="#e0433a" stroke="none" transform="rotate(-15 113 60)" />
        </svg>
      );
    case "ch-gland":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="眼皮橫切面，腺體堵住，有一粒硬塊" className="proc-svg">
          <g transform="translate(-8 0)">
            <path d="M55 10H105V72Q105 88 80 88Q55 88 55 72Z" fill="#fbdcc4" />
            <path d="M64 92L62 100M80 93V102M96 92L98 100" strokeWidth="2" />
            <rect x="66" y="30" width="28" height="48" rx="9" fill="#fff6e6" />
            <path d="M78 34V62" stroke="#d99a00" strokeWidth="5" />
            <rect x="72" y="62" width="12" height="10" rx="3" fill="#7a5a2a" />
            <circle cx="100" cy="58" r="13" fill="#f6c54a" />
          </g>
          <path d="M105 60H110" strokeWidth="1.5" />
          <text x="112" y="64">
            霰粒腫
          </text>
        </svg>
      );
    case "ch-numb":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="上眼皮一塊麻的位置" className="proc-svg">
          <path d="M28 18Q80 4 132 18" strokeWidth="3" />
          <use href="#lid" />
          <use href="#iris" />
          <ellipse cx="80" cy="28" rx="30" ry="8" fill="#9fd3ff" fillOpacity=".65" strokeDasharray="4 3" />
          <path
            d="M46 20l2 4 4 2-4 2-2 4-2-4-4-2 4-2z M116 18l2 4 4 2-4 2-2 4-2-4-4-2 4-2z"
            fill="#fff"
            stroke="#2f7fd8"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "ch-inner":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="翻開眼皮內側，可見硬粒" className="proc-svg">
          <path d="M24 34Q80 10 136 34V84Q80 108 24 84Z" fill="#f7b3b3" />
          <path d="M24 34Q80 10 136 34" strokeWidth="4" />
          <circle cx="86" cy="58" r="14" fill="#f6c54a" />
          <path d="M80 52Q84 48 90 50" stroke="#fff" strokeWidth="2" />
          <text x="80" y="92" textAnchor="middle">
            內側
          </text>
          <path d="M122 14Q148 10 146 36" markerEnd="url(#arK)" />
        </svg>
      );
    case "ch-ointment":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="眼睛旁邊有眼膏管和眼墊" className="proc-svg">
          <g transform="translate(0 28) scale(.6)">
            <use href="#lid" />
            <use href="#iris" />
          </g>
          <g transform="translate(98 66)">
            <path d="M-6 0Q-12 -5 -16 0T-28 0" stroke="#38b2a3" strokeWidth="4" />
            <path d="M2 -5L14 -11H42V11H14L2 5Z" fill="#fff" />
            <rect x="-6" y="-4" width="8" height="8" rx="2" fill="#e0433a" />
            <rect x="20" y="-11" width="8" height="22" fill="#38b2a3" stroke="none" />
            <path d="M42 -11H50V11H42" fill="#ccd6df" />
          </g>
          <g transform="translate(112 8)">
            <rect width="30" height="26" rx="4" fill="#fff" />
            <path d="M15 6V20M8 13H22" />
          </g>
        </svg>
      );
    case "ch-bruise":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="眼皮腫和瘀青" className="proc-svg">
          <ellipse cx="80" cy="58" rx="66" ry="42" fill="#8e5bb5" fillOpacity=".28" stroke="none" />
          <ellipse cx="80" cy="42" rx="40" ry="14" fill="#8e5bb5" fillOpacity=".35" stroke="none" />
          <path d="M30 54Q80 0 130 54" strokeDasharray="3 4" strokeWidth="2" />
          <use href="#lid" />
          <use href="#iris" />
        </svg>
      );
    case "bar-fundus":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="眼底圓盤，周邊有一個小裂孔和一塊柵狀變性" className="proc-svg">
          <circle cx="80" cy="58" r="44" fill="#ffd9b8" />
          <circle cx="58" cy="54" r="6" fill="#fff0a8" />
          <circle cx="90" cy="62" r="6" fill="#f2a65a" stroke="none" />
          <ellipse cx="112" cy="42" rx="4.5" ry="3.5" fill="#b3261e" />
          <path d="M116 38L128 30" strokeWidth="1.5" />
          <text x="128" y="28">
            裂孔
          </text>
          <ellipse cx="58" cy="88" rx="9" ry="5" fill="url(#hatch)" transform="rotate(-25 58 88)" />
          <path d="M52 92L40 102" strokeWidth="1.5" />
          <text x="4" y="114">
            柵狀變性
          </text>
        </svg>
      );
    case "bar-sit":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="眼睛對着機器的燈桿，瞳孔放大" className="proc-svg">
          <g transform="translate(-12 32) scale(.55)">
            <use href="#lid" />
            <use href="#irisBig" />
          </g>
          <rect x="68" y="58" width="34" height="12" rx="6" fill="#ffd25a" />
          <rect x="98" y="30" width="48" height="72" rx="8" fill="#dfe8f0" />
          <circle cx="122" cy="52" r="8" fill="#fff" />
          <rect x="108" y="80" width="28" height="8" rx="4" fill="#fff" />
        </svg>
      );
    case "bar-contact":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="接觸鏡貼在角膜上" className="proc-svg">
          <use href="#side" />
          <path d="M60 26Q30 60 60 94Q40 60 60 26Z" fill="#aee6f2" />
          <path d="M12 60H32" markerEnd="url(#arK)" />
          <path d="M16 38L32 48M16 82L32 72" markerEnd="url(#arK)" />
        </svg>
      );
    case "bar-spots":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="周邊裂孔旁邊有一些淡點，黃斑上沒有" className="proc-svg">
          <circle cx="80" cy="60" r="54" fill="#ffd9b8" />
          <circle cx="76" cy="62" r="7" fill="#f2a65a" stroke="none" />
          <ellipse cx="118" cy="40" rx="5" ry="4" fill="#b3261e" />
          <g fill="#fff2c6" stroke="#e39a2d" strokeWidth="1.2">
            <circle cx="102" cy="46" r="2.6" />
            <circle cx="104" cy="33" r="2.6" />
            <circle cx="113" cy="25" r="2.6" />
            <circle cx="121" cy="31" r="2.6" />
            <circle cx="126" cy="47" r="2.6" />
            <circle cx="123" cy="56" r="2.6" />
            <circle cx="111" cy="57" r="2.6" />
            <circle cx="119" cy="49" r="2.6" />
          </g>
        </svg>
      );
    case "bar-leave":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="瞳孔仍然放大，旁邊有模糊線條" className="proc-svg">
          <path d="M10 28q5-5 10 0t10 0t10 0" stroke="#9aa9b8" />
          <path d="M112 98q5-5 10 0t10 0t10 0" stroke="#9aa9b8" />
          <use href="#lid" />
          <use href="#irisBig" />
        </svg>
      );
    case "yag-fog":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="人工晶體在前，後面的囊膜有霧" className="proc-svg">
          <use href="#side" />
          <use href="#irisS" />
          <path d="M70 44Q66 37 70 33M70 76Q66 83 70 87" strokeWidth="2" />
          <ellipse cx="72" cy="60" rx="5" ry="16" fill="#9ed8f5" />
          <path d="M82 34Q88 60 82 86" stroke="#9aa5b1" />
          <g fill="#777" fillOpacity=".45" stroke="none">
            <circle cx="86" cy="42" r="4" />
            <circle cx="88" cy="50" r="5" />
            <circle cx="90" cy="60" r="6" />
            <circle cx="88" cy="70" r="5" />
            <circle cx="86" cy="78" r="4" />
          </g>
        </svg>
      );
    case "yag-sit":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="眼睛對着裂隙燈，上方有一滴眼藥水" className="proc-svg">
          <g transform="translate(-6 34) scale(.5)">
            <use href="#lid" />
            <use href="#iris" />
          </g>
          <use href="#dropper" transform="translate(34 36) scale(.6)" />
          <path d="M76 56L50 64L76 72Z" fill="#ffe680" fillOpacity=".6" stroke="none" />
          <rect x="76" y="52" width="14" height="24" rx="4" fill="#ffd25a" />
          <rect x="90" y="60" width="12" height="8" fill="#dfe8f0" />
          <rect x="100" y="30" width="46" height="72" rx="8" fill="#dfe8f0" />
          <rect x="110" y="84" width="26" height="8" rx="4" fill="#fff" />
        </svg>
      );
    case "yag-flash":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="瞳孔中一閃亮光" className="proc-svg">
          <use href="#lid" />
          <use href="#iris" />
          <path
            d="M80 48L83 57L92 60L83 63L80 72L77 63L68 60L77 57Z"
            fill="#ffd93a"
            stroke="#e0a000"
            strokeWidth="1.5"
          />
          <path d="M56 60H46M104 60H114M62 44L55 38M98 44L105 38" stroke="#f5b800" />
          <path d="M124 28q6 6 0 12M131 24q10 10 0 20" strokeWidth="2" />
        </svg>
      );
    case "yag-window":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="人工晶體後面的囊膜中央有一道窗，光線穿過到視網膜" className="proc-svg">
          <use href="#side" />
          <use href="#irisS" />
          <path d="M70 44Q66 37 70 33M70 76Q66 83 70 87" strokeWidth="2" />
          <ellipse cx="72" cy="60" rx="5" ry="16" fill="#9ed8f5" />
          <path d="M82 34Q84 43 84.7 51M84.7 69Q84 77 82 86" stroke="#9aa5b1" />
          <g fill="#777" fillOpacity=".45" stroke="none">
            <circle cx="87" cy="42" r="4" />
            <circle cx="88" cy="48" r="3.5" />
            <circle cx="88" cy="72" r="3.5" />
            <circle cx="87" cy="78" r="4" />
          </g>
          <path d="M10 54H118M10 66H118" stroke="#f5b800" strokeDasharray="5 4" strokeWidth="2" />
          <path d="M10 60H118" stroke="#f5b800" strokeDasharray="5 4" markerEnd="url(#arK)" />
        </svg>
      );
    case "yag-iop":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="眼壓檢查和幾條新飛蚊" className="proc-svg">
          <g transform="translate(-2 34) scale(.5)">
            <use href="#lid" />
            <use href="#iris" />
          </g>
          <path d="M26 24V44M44 24V44" markerEnd="url(#arK)" />
          <text x="35" y="96" textAnchor="middle">
            眼壓
          </text>
          <rect x="84" y="20" width="72" height="80" rx="12" fill="#fff" />
          <g stroke="#555" strokeWidth="2">
            <path d="M98 40q4-6 8 0t8 0" />
            <path d="M122 62q3-5 6 0t6 0" />
            <path d="M96 80q4-6 8 0t8 0" />
          </g>
        </svg>
      );
    case "cat-cloud":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="眼球側面，自身晶狀體混濁" className="proc-svg">
          <use href="#side" />
          <use href="#irisS" />
          <ellipse cx="76" cy="60" rx="9" ry="19" fill="#d8d2b0" />
          <g fill="#8a8670" fillOpacity=".55" stroke="none">
            <circle cx="74" cy="52" r="4" />
            <circle cx="79" cy="62" r="5" />
            <circle cx="74" cy="70" r="3.5" />
          </g>
        </svg>
      );
    case "cat-light":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="一滴眼藥水，上方一條亮燈桿照向眼睛" className="proc-svg">
          <g transform="translate(28 30) scale(.75)">
            <use href="#lid" />
            <use href="#iris" />
          </g>
          <path d="M104 16L148 16L108 70Z" fill="#ffe680" fillOpacity=".55" stroke="none" />
          <rect x="100" y="6" width="52" height="10" rx="5" fill="#ffd25a" />
          <use href="#dropper" transform="translate(62 46) scale(.8)" />
          <path d="M94 2V-2M156 20L160 22" stroke="#f5b800" strokeWidth="2" />
        </svg>
      );
    case "cat-water":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="水流在眼上，兩側箭咀表示壓力" className="proc-svg">
          <use href="#lid" />
          <use href="#iris" />
          <path d="M30 24q8-7 16 0t16 0t16 0t16 0t16 0" stroke="#2f7fd8" />
          <path d="M46 32q8-6 14 0t14 0t14 0" stroke="#2f7fd8" />
          <path d="M8 60H22" markerEnd="url(#arK)" />
          <path d="M152 60H138" markerEnd="url(#arK)" />
          <path
            d="M30 100C34 105 34 109 30 109C26 109 26 105 30 100Z M126 98C130 103 130 107 126 107C122 107 122 103 126 98Z"
            fill="#5bb4f0"
            stroke="none"
          />
        </svg>
      );
    case "cat-iol":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="透明人工晶體放在原有囊袋內" className="proc-svg">
          <use href="#side" />
          <use href="#irisS" />
          <ellipse cx="78" cy="60" rx="10" ry="23" stroke="#e0a45a" fill="#fff6e6" />
          <path d="M78 45Q70 40 72 37M78 75Q70 80 72 83" strokeWidth="2" />
          <ellipse cx="78" cy="60" rx="4" ry="15" fill="#c9f0ff" />
          <path d="M102 46l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fff" stroke="#2f7fd8" strokeWidth="1.5" />
        </svg>
      );
    case "cat-classes":
      return <ClassRow />;
    case "cat-shield":
      return (
        <svg viewBox="0 0 160 120" role="img" aria-label="眼罩蓋住眼睛，旁邊有一間屋" className="proc-svg">
          <ellipse cx="80" cy="64" rx="50" ry="34" fill="#dfe6ec" />
          <g fill="#8ea0b2" stroke="none">
            <circle cx="66" cy="50" r="2.2" />
            <circle cx="80" cy="50" r="2.2" />
            <circle cx="94" cy="50" r="2.2" />
            <circle cx="56" cy="62" r="2.2" />
            <circle cx="70" cy="62" r="2.2" />
            <circle cx="84" cy="62" r="2.2" />
            <circle cx="98" cy="62" r="2.2" />
            <circle cx="112" cy="62" r="2.2" />
            <circle cx="66" cy="76" r="2.2" />
            <circle cx="80" cy="76" r="2.2" />
            <circle cx="94" cy="76" r="2.2" />
          </g>
          <rect x="6" y="56" width="26" height="16" rx="3" fill="#f4e3c0" transform="rotate(-10 20 64)" />
          <rect x="128" y="56" width="26" height="16" rx="3" fill="#f4e3c0" transform="rotate(10 140 64)" />
          <path d="M128 20L141 7L154 20V32H128Z" fill="#fff" />
          <path d="M138 32V24H144V32" />
        </svg>
      );
    default:
      return null;
  }
}

/** Four optical classes. Toric is the dashed note under the row, not a fifth class. */
function ClassRow() {
  return (
    <div className="proc-cls">
      <div className="c">
        <svg viewBox="0 0 70 80" role="img" aria-label="單焦點：光聚到一點" className="proc-svg">
          <path d="M2 26H18M2 40H18M2 54H18" stroke="#f0b400" strokeWidth="2" />
          <ellipse cx="24" cy="40" rx="5" ry="20" fill="#cdeeff" />
          <path d="M28 26L56 40L28 54M28 40H56" strokeWidth="1.8" />
          <circle cx="56" cy="40" r="3.5" fill="#e0433a" stroke="none" />
        </svg>
        <b>單焦點</b>
      </div>
      <div className="c">
        <svg viewBox="0 0 70 80" role="img" aria-label="加強型單焦點：焦點稍為拉長" className="proc-svg">
          <path d="M2 26H18M2 40H18M2 54H18" stroke="#f0b400" strokeWidth="2" />
          <ellipse cx="24" cy="40" rx="5" ry="20" fill="#cdeeff" />
          <path d="M22 28Q27 40 22 52" strokeDasharray="2 2" strokeWidth="1.5" />
          <path d="M28 26L54 40L28 54M28 40H54" strokeWidth="1.8" />
          <path d="M54 40H61" stroke="#e0433a" strokeWidth="5" />
        </svg>
        <b>
          加強型
          <br />
          單焦點
        </b>
      </div>
      <div className="c">
        <svg viewBox="0 0 70 80" role="img" aria-label="延伸景深：焦點拉成一段" className="proc-svg">
          <path d="M2 26H18M2 40H18M2 54H18" stroke="#f0b400" strokeWidth="2" />
          <ellipse cx="24" cy="40" rx="5" ry="20" fill="#cdeeff" />
          <path d="M28 26L46 40L28 54M28 40H46" strokeWidth="1.8" />
          <path d="M46 40H66" stroke="#e0433a" strokeWidth="5" />
        </svg>
        <b>
          延伸景深
          <br />
          EDOF
        </b>
        <span className="proc-halo">光暈通常較明顯</span>
      </div>
      <div className="c">
        <svg viewBox="0 0 70 80" role="img" aria-label="多焦點：光分到兩個焦點" className="proc-svg">
          <path d="M2 26H18M2 40H18M2 54H18" stroke="#f0b400" strokeWidth="2" />
          <ellipse cx="24" cy="40" rx="5" ry="20" fill="#cdeeff" />
          <path d="M21 32Q24 40 21 48M27 32Q24 40 27 48" strokeWidth="1.3" />
          <path d="M28 26L44 40M28 40H44M28 54L62 40" strokeWidth="1.8" />
          <circle cx="44" cy="40" r="3.5" fill="#e0433a" stroke="none" />
          <circle cx="62" cy="40" r="3.5" fill="#e0433a" stroke="none" />
        </svg>
        <b>多焦點</b>
        <span className="proc-halo">光暈通常較明顯</span>
      </div>
    </div>
  );
}

export function ProcedureFrames({ frames }: { frames: FrameSpec[] }) {
  return (
    <div className="proc-strip">
      <SchematicSprite />
      <div className="proc-row">
        {frames.map((frame, index) => (
          <figure
            key={frame.draw}
            className={frame.draw === "cat-classes" ? "proc-frame wide" : "proc-frame"}
          >
            <h4>
              <b>{index + 1}</b>
              {frame.title}
            </h4>
            <Draw draw={frame.draw} />
            {frame.tag ? <span className="proc-tag">{frame.tag}</span> : null}
            {frame.draw === "cat-classes" && frame.note ? (
              <p className="proc-toric">
                <svg viewBox="-12 -10 24 20" aria-hidden="true">
                  <use href="#toric" stroke="#7a8a9a" />
                </svg>
                {frame.note}
              </p>
            ) : null}
            <figcaption>{frame.caption}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
