import { GIRIS_MENU_BUSINESS_ITEMS } from './girisNativeData';

function GlobeIcon() {
  return (
    <svg className="gra-mnu-el-17" data-el-id="mnu-el-17" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path
        className="gra-mnu-el-18"
        data-el-id="mnu-el-18"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.429 3.457C24.944 4.96 29 10.007 29 16c0 2.022-.462 3.937-1.285 5.643a1 1 0 0 1-.088.18l-.006.01c-2.084 4.144-6.319 7.02-11.238 7.161a1 1 0 0 1-.169.004L16 29C8.82 29 3 23.18 3 16S8.82 3 16 3c1.105 0 2.177.138 3.201.397q.117.017.227.06M5 16c0-1.786.426-3.473 1.181-4.965l1.305 3.471a1.99 1.99 0 0 0 1.454 1.272l2.675.574.471.981.009.018a2.03 2.03 0 0 0 1.778 1.111h.163l-.96 2.154a2 2 0 0 0 .35 2.173l2.352 2.544-.322 1.654C9.633 26.703 5 21.893 5 16m2.923-6.016L8.956 7.55A10.96 10.96 0 0 1 16 5c.826 0 1.63.091 2.404.264l.944 1.709-3.356 3.035-1.55.854h-2.655a2.012 2.012 0 0 0-1.844 1.218l-.651 1.547zm4.107 4.412-.818-.176.58-1.358h2.697c.303 0 .634-.091.917-.241l1.552-.858a2 2 0 0 0 .383-.279l3.365-3.04a2.01 2.01 0 0 0 .536-2.117A11 11 0 0 1 27 16c0 1.35-.244 2.645-.689 3.84l-5.792-3.563a1.9 1.9 0 0 0-.794-.282l-2.85-.386a1.98 1.98 0 0 0-1.915.853l-1.071-.003-.473-.975a1.99 1.99 0 0 0-1.386-1.088m13.409 7.256a11 11 0 0 1-7.927 5.245l.232-1.179a2.025 2.025 0 0 0-.491-1.741l-2.354-2.54 1.715-3.845 2.853.387z"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="gra-mnu-el-27" data-el-id="mnu-el-27" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path
        className="gra-mnu-el-28"
        data-el-id="mnu-el-28"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"
      />
    </svg>
  );
}

export default function GirisHeaderMenu({ languageLabel, onAuth, onHome, onDownload, onOpenLanguage }) {
  const handleBusinessItemClick = (item) => {
    if (item.action === 'auth') {
      onAuth();
      return;
    }

    if (item.action === 'home') {
      onHome();
      return;
    }

    if (item.action === 'download') {
      onDownload();
    }
  };

  return (
    <div
      className="gra-mnu-el-0 min-w-32 max-w-[238px] overflow-hidden border bg-popover p-2 text-popover-foreground shadow-lg relative top-0 w-[240px] z-[101] rounded-xl"
      data-el-id="mnu-el-0"
      role="menu"
      aria-orientation="vertical"
      tabIndex="-1"
    >
      <div className="gra-mnu-el-1 px-3" data-el-id="mnu-el-1" role="group">
        <div className="gra-mnu-el-2 px-3 py-1.5 text-sm font-semibold pb-2 -mx-3" data-el-id="mnu-el-2">
          <span className="gra-mnu-el-3 text-[17px] leading-[24px]" data-el-id="mnu-el-3">
            For businesses
          </span>
        </div>

        {GIRIS_MENU_BUSINESS_ITEMS.map((item, index) => {
          const itemId = `mnu-el-${index === 0 ? 4 : index * 2 + 4}`;
          const textId = `mnu-el-${index === 0 ? 5 : index * 2 + 5}`;
          const className = item.accent
            ? 'gra-mnu-el-4 relative flex min-h-[48px] desktop:min-h-[40px] rounded-lg text-left transition-colors duration-200 ease-in-out typography-body-s-medium items-center gap-2 py-2 px-3 -mx-3 w-[calc(100%+1.5rem)] text-accent'
            : `gra-${itemId} relative flex min-h-[48px] desktop:min-h-[40px] rounded-lg text-left transition-[background-color] duration-200 ease-in-out typography-body-s-medium items-center typography-link-s-medium gap-2 py-2 px-3 -mx-3 w-[calc(100%+1.5rem)] text-primary`;

          if (item.href) {
            return (
              <a className={className} data-el-id={itemId} href={item.href} key={item.key}>
                <div className={textId === 'mnu-el-7' ? 'gra-mnu-el-7 overflow-hidden w-full self-center' : `gra-${textId} overflow-hidden w-full self-center`} data-el-id={textId}>
                  {item.label}
                </div>
              </a>
            );
          }

          return (
            <button
              className={className}
              data-el-id={itemId}
              key={item.key}
              onClick={() => handleBusinessItemClick(item)}
              type="button"
            >
              {item.accent ? (
                <span className="gra-mnu-el-5 flex w-full" data-el-id="mnu-el-5">{item.label}</span>
              ) : (
                <div className={textId === 'mnu-el-7' ? 'gra-mnu-el-7 overflow-hidden w-full self-center' : `gra-${textId} overflow-hidden w-full self-center`} data-el-id={textId}>
                  {item.label}
                </div>
              )}
            </button>
          );
        })}

        <button
          className="gra-mnu-el-14 relative flex min-h-[48px] desktop:min-h-[40px] rounded-lg text-left transition-[background-color] duration-200 ease-in-out typography-body-s-medium items-center button gap-2 py-2 px-3 -mx-3 w-[calc(100%+1.5rem)] text-primary disabled:opacity-50 disabled:pointer-events-none"
          data-el-id="mnu-el-14"
          type="button"
          onClick={onOpenLanguage}
        >
          <span className="gra-mnu-el-15 shrink-0 size-6 desktop:size-5" data-el-id="mnu-el-15">
            <div className="gra-mnu-el-16" data-el-id="mnu-el-16">
              <GlobeIcon />
            </div>
          </span>
          <div className="gra-mnu-el-19 overflow-hidden w-full self-center" data-el-id="mnu-el-19">
            {languageLabel}
          </div>
        </button>
      </div>

      <div className="gra-mnu-el-20 m-2 h-px bg-neutral-faded" data-el-id="mnu-el-20" role="separator" aria-orientation="horizontal" />

      <div className="gra-mnu-el-21 px-3" data-el-id="mnu-el-21" role="group">
        <button
          className="gra-mnu-el-22 relative flex min-h-[48px] desktop:min-h-[40px] rounded-lg text-left transition-[background-color] duration-200 ease-in-out typography-body-s-medium items-center typography-link-s-medium gap-2 py-2 px-3 -mx-3 w-[calc(100%+1.5rem)] text-primary"
          data-el-id="mnu-el-22"
          type="button"
          onClick={onHome}
        >
          <div className="gra-mnu-el-23 overflow-hidden w-full self-center" data-el-id="mnu-el-23">
            <span className="gra-mnu-el-24 typography-body-s-semibold" data-el-id="mnu-el-24">
              For customers
            </span>
          </div>
          <span className="gra-mnu-el-25 shrink-0 size-6 desktop:size-5" data-el-id="mnu-el-25">
            <div className="gra-mnu-el-26 rotate-0 size-5" data-el-id="mnu-el-26">
              <ArrowRightIcon />
            </div>
          </span>
        </button>
      </div>
    </div>
  );
}
