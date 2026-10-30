import { useEffect, useRef } from "react";

type Icon = "mail" | "check" | "alert";

interface Props {
  icon: Icon;
  title: string;
  // the explanation under the title
  children: React.ReactNode;
  // buttons or links
  actions: React.ReactNode;
}

const TONE: Record<Icon, string> = {
  mail: "bg-[#0071e3]/12 text-[#0059b8]",
  check: "bg-[#1d7a3e]/12 text-[#1d7a3e]",
  alert: "bg-[#d70015]/10 text-[#a30018]",
};

const PATHS: Record<Icon, React.ReactNode> = {
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M4 7.5l8 6 8-6" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  alert: (
    <>
      <path d="M12 7v6" />
      <path d="M12 16.8v.2" />
      <circle cx="12" cy="12" r="9" />
    </>
  ),
};

// The result of a form (email sent, password changed, link not valid), shown in place of the form
export default function StatusPanel({ icon, title, children, actions }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);

  // move focus to the new message so screen reader users hear it
  useEffect(() => {
    heading.current?.focus();
  }, []);

  return (
    <div role="status">
      <div className={`flex size-14 items-center justify-center rounded-2xl ${TONE[icon]}`}>
        <svg
          aria-hidden="true"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {PATHS[icon]}
        </svg>
      </div>

      <h1
        ref={heading}
        tabIndex={-1}
        className="mt-6 text-[28px] font-semibold leading-[1.1] tracking-[-0.022em] outline-none"
      >
        {title}
      </h1>
      <div className="mt-2 text-[15px] leading-snug text-slate-700">{children}</div>

      <div className="mt-8 space-y-3">{actions}</div>
    </div>
  );
}
