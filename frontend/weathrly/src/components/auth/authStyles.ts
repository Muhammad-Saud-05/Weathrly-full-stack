// Class names shared by the sign-in and sign-up forms

export const inputClass =
  "h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-base text-slate-900 " +
  "placeholder:text-slate-500 outline-none transition-[border-color,box-shadow] duration-150 " +
  "focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/25 " +
  "aria-[invalid=true]:border-[#d70015] aria-[invalid=true]:focus:ring-[#d70015]/20";

export const labelClass = "block text-[13px] font-medium text-slate-800";

export const linkClass =
  "rounded text-[#0059b8] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[#0071e3]/50";

const buttonBase =
  "flex h-12 w-full items-center justify-center rounded-xl text-[16px] font-medium outline-none " +
  "transition duration-100 ease-out active:scale-[0.98] motion-reduce:active:scale-100";

// For links and buttons that sit beside the form's own submit button
export const primaryButtonClass =
  `${buttonBase} bg-[#0071e3] text-white hover:bg-[#0077ed] focus-visible:ring-4 focus-visible:ring-[#0071e3]/35`;

export const secondaryButtonClass =
  `${buttonBase} border border-black/15 bg-white text-slate-900 hover:bg-slate-50 focus-visible:ring-4 focus-visible:ring-[#0071e3]/35`;
