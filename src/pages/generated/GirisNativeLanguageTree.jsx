/* eslint-disable */

export default function GirisNativeLanguageTree({ translateText = (value) => value, languageLabel }) {
  return (
      <div className={"gra-lng-el-0 fixed border duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] start-1/2 top-1/2 z-[102] w-full -translate-x-1/2 -translate-y-1/2 rounded-none shadow-lg tablet:h-auto tablet:overflow-hidden tablet:rounded-2xl tablet:bg-white flex bg-white flex-col tablet:max-w-[720px] laptop:w-[calc(100vw-64px)] laptop:max-w-[1024px] h-[100%] tablet:max-h-[calc(100vh-64px)] overflow-y-auto"} data-el-id={"lng-el-0"} role={"dialog"} id={"radix-«r1a»"} aria-describedby={"radix-«r1c»"} aria-labelledby={"radix-«r1b»"} data-state={"open"} tabIndex={"-1"}>
        <div className={"gra-lng-el-1 sticky top-0 z-[102] flex w-full items-center justify-between px-5 pb-4 pt-5 transition-shadow duration-100 tablet:bg-white tablet:p-12 tablet:pt-6 bg-white tablet:pb-4"} data-el-id={"lng-el-1"}>
          <div className={"gra-lng-el-2"} data-el-id={"lng-el-2"}>
            <h2 className={"gra-lng-el-3 ease-linear text-[20px] font-semibold leading-[28px] opacity-0 transition-opacity duration-100"} data-el-id={"lng-el-3"}>
              {translateText("Change language")}
            </h2>
          </div>
          <button className={"gra-lng-el-4 group relative flex size-6 items-center justify-center"} data-el-id={"lng-el-4"} type={"button"}>
            <span className={"gra-lng-el-5 absolute inset-0 -left-3 -top-3 size-12 rounded-lg bg-transparent group-hover:bg-[rgba(13,22,25,0.04)] group-active:bg-[rgba(13,22,25,0.08)]"} data-el-id={"lng-el-5"}>
            </span>
            <div className={"gra-lng-el-6 size-6"} data-el-id={"lng-el-6"}>
              <svg className={"gra-lng-el-7"} data-el-id={"lng-el-7"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                <path className={"gra-lng-el-8"} data-el-id={"lng-el-8"} fillRule={"evenodd"} d={"M7.293 7.293a1 1 0 0 1 1.414 0L16 14.586l7.293-7.293a1 1 0 1 1 1.414 1.414L17.414 16l7.293 7.293a1 1 0 0 1-1.414 1.414L16 17.414l-7.293 7.293a1 1 0 0 1-1.414-1.414L14.586 16 7.293 8.707a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
              </svg>
            </div>
            <span className={"gra-lng-el-9 sr-only"} data-el-id={"lng-el-9"}>
              {translateText("Close")}
            </span>
          </button>
        </div>
        <div className={"gra-lng-el-10 overflow-scroll p-5 pt-0 flex flex-col grow tablet:p-12 tablet:pt-0"} data-el-id={"lng-el-10"}>
          <div className={"gra-lng-el-11 size-0"} data-el-id={"lng-el-11"}>
          </div>
          <h2 className={"gra-lng-el-12 flex tracking-tight pb-7 text-[28px] font-semibold leading-[36px]"} data-el-id={"lng-el-12"} id={"radix-«r1b»"}>
            {translateText("Change language")}
          </h2>
          <p className={"gra-lng-el-13 mb-4 text-[20px] font-semibold leading-[28px]"} data-el-id={"lng-el-13"}>
            {translateText("Suggested languages")}
          </p>
          <div className={"gra-lng-el-14 mb-8 grid grid-cols-2 gap-4 tablet:grid-cols-3 laptop:grid-cols-4"} data-el-id={"lng-el-14"}>
            <button className={"gra-lng-el-15 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-15"} type={"button"}>
              <span className={"gra-lng-el-16 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-16"}>
                {translateText("Deutsch")}
              </span>
              <span className={"gra-lng-el-17 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-17"}>
                {translateText("Deutschland")}
              </span>
            </button>
            <button className={"gra-lng-el-18 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted shadow-[0_0_0_2px_#6950f3]"} data-el-id={"lng-el-18"} type={"button"}>
              <span className={"gra-lng-el-19 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-19"}>
                {translateText("English")}
              </span>
            </button>
          </div>
          <p className={"gra-lng-el-20 mb-4 text-[20px] font-semibold leading-[28px]"} data-el-id={"lng-el-20"}>
            {translateText("All languages")}
          </p>
          <div className={"gra-lng-el-21 mb-8 grid grid-cols-2 gap-4 tablet:grid-cols-3 laptop:grid-cols-4"} data-el-id={"lng-el-21"}>
            <button className={"gra-lng-el-22 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-22"} type={"button"}>
              <span className={"gra-lng-el-23 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-23"}>
                {translateText("Bahasa Indonesia")}
              </span>
              <span className={"gra-lng-el-24 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-24"}>
                {translateText("Indonesia")}
              </span>
            </button>
            <button className={"gra-lng-el-25 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-25"} type={"button"}>
              <span className={"gra-lng-el-26 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-26"}>
                {translateText("Bahasa Melayu")}
              </span>
              <span className={"gra-lng-el-27 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-27"}>
                {translateText("Malaysia")}
              </span>
            </button>
            <button className={"gra-lng-el-28 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-28"} type={"button"}>
              <span className={"gra-lng-el-29 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-29"}>
                {translateText("čeština")}
              </span>
              <span className={"gra-lng-el-30 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-30"}>
                {translateText("Česká republika")}
              </span>
            </button>
            <button className={"gra-lng-el-31 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-31"} type={"button"}>
              <span className={"gra-lng-el-32 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-32"}>
                {translateText("dansk")}
              </span>
              <span className={"gra-lng-el-33 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-33"}>
                {translateText("Danmark")}
              </span>
            </button>
            <button className={"gra-lng-el-34 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-34"} type={"button"}>
              <span className={"gra-lng-el-35 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-35"}>
                {translateText("Deutsch")}
              </span>
              <span className={"gra-lng-el-36 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-36"}>
                {translateText("Deutschland")}
              </span>
            </button>
            <button className={"gra-lng-el-37 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted shadow-[0_0_0_2px_#6950f3]"} data-el-id={"lng-el-37"} type={"button"}>
              <span className={"gra-lng-el-38 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-38"}>
                {translateText("English")}
              </span>
            </button>
            <button className={"gra-lng-el-39 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-39"} type={"button"}>
              <span className={"gra-lng-el-40 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-40"}>
                {translateText("español")}
              </span>
              <span className={"gra-lng-el-41 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-41"}>
                {translateText("España")}
              </span>
            </button>
            <button className={"gra-lng-el-42 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-42"} type={"button"}>
              <span className={"gra-lng-el-43 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-43"}>
                {translateText("français")}
              </span>
              <span className={"gra-lng-el-44 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-44"}>
                {translateText("France")}
              </span>
            </button>
            <button className={"gra-lng-el-45 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-45"} type={"button"}>
              <span className={"gra-lng-el-46 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-46"}>
                {translateText("hrvatski")}
              </span>
              <span className={"gra-lng-el-47 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-47"}>
                {translateText("Hrvatska")}
              </span>
            </button>
            <button className={"gra-lng-el-48 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-48"} type={"button"}>
              <span className={"gra-lng-el-49 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-49"}>
                {translateText("italiano")}
              </span>
              <span className={"gra-lng-el-50 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-50"}>
                {translateText("Italia")}
              </span>
            </button>
            <button className={"gra-lng-el-51 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-51"} type={"button"}>
              <span className={"gra-lng-el-52 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-52"}>
                {translateText("lietuvių")}
              </span>
              <span className={"gra-lng-el-53 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-53"}>
                {translateText("Lietuva")}
              </span>
            </button>
            <button className={"gra-lng-el-54 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-54"} type={"button"}>
              <span className={"gra-lng-el-55 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-55"}>
                {translateText("magyar")}
              </span>
              <span className={"gra-lng-el-56 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-56"}>
                {translateText("Magyarország")}
              </span>
            </button>
            <button className={"gra-lng-el-57 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-57"} type={"button"}>
              <span className={"gra-lng-el-58 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-58"}>
                {translateText("Nederlands")}
              </span>
              <span className={"gra-lng-el-59 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-59"}>
                {translateText("Nederland")}
              </span>
            </button>
            <button className={"gra-lng-el-60 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-60"} type={"button"}>
              <span className={"gra-lng-el-61 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-61"}>
                {translateText("norsk bokmål")}
              </span>
              <span className={"gra-lng-el-62 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-62"}>
                {translateText("Norge")}
              </span>
            </button>
            <button className={"gra-lng-el-63 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-63"} type={"button"}>
              <span className={"gra-lng-el-64 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-64"}>
                {translateText("polski")}
              </span>
              <span className={"gra-lng-el-65 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-65"}>
                {translateText("Polska")}
              </span>
            </button>
            <button className={"gra-lng-el-66 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-66"} type={"button"}>
              <span className={"gra-lng-el-67 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-67"}>
                {translateText("Português")}
              </span>
              <span className={"gra-lng-el-68 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-68"}>
                {translateText("Brasil")}
              </span>
            </button>
            <button className={"gra-lng-el-69 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-69"} type={"button"}>
              <span className={"gra-lng-el-70 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-70"}>
                {translateText("română")}
              </span>
              <span className={"gra-lng-el-71 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-71"}>
                {translateText("România")}
              </span>
            </button>
            <button className={"gra-lng-el-72 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-72"} type={"button"}>
              <span className={"gra-lng-el-73 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-73"}>
                {translateText("slovenščina")}
              </span>
              <span className={"gra-lng-el-74 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-74"}>
                {translateText("Slovenija")}
              </span>
            </button>
            <button className={"gra-lng-el-75 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-75"} type={"button"}>
              <span className={"gra-lng-el-76 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-76"}>
                {translateText("suomi")}
              </span>
              <span className={"gra-lng-el-77 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-77"}>
                {translateText("Suomi")}
              </span>
            </button>
            <button className={"gra-lng-el-78 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-78"} type={"button"}>
              <span className={"gra-lng-el-79 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-79"}>
                {translateText("svenska")}
              </span>
              <span className={"gra-lng-el-80 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-80"}>
                {translateText("Sverige")}
              </span>
            </button>
            <button className={"gra-lng-el-81 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-81"} type={"button"}>
              <span className={"gra-lng-el-82 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-82"}>
                {translateText("Tiếng Việt")}
              </span>
              <span className={"gra-lng-el-83 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-83"}>
                {translateText("Việt Nam")}
              </span>
            </button>
            <button className={"gra-lng-el-84 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-84"} type={"button"}>
              <span className={"gra-lng-el-85 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-85"}>
                {translateText("Ελληνικά")}
              </span>
              <span className={"gra-lng-el-86 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-86"}>
                {translateText("Ελλάδα")}
              </span>
            </button>
            <button className={"gra-lng-el-87 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-87"} type={"button"}>
              <span className={"gra-lng-el-88 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-88"}>
                {translateText("български")}
              </span>
              <span className={"gra-lng-el-89 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-89"}>
                {translateText("България")}
              </span>
            </button>
            <button className={"gra-lng-el-90 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-90"} type={"button"}>
              <span className={"gra-lng-el-91 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-91"}>
                {translateText("русский")}
              </span>
              <span className={"gra-lng-el-92 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-92"}>
                {translateText("Россия")}
              </span>
            </button>
            <button className={"gra-lng-el-93 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-93"} type={"button"}>
              <span className={"gra-lng-el-94 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-94"}>
                {translateText("українська")}
              </span>
              <span className={"gra-lng-el-95 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-95"}>
                {translateText("Україна")}
              </span>
            </button>
            <button className={"gra-lng-el-96 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-96"} type={"button"}>
              <span className={"gra-lng-el-97 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-97"}>
                {translateText("العربية")}
              </span>
            </button>
            <button className={"gra-lng-el-98 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-98"} type={"button"}>
              <span className={"gra-lng-el-99 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-99"}>
                {translateText("ไทย")}
              </span>
              <span className={"gra-lng-el-100 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-100"}>
                {translateText("ประเทศไทย")}
              </span>
            </button>
            <button className={"gra-lng-el-101 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-101"} type={"button"}>
              <span className={"gra-lng-el-102 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-102"}>
                {translateText("中文")}
              </span>
              <span className={"gra-lng-el-103 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-103"}>
                {translateText("中国")}
              </span>
            </button>
            <button className={"gra-lng-el-104 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-104"} type={"button"}>
              <span className={"gra-lng-el-105 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-105"}>
                {translateText("中文")}
              </span>
              <span className={"gra-lng-el-106 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-106"}>
                {translateText("香港")}
              </span>
            </button>
            <button className={"gra-lng-el-107 flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted"} data-el-id={"lng-el-107"} type={"button"}>
              <span className={"gra-lng-el-108 text-[17px] font-semibold leading-[24px]"} data-el-id={"lng-el-108"}>
                {translateText("日本語")}
              </span>
              <span className={"gra-lng-el-109 text-[17px] leading-[24px] text-neutral-fadedForeground"} data-el-id={"lng-el-109"}>
                {translateText("日本")}
              </span>
            </button>
          </div>
        </div>
      </div>
  );
}
