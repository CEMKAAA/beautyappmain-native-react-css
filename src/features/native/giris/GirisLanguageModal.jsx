import { GIRIS_LANGUAGE_OPTIONS, GIRIS_SUGGESTED_LANGUAGE_CODES } from './girisNativeData';

function CloseIcon() {
  return (
    <svg className="gra-lng-el-7" data-el-id="lng-el-7" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <path
        className="gra-lng-el-8"
        data-el-id="lng-el-8"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.293 7.293a1 1 0 0 1 1.414 0L16 14.586l7.293-7.293a1 1 0 1 1 1.414 1.414L17.414 16l7.293 7.293a1 1 0 0 1-1.414 1.414L16 17.414l-7.293 7.293a1 1 0 0 1-1.414-1.414L14.586 16 7.293 8.707a1 1 0 0 1 0-1.414"
      />
    </svg>
  );
}

function LanguageOption({ option, isSelected, dataElId, labelElId, regionElId, onSelect }) {
  return (
    <button
      className={`gra-${dataElId} flex h-[72px] flex-col items-start rounded-lg border border-solid border-neutral-faded hover:border-neutral-fadedHover active:border-neutral-fadedActive bg-white p-3 hover:bg-muted${isSelected ? ' shadow-[0_0_0_2px_#6950f3]' : ''}`}
      data-el-id={dataElId}
      type="button"
      onClick={() => onSelect(option.code)}
    >
      <span className={`gra-${labelElId} text-[17px] font-semibold leading-[24px]`} data-el-id={labelElId}>
        {option.label}
      </span>
      {option.region ? (
        <span className={`gra-${regionElId} text-[17px] leading-[24px] text-neutral-fadedForeground`} data-el-id={regionElId}>
          {option.region}
        </span>
      ) : null}
    </button>
  );
}

export default function GirisLanguageModal({ activeLanguageCode, onClose, onSelectLanguage }) {
  const suggestedLanguages = GIRIS_LANGUAGE_OPTIONS.filter((option) =>
    GIRIS_SUGGESTED_LANGUAGE_CODES.includes(option.code),
  );

  const allLanguages = GIRIS_LANGUAGE_OPTIONS.filter(
    (option) => !GIRIS_SUGGESTED_LANGUAGE_CODES.includes(option.code),
  );

  return (
    <div className="gra-lng-el-0 fixed border start-1/2 top-1/2 z-[102] w-full -translate-x-1/2 -translate-y-1/2 rounded-none shadow-lg tablet:h-auto tablet:overflow-hidden tablet:rounded-2xl tablet:bg-white flex bg-white flex-col tablet:max-w-[720px] laptop:w-[calc(100vw-64px)] laptop:max-w-[1024px] h-[100%] tablet:max-h-[calc(100vh-64px)] overflow-y-auto" data-el-id="lng-el-0" role="dialog" tabIndex="-1">
      <div className="gra-lng-el-1 sticky top-0 z-[102] flex w-full items-center justify-between px-5 pb-4 pt-5 transition-shadow duration-100 tablet:bg-white tablet:p-12 tablet:pt-6 bg-white tablet:pb-4" data-el-id="lng-el-1">
        <div className="gra-lng-el-2" data-el-id="lng-el-2">
          <h2 className="gra-lng-el-3 ease-linear text-[20px] font-semibold leading-[28px] opacity-0 transition-opacity duration-100" data-el-id="lng-el-3">
            Change language
          </h2>
        </div>
        <button className="gra-lng-el-4 group relative flex size-6 items-center justify-center" data-el-id="lng-el-4" type="button" onClick={onClose}>
          <span className="gra-lng-el-5 absolute inset-0 -left-3 -top-3 size-12 rounded-lg bg-transparent group-hover:bg-[rgba(13,22,25,0.04)] group-active:bg-[rgba(13,22,25,0.08)]" data-el-id="lng-el-5" />
          <div className="gra-lng-el-6 size-6" data-el-id="lng-el-6">
            <CloseIcon />
          </div>
          <span className="gra-lng-el-9 sr-only" data-el-id="lng-el-9">Close</span>
        </button>
      </div>

      <div className="gra-lng-el-10 overflow-scroll p-5 pt-0 flex flex-col grow tablet:p-12 tablet:pt-0" data-el-id="lng-el-10">
        <div className="gra-lng-el-11 size-0" data-el-id="lng-el-11" />
        <h2 className="gra-lng-el-12 flex tracking-tight pb-7 text-[28px] font-semibold leading-[36px]" data-el-id="lng-el-12">
          Change language
        </h2>
        <p className="gra-lng-el-13 mb-4 text-[20px] font-semibold leading-[28px]" data-el-id="lng-el-13">
          Suggested languages
        </p>

        <div className="gra-lng-el-14 mb-8 grid grid-cols-2 gap-4 tablet:grid-cols-3 laptop:grid-cols-4" data-el-id="lng-el-14">
          {suggestedLanguages.map((option, index) => (
            <LanguageOption
              key={option.code}
              option={option}
              isSelected={option.code === activeLanguageCode}
              dataElId={`lng-el-${15 + index * 3}`}
              labelElId={`lng-el-${16 + index * 3}`}
              regionElId={`lng-el-${17 + index * 3}`}
              onSelect={onSelectLanguage}
            />
          ))}
        </div>

        <p className="gra-lng-el-20 mb-4 text-[20px] font-semibold leading-[28px]" data-el-id="lng-el-20">
          All languages
        </p>

        <div className="gra-lng-el-21 mb-8 grid grid-cols-2 gap-4 tablet:grid-cols-3 laptop:grid-cols-4" data-el-id="lng-el-21">
          {allLanguages.map((option, index) => {
            const baseId = 22 + index * 3;
            return (
              <LanguageOption
                key={option.code}
                option={option}
                isSelected={option.code === activeLanguageCode}
                dataElId={`lng-el-${baseId}`}
                labelElId={`lng-el-${baseId + 1}`}
                regionElId={`lng-el-${baseId + 2}`}
                onSelect={onSelectLanguage}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
