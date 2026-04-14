/* eslint-disable */

export default function GirisNativeHeaderTree({ translateText = (value) => value, languageLabel }) {
  return (
      <nav className={"gra-hdr-el-0 mx-auto max-w-screen-desktop px-5 py-3 tablet:h-[72px] laptop:px-8 grid grid-cols-2 items-center gap-3 laptop:grid-cols-[minmax(80px,120px),minmax(380px,auto),minmax(auto,280px)]"} data-el-id={"hdr-el-0"}>
        <a className={"gra-hdr-el-1"} data-el-id={"hdr-el-1"} href={"https://www.fresha.com/"} aria-label={translateText("Fresha homepage")}>
          <div className={"gra-hdr-el-2 transition-colors duration-300 ease-in-out"} data-el-id={"hdr-el-2"}>
            <div className={"gra-hdr-el-3"} data-el-id={"hdr-el-3"}>
              <svg className={"gra-hdr-el-4 h-auto fill-current text-foreground w-[75px]"} data-el-id={"hdr-el-4"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 81.8 24"} pointerEvents={"none"}>
                <title className={"gra-hdr-el-5"} data-el-id={"hdr-el-5"}>
                  {translateText("Fresha")}
                </title>
                <path className={"gra-hdr-el-6"} data-el-id={"hdr-el-6"} d={"M51.5 2.1h3.9v8.1c1.3-1.9 4-2.5 6.2-1.6 2.2.9 2.9 2.5 3 2.7.2.5.4 1 .5 1.5.6 3.6-.6 7.2.5 10.7h-3.8c-1-2.5-.4-5.3-.4-7.9 0-.7 0-1.5-.4-2.2-.5-.9-1.5-1.6-2.5-1.6-1.1 0-2.1.6-2.6 1.5-.4.8-.4 1.8-.4 2.7v7.5h-3.9l-.1-21.4zM36 15.7c.1-4.3-2.6-7.5-6.8-7.5-2.8 0-5.2 1.4-6.5 3.8-1.4 2.6-1.3 6.3.4 8.8 2.5 3.4 7.6 4.2 12.5 1.9l-1.2-3.1c-4.1 1.8-8.5 1.3-8.8-2.4H36v-1.5zm-10.3-1.5c.3-.8.7-1.4 1.3-1.9 1.2-.9 3.3-1 4.4-.1.5.4.9 1.1 1.2 1.9h-6.9zM13.1 13.9s0-2.3-1.9-2.3H6.9v12.1H3V11.6H0V8.3h3V5.7C3 3.4 5.1 0 9.7 0s6.4 3.9 6.4 3.9l-3 2.1s-.8-2.5-3.3-2.5C8.7 3.5 7 4.4 7 6.2v2h6.1c2.7 0 3.4 2 3.4 2 1-2.4 4.6-2.1 5.3-2v3.1c-2.5-.2-4.8 1.2-4.8 4.1v8h-3.9v-9.5zM48.9 16.2c-1.2-1.2-4.3-1.6-6.3-2-1-.2-1.8-.4-1.8-1.4 0-1.2 1.2-1.5 2.4-1.5s2.4.5 3.1 1.5l3-1.6c-1.7-3-6.2-3.6-9.1-2.4-.9.4-1.6 1-2.1 1.7-1.1 1.5-1 4.1.3 5.3.7.7 1.9 1.2 3.4 1.5l2.8.5c1 .2 1.9.4 1.9 1.5 0 1.3-1.4 1.6-2.6 1.6-3.2 0-3.8-3-3.8-3L36.4 19c.2 1 1.5 5 7.4 5 3.3 0 6.2-1.3 6.3-4.8-.1-1.3-.5-2.3-1.2-3zM81.2 20.8c-.7 0-1.3-.4-1.3-1.4 0-.5-.1-2.2-.1-2.6 0-2.6.1-5.1-1.7-6.9-2-2-6.6-2.2-9-.6-.9.5-1.7 1.2-2.3 2.1l2.3 2.4c.9-1.5 2.2-2.2 3.7-2.2 1.4-.1 2.6.6 3.1 2-3.1.8-7.1 1.1-8.8 4.3-.8 1.5-.6 3.4.6 4.7.9 1 2.4 1.3 3.8 1.3 2.2 0 4.3-.5 5.6-2.5.7 1.7 2.2 2.5 4 2.5.3 0 .6-.1.8-.2v-3c-.2.1-.4.1-.7.1zm-5.3-3.1c.1 2.2-1.7 3.4-3.7 3.4-1.1 0-1.8-.5-1.8-1.6 0-1.2 1-1.6 2.1-1.9l3.4-1v1.1z"} />
              </svg>
            </div>
          </div>
        </a>
        <ul className={"gra-hdr-el-7 hidden list-none laptop:flex"} data-el-id={"hdr-el-7"}>
          <li className={"gra-hdr-el-8 relative"} data-el-id={"hdr-el-8"}>
            <div className={"gra-hdr-el-9 group relative"} data-el-id={"hdr-el-9"}>
              <button className={"gra-hdr-el-10 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-none text-primary hover:text-accent rounded-full px-5 h-12 cursor-pointer font-semibold transition-colors duration-150 group-hover:text-accent"} data-el-id={"hdr-el-10"} aria-haspopup={"true"} aria-expanded={"false"} type={"button"}>
                {translateText("Business types")}
              </button>
              <div className={"gra-hdr-el-11 absolute left-4 top-full z-50 rounded-[24px] shadow-[0px_8px_32px_0px_rgba(13,22,25,0.16)] bg-white transition-all duration-200 ease-in-out animate-[fade-out_200ms_ease-in-out] invisible opacity-0 max-w-[760px] p-6 px-8 laptop:p-10 desktop:max-w-[900px]"} data-el-id={"hdr-el-11"} role={"menu"} tabIndex={"0"}>
              </div>
            </div>
          </li>
          <li className={"gra-hdr-el-12 relative"} data-el-id={"hdr-el-12"}>
            <div className={"gra-hdr-el-13 group relative"} data-el-id={"hdr-el-13"}>
              <button className={"gra-hdr-el-14 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-none text-primary hover:text-accent rounded-full h-12 cursor-pointer font-semibold transition-colors duration-150 group-hover:text-accent px-6"} data-el-id={"hdr-el-14"} aria-haspopup={"true"} aria-expanded={"false"} type={"button"}>
                {translateText("Features")}
              </button>
              <div className={"gra-hdr-el-15 absolute left-4 top-full z-50 rounded-[24px] shadow-[0px_8px_32px_0px_rgba(13,22,25,0.16)] bg-white transition-all duration-200 ease-in-out animate-[fade-out_200ms_ease-in-out] invisible opacity-0 max-w-[760px] p-6 px-8 laptop:p-10 desktop:max-w-[900px] min-w-[336px]"} data-el-id={"hdr-el-15"} role={"menu"} tabIndex={"0"}>
              </div>
            </div>
          </li>
          <li className={"gra-hdr-el-16"} data-el-id={"hdr-el-16"}>
            <a className={"gra-hdr-el-17 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-none text-primary hover:text-accent rounded-full px-5 h-12 font-semibold transition-colors duration-300 ease-in-out"} data-el-id={"hdr-el-17"} data-qa={"nav-pricing-link"} type={"button"} href={"https://www.fresha.com/pricing"}>
              {translateText("Pricing")}
            </a>
          </li>
        </ul>
        <div className={"gra-hdr-el-18 hidden justify-end items-center gap-4 laptop:flex"} data-el-id={"hdr-el-18"}>
          <a className={"gra-hdr-el-19 typography-body-m-semibold text-nowrap items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full px-5 h-12 hidden cursor-pointer large:flex transition-colors duration-300 ease-in-out border border-solid flex shrink-0 gap-2 font-semibold leading-5"} data-el-id={"hdr-el-19"} href={"https://www.fresha.com/"} type={"button"}>
            <div className={"gra-hdr-el-20 size-6 transition-colors duration-300 ease-in-out"} data-el-id={"hdr-el-20"}>
              <svg className={"gra-hdr-el-21"} data-el-id={"hdr-el-21"} xmlns={"http://www.w3.org/2000/svg"} width={"24"} height={"24"} viewBox={"0 0 24 24"} fill={"none"}>
                <path className={"gra-hdr-el-22"} data-el-id={"hdr-el-22"} fillRule={"evenodd"} clipRule={"evenodd"} d={"M5.05681 3.00003L18.9442 3C19.2676 3.00267 19.5815 3.10915 19.8399 3.30373C20.0982 3.49831 20.2872 3.77072 20.379 4.08082L21.7218 8.79453C21.7408 8.86136 21.7505 8.93051 21.7505 9V10.5C21.7505 11.4946 21.3554 12.4484 20.6521 13.1517C20.5259 13.2779 20.3916 13.3942 20.2505 13.5V19.5C20.2505 19.8978 20.0925 20.2794 19.8111 20.5607C19.5298 20.842 19.1483 21 18.7505 21H5.25049C4.85266 21 4.47113 20.842 4.18983 20.5607C3.90852 20.2794 3.75049 19.8978 3.75049 19.5V13.5C3.60934 13.3942 3.47505 13.2779 3.34884 13.1517C2.64558 12.4484 2.25049 11.4946 2.25049 10.5V9C2.25049 8.93051 2.26015 8.86136 2.27918 8.79453L3.62194 4.0808C3.71376 3.77071 3.90279 3.49831 4.16111 3.30373C4.41943 3.10915 4.73342 3.00269 5.05681 3.00003ZM4.96096 12.4955C4.9075 12.4538 4.84826 12.4193 4.78463 12.3932C4.65016 12.3069 4.52427 12.2058 4.4095 12.091C3.98754 11.669 3.75049 11.0967 3.75049 10.5V9.75H8.25049V10.5C8.25049 11.0967 8.01344 11.669 7.59148 12.091C7.16952 12.513 6.59723 12.75 6.00049 12.75C5.63519 12.75 5.27906 12.6612 4.96096 12.4955ZM5.25049 14.1743V19.5H18.7505V14.1743C18.5055 14.2243 18.2543 14.25 18.0005 14.25C17.0059 14.25 16.0521 13.8549 15.3488 13.1517C15.2226 13.0254 15.1063 12.8912 15.0005 12.75C14.8946 12.8912 14.7783 13.0254 14.6521 13.1517C13.9489 13.8549 12.9951 14.25 12.0005 14.25C11.0059 14.25 10.0521 13.8549 9.34884 13.1517C9.22263 13.0254 9.10634 12.8912 9.00049 12.75C8.89463 12.8912 8.77835 13.0254 8.65214 13.1517C7.94888 13.8549 6.99505 14.25 6.00049 14.25C5.74667 14.25 5.49551 14.2243 5.25049 14.1743ZM9.75049 10.5C9.75049 11.0967 9.98754 11.669 10.4095 12.091C10.8315 12.513 11.4038 12.75 12.0005 12.75C12.5972 12.75 13.1695 12.513 13.5915 12.091C14.0134 11.669 14.2505 11.0967 14.2505 10.5V9.75H9.75049V10.5ZM20.007 8.25L18.9405 4.50595L5.06855 4.5L3.99397 8.25H20.007ZM20.2505 9.75H15.7505V10.5C15.7505 11.0967 15.9875 11.669 16.4095 12.091C16.8315 12.513 17.4038 12.75 18.0005 12.75C18.3658 12.75 18.7219 12.6612 19.04 12.4955C19.0935 12.4538 19.1527 12.4193 19.2163 12.3932C19.3508 12.3069 19.4767 12.2058 19.5915 12.091C20.0134 11.669 20.2505 11.0967 20.2505 10.5V9.75Z"} fill={"#0D1619"} />
              </svg>
            </div>
            <span className={"gra-hdr-el-23"} data-el-id={"hdr-el-23"}>
              {translateText("Marketplace")}
            </span>
          </a>
          <a className={"gra-hdr-el-24 typography-body-m-semibold text-nowrap items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-primary text-primary-foreground hover:bg-primary-hover active:scale-active rounded-full px-5 flex h-10 laptop:h-12 tablet:font-semibold tablet:typography-body-m-semibold leading-5 transition-colors duration-300 ease-in-out border border-transparent"} data-el-id={"hdr-el-24"} type={"button"} href={"https://partners.fresha.com/users/sign-in?lang=en-US&from=fresha"}>
            {translateText("Sign up")}
          </a>
          <div className={"gra-hdr-el-25"} data-el-id={"hdr-el-25"} type={"button"} id={"radix-«r0»"} aria-haspopup={"menu"} aria-expanded={"false"} data-state={"closed"}>
            <button className={"gra-hdr-el-26 typography-body-m-semibold text-nowrap items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none transition-transform duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full hidden h-10 p-0 px-3 font-semibold tablet:flex laptop:h-12 laptop:px-5"} data-el-id={"hdr-el-26"} type={"button"}>
              {translateText("Menu")}
              <div className={"gra-hdr-el-27 size-6 ml-2"} data-el-id={"hdr-el-27"}>
                <svg className={"gra-hdr-el-28"} data-el-id={"hdr-el-28"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                  <path className={"gra-hdr-el-29"} data-el-id={"hdr-el-29"} fillRule={"evenodd"} d={"M4 8a1 1 0 0 1 1-1h22a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1m0 8a1 1 0 0 1 1-1h22a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1m0 8a1 1 0 0 1 1-1h22a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1"} clipRule={"evenodd"} />
                </svg>
              </div>
            </button>
          </div>
        </div>
        <div className={"gra-hdr-el-30 flex items-center justify-end laptop:hidden sf-hidden"} data-el-id={"hdr-el-30"}>
        </div>
      </nav>
  );
}
