import Link from "next/link"
import { Linkedin, Github, Code, Edit } from "lucide-react"

function PentagonGrowthIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1024 1024" className={className} fill="currentColor" width="3rem" height="3rem" aria-hidden="true" focusable="false">
      <g transform="translate(0,1024) scale(0.1,-0.1)">
        <path
          d="M5035 8176 c-16 -7 -113 -73 -215 -146 -102 -73 -246 -176 -320 -228
-74 -53 -209 -150 -300 -216 -91 -66 -322 -233 -515 -371 -1323 -950 -1253
-898 -1285 -955 -40 -72 -34 -131 34 -355 105 -347 617 -2027 667 -2190 27
-88 91 -298 142 -467 102 -334 113 -357 195 -405 l47 -28 1628 -3 c1060 -1
1642 1 1666 8 47 12 116 71 140 119 20 39 276 878 765 2506 91 303 172 573
180 600 34 110 7 222 -70 282 -93 73 -1292 940 -1669 1208 -154 109 -325 231
-380 270 -262 188 -509 358 -540 371 -42 17 -130 18 -170 0z m246 -319 c79
-56 200 -143 269 -193 69 -50 220 -157 335 -239 116 -82 271 -194 345 -249 74
-55 351 -255 615 -446 539 -388 774 -562 775 -572 0 -3 -46 -39 -102 -79 -57
-40 -171 -123 -255 -185 -118 -88 -154 -110 -162 -100 -6 7 -44 28 -83 47 -66
31 -81 34 -164 34 -84 0 -95 -2 -166 -38 -165 -81 -248 -239 -220 -419 6 -40
9 -75 6 -79 -3 -6 -601 -479 -669 -530 -6 -4 -37 2 -70 13 -49 16 -76 19 -145
15 -47 -3 -94 -8 -105 -11 -16 -6 -95 69 -433 407 l-413 413 468 464 468 464
5 -423 5 -423 37 -34 c45 -41 94 -45 146 -14 64 39 63 28 60 681 l-3 591 -32
29 c-50 44 -71 45 -232 10 -80 -18 -294 -57 -476 -87 -415 -69 -530 -91 -554
-106 -55 -34 -69 -135 -26 -186 40 -47 71 -48 292 -3 235 46 522 95 529 89 2
-3 -494 -505 -1103 -1117 -757 -762 -1109 -1108 -1114 -1099 -4 7 -37 114 -74
238 -64 217 -128 430 -331 1095 -53 171 -97 317 -100 326 -5 17 80 81 542 411
127 91 361 260 520 375 159 115 433 313 609 440 176 126 433 311 570 411 138
99 259 181 271 181 11 1 86 -45 165 -102z m2259 -2062 c0 -11 -179 -612 -380
-1275 -76 -250 -180 -594 -230 -765 -51 -170 -95 -314 -99 -318 -4 -4 -211
198 -459 449 l-452 456 15 51 c17 58 19 137 5 186 -7 25 -6 39 3 49 14 18 262
213 495 390 l173 132 58 -29 c179 -91 394 -42 501 113 58 86 86 226 61 312
l-9 32 152 110 c142 103 166 119 166 107z m-629 -156 c40 -14 85 -53 105 -91
22 -43 18 -129 -9 -169 -63 -94 -183 -113 -268 -42 -76 64 -79 194 -8 260 56
51 113 64 180 42z m-2501 -859 l0 -630 -50 -25 c-68 -34 -126 -95 -159 -164
-24 -51 -26 -67 -26 -181 l0 -126 -60 -49 c-33 -28 -176 -148 -317 -268 -141
-120 -260 -219 -264 -220 -8 -2 -5 -13 -113 338 -44 143 -114 372 -156 508
l-76 248 41 49 c23 28 54 59 68 71 15 11 137 129 272 262 595 588 829 817 834
817 3 0 6 -283 6 -630z m721 52 l175 -179 -14 -39 c-23 -65 -12 -198 22 -267
33 -69 100 -130 172 -157 59 -22 192 -28 237 -11 23 9 58 -23 530 -495 l505
-506 -14 -51 c-7 -28 -21 -59 -31 -69 -18 -17 -80 -18 -1476 -21 -801 -1
-1456 1 -1455 4 2 4 124 108 272 232 l269 225 31 -19 c52 -30 153 -52 210 -44
111 14 233 102 283 203 25 51 28 68 28 157 0 87 -3 107 -27 157 -34 74 -95
139 -163 174 l-55 29 0 584 0 583 163 -155 c90 -86 242 -237 338 -335z m555
-228 c12 -8 30 -31 39 -51 23 -48 12 -98 -30 -140 -28 -28 -40 -33 -79 -33
-38 0 -52 6 -82 33 -114 104 22 275 152 191z m-1092 -683 c46 -30 66 -70 66
-130 0 -49 -3 -57 -39 -92 -35 -35 -44 -39 -90 -39 -63 0 -105 20 -131 63 -24
38 -26 106 -5 146 33 65 137 92 199 52z"
        />
      </g>
    </svg>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-accent-rule bg-bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <PentagonGrowthIcon className="h-6 w-6 text-text-secondary" />
              <span className="text-lg font-bold text-text-primary">John Munn</span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed">
              Technical leader building scalable solutions and high-performing teams through strategic thinking and
              calm, reflective authority.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h2 className="footer-heading text-text-primary">Navigation</h2>
            <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-y-1">
              {["Home", "Writing", "Projects", "About", "Contact"].map((name, i) => (
                <span key={name} className="inline-flex items-center">
                  {i > 0 && <span className="text-text-secondary select-none px-1.5">|</span>}
                  <Link
                    href={name === "Home" ? "/" : `/${name.toLowerCase()}`}
                    className="text-text-secondary hover:text-accent-primary transition-colors text-sm py-1 touch-manipulation"
                  >
                    {name}
                  </Link>
                </span>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h2 className="footer-heading text-text-primary">Connect</h2>
            <div className="flex flex-wrap gap-2">
              {[
                { href: "https://www.linkedin.com/in/john-munn-bbab434b/", label: "LinkedIn", Icon: Linkedin },
                { href: "https://github.com/Tawe", label: "GitHub", Icon: Github },
                { href: "https://medium.com/@johnmunn", label: "Medium", Icon: Edit },
                { href: "https://dev.to/tawe", label: "Dev.to", Icon: Code },
              ].map(({ href, label, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-text-secondary hover:text-accent-primary transition-colors p-3 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation rounded-lg"
                  aria-label={`${label} (opens in new tab)`}
                  {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border-subtle mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-text-secondary text-sm">© {new Date().getFullYear()} John Munn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
