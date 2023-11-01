export default function ShareButtons({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  return (
    <div className="w-full bg-white py-2 px-4 my-5">
      <h4 className="mb-2 font-sans font-semibold">Share</h4>
      <div className="flex">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          target="_blank"
          title="Post on Facebook"
          rel="noopener"
          className="h-5 w-5 mr-2"
        >
          <svg
            viewBox="0 0 524 524"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0)">
              <path
                d="M262 524.037C406.699 524.037 524 406.735 524 262.037C524 117.338 406.699 0.03685 262 0.03685C117.301 0.03685 0 117.338 0 262.037C0 406.735 117.301 524.037 262 524.037Z"
                fill="#1977F3"
              ></path>
              <path
                d="M363.985 337.789L375.591 262.037H302.934V212.887C302.934 192.18 313.066 171.952 345.637 171.952H378.686V107.475C378.686 107.475 348.695 102.354 320.03 102.354C260.195 102.354 221.066 138.608 221.066 204.302V262.037H154.525V337.789H221.066V520.868C234.404 522.968 248.073 524.037 262 524.037C275.927 524.037 289.596 522.932 302.934 520.868V337.789H363.985Z"
                fill="white"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0">
                <rect width="524" height="524" fill="white"></rect>
              </clipPath>
            </defs>
          </svg>
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${title} - DevTyp.i.ng&amp;url=${url}&amp;hashtags=`}
          target="_blank"
          title="Post on X (Twitter)"
          className="h-5 w-5 mr-2 bg-black"
        >
          <svg
            viewBox="0 0 24 24"
            fill="black"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              fill="white"
            ></path>
          </svg>
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
          target="_blank"
          title="Post on LinkedIn"
          rel="noopener"
          className="h-5 w-5 mr-2"
        >
          <svg
            viewBox="0 0 535 534"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M26.8 1.39999C16.3 5.19999 6.7 14.1 2.8 23.8L0.5 29.5V267V504.5L2.8 510.2C5.9 517.8 13.3 525.8 21.2 530.1L27.5 533.5H267.5H507.5L513.7 530.1C521.4 526 528.3 518.8 531.8 511.2L534.5 505.5V267V28.5L531.8 22.8C528.3 15.2 520.9 7.49999 513.5 3.59999L507.5 0.499992L269 0.299992C74.5 0.0999921 29.8 0.299992 26.8 1.39999ZM131.9 74.9C140.3 77.5 145.6 80.8 152.1 87.7C158.4 94.3 161 98.8 163.5 107.4C165.8 115.1 165.1 127.3 162.1 135.2C152.5 160.1 123.4 172 99.7 160.7C70.3 146.8 63.9 108.6 87.1 86C99 74.5 116.6 70.1 131.9 74.9ZM385.7 195.6C390.2 196.4 397.7 198.4 402.4 200.1C430.9 210.4 446.1 231.7 453.3 271.5C455.5 283.2 455.5 285.4 455.5 369.5V455.5H416H376.5L375.9 377.5C375.4 306.5 375.2 299 373.6 293.5C370.8 284.2 367 277.3 362.3 272.9C355.8 266.9 350.2 264.8 338.8 264.2C316.5 263.1 302.8 270 295 286.5C288.6 300.2 288.6 300 288 381.5L287.5 455.5H248H208.5L208.2 327.7L208 200H246.5H285V217.7V235.5L287.7 231.5C301.2 211.3 323.4 197.3 346.7 194.1C355.1 192.9 374.7 193.7 385.7 195.6ZM158.8 327.7L158.5 455.5H119H79.5L79.2 327.7L79 200H119H159L158.8 327.7Z"
              fill="#1666C5"
            ></path>
          </svg>
        </a>
        <span
          className="h-5 w-5 mr-2"
          title="Copy link"
          onClick={() => {
            navigator.clipboard.writeText(url).then(() => alert("Link copied"));
          }}
        >
          <svg
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M311 512H120C75.8867 512 40 476.113 40 432V161C40 116.887 75.8867 81 120 81H311C355.113 81 391 116.887 391 161V432C391 476.113 355.113 512 311 512ZM120 121C97.9453 121 80 138.945 80 161V432C80 454.055 97.9453 472 120 472H311C333.055 472 351 454.055 351 432V161C351 138.945 333.055 121 311 121H120ZM471 382V80C471 35.8867 435.113 0 391 0H169C157.953 0 149 8.95312 149 20C149 31.0469 157.953 40 169 40H391C413.055 40 431 57.9453 431 80V382C431 393.047 439.953 402 451 402C462.047 402 471 393.047 471 382Z"
              fill="currentColor"
            ></path>
          </svg>
        </span>
      </div>
    </div>
  );
}
