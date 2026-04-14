/* eslint-disable */

import { useState } from 'react';

const GIRIS_FAQ_ITEMS = [
  {
    containerId: 'el-1189',
    buttonId: 'el-1190',
    titleId: 'el-1191',
    iconWrapId: 'el-1192',
    iconSvgId: 'el-1193',
    iconPathId: 'el-1194',
    answerWrapId: 'el-1195',
    answerInnerId: 'el-1196',
    answerTextId: 'el-1197',
    question: 'What makes Fresha the leading platform for businesses in beauty and wellness?',
    answer: [
      "With our global marketplace, we connect your business to millions of potential customers, providing unmatched opportunities for growth, making us the number one platform in beauty and wellness.",
      "We're the world's largest booking platform for beauty and wellness, trusted by over 130,000 businesses for their operations.",
      "Businesses choose us because of our powerful, easy-to-use features, including online booking, payment processing, marketing tools, and team management. Our automation simplifies daily tasks, saves time, and enhances efficiency, so you can focus on what matters most.",
    ],
  },
  {
    containerId: 'el-1200',
    buttonId: 'el-1201',
    titleId: 'el-1202',
    iconWrapId: 'el-1203',
    iconSvgId: 'el-1204',
    iconPathId: 'el-1205',
    answerWrapId: 'el-1206',
    answerInnerId: 'el-1207',
    answerTextId: 'el-1208',
    question: 'How does Fresha help my business grow?',
    answer: [
      'We help your business grow by providing powerful tools to attract new clients, retain existing ones, and streamline your operations. With our global marketplace, you can reach millions of potential customers searching for beauty and wellness services. Marketing tools like automated campaigns and client engagement features help turn bookings into long-term growth.',
    ],
  },
  {
    containerId: 'el-1209',
    buttonId: 'el-1210',
    titleId: 'el-1211',
    iconWrapId: 'el-1212',
    iconSvgId: 'el-1213',
    iconPathId: 'el-1214',
    answerWrapId: 'el-1215',
    answerInnerId: 'el-1216',
    answerTextId: 'el-1217',
    question: 'Are there any hidden costs?',
    answer: [
      "We don't charge any hidden costs. Powerful features are included in our core offering, and we offer optional add-ons, such as online payment processing and marketing tools, where you only pay for what you use. We're transparent about our pricing, with all details clearly outlined on our pricing page.",
    ],
  },
  {
    containerId: 'el-1218',
    buttonId: 'el-1219',
    titleId: 'el-1220',
    iconWrapId: 'el-1221',
    iconSvgId: 'el-1222',
    iconPathId: 'el-1223',
    answerWrapId: 'el-1224',
    answerInnerId: 'el-1225',
    answerTextId: 'el-1226',
    question: 'Is there a minimum commitment or contract?',
    answer: [
      "No, there's no minimum commitment or long-term contract. We offer a flexible monthly subscription model that you can cancel at any time. Plus, businesses with teams can take advantage of a 7-day free trial with no credit card required to explore the system and see if it's the right fit.",
    ],
  },
  {
    containerId: 'el-1227',
    buttonId: 'el-1228',
    titleId: 'el-1229',
    iconWrapId: 'el-1230',
    iconSvgId: 'el-1231',
    iconPathId: 'el-1232',
    answerWrapId: 'el-1233',
    answerInnerId: 'el-1234',
    answerTextId: 'el-1235',
    question: 'Does Fresha support businesses of all sizes?',
    answer: [
      "Yes, we're designed to support businesses of all sizes, from independent professionals to larger teams and enterprise businesses with multiple locations. Whether you're a solo entrepreneur or managing a growing team, we offer flexible tools and features to suit your needs, including calendar management, payments, marketing, and reporting.",
    ],
  },
  {
    containerId: 'el-1236',
    buttonId: 'el-1237',
    titleId: 'el-1238',
    iconWrapId: 'el-1239',
    iconSvgId: 'el-1240',
    iconPathId: 'el-1241',
    answerWrapId: 'el-1242',
    answerInnerId: 'el-1243',
    answerTextId: 'el-1244',
    question: 'What types of businesses can use Fresha?',
    answer: [
      "We're designed for a wide range of businesses in the beauty, wellness, and healthcare industries. Hair salons, spas, nail salons, barbershops, medspas, and massage therapists can all use Fresha to manage bookings, client information, and payments. It's also a great tool for other appointment-based businesses that need a polished booking and operations platform.",
    ],
  },
  {
    containerId: 'el-1245',
    buttonId: 'el-1246',
    titleId: 'el-1247',
    iconWrapId: 'el-1248',
    iconSvgId: 'el-1249',
    iconPathId: 'el-1250',
    answerWrapId: 'el-1251',
    answerInnerId: 'el-1252',
    answerTextId: 'el-1253',
    question: 'How can Fresha help reduce no-shows?',
    answer: [
      'We help reduce no-shows by offering several key features designed to improve client engagement and accountability. We send automated booking reminders via email and text, and we also allow businesses to implement flexible cancellation policies and upfront deposits or payments where needed.',
    ],
  },
  {
    containerId: 'el-1254',
    buttonId: 'el-1255',
    titleId: 'el-1256',
    iconWrapId: 'el-1257',
    iconSvgId: 'el-1258',
    iconPathId: 'el-1259',
    answerWrapId: 'el-1260',
    answerInnerId: 'el-1261',
    answerTextId: 'el-1262',
    question: 'Can I migrate my data from my previous system to Fresha?',
    answer: [
      'Yes, you can migrate data from your old system to Fresha. We support importing key information, such as client details and product inventory. For larger partners with more complex needs, we also offer paid packages that provide additional data migration support.',
    ],
  },
];

export default function GirisBossSection({ translateText = (value) => value }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex((current) => (current === index ? -1 : index));
  };

  return (
    <>
        <div className={"gra-el-1068 pb-[64px] tablet:pb-[96px]"} data-el-id={"el-1068"}>
          <div className={"gra-el-1069 relative overflow-x-hidden px-5 py-16 tablet:p-16 laptop:p-24 desktop:p-[120px] pb-10 tablet:pb-10 laptop:pb-16 desktop:pb-16"} data-el-id={"el-1069"}>
            <section className={"gra-el-1070 max-w-[1200px] mx-auto"} data-el-id={"el-1070"}>
              <div className={"gra-el-1071 max-w-[800px]"} data-el-id={"el-1071"}>
                <h2 className={"gra-el-1072 pb-2 text-[32px] font-bold leading-[40px] text-primary laptop:text-[48px] laptop:leading-[52px]"} data-el-id={"el-1072"}>
                  {translateText("Boss your business")}
                </h2>
                <p className={"gra-el-1073 text-[17px] leading-[24px] text-granite-1200 laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1073"}>
                  {translateText("At Fresha, we want to help you grow your business, attract new clients and boost sales. See how businesses are doing on Fresha")}
                </p>
              </div>
            </section>
          </div>
          <div className={"gra-el-1074 relative w-full"} data-el-id={"el-1074"}>
            <div className={"gra-el-1075 flex snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-hidden scroll-smooth px-5 pb-0.5 laptop:gap-8"} data-el-id={"el-1075"}>
              <div className={"gra-el-1076 flex gap-6 laptop:gap-8"} data-el-id={"el-1076"}>
                <div className={"gra-el-1077"} data-el-id={"el-1077"}>
                  <div className={"gra-el-1078 flex h-[300px] snap-x snap-mandatory snap-center flex-col justify-between gap-3 overflow-x-auto rounded-xl border border-neutral-faded bg-muted p-6 text-muted-foreground laptop:h-[416px] laptop:p-12"} data-el-id={"el-1078"}>
                    <div className={"gra-el-1079 flex flex-col gap-3 laptop:gap-4"} data-el-id={"el-1079"}>
                      <h3 className={"gra-el-1080 text-[64px] font-bold leading-[64px] text-accent"} data-el-id={"el-1080"}>
                        {translateText("26%")}
                      </h3>
                      <p className={"gra-el-1081 text-2xl font-semibold"} data-el-id={"el-1081"}>
                        {translateText("More clients")}
                      </p>
                    </div>
                    <div className={"gra-el-1082 flex items-center justify-between"} data-el-id={"el-1082"}>
                      <p className={"gra-el-1083"} data-el-id={"el-1083"}>
                        {translateText("Win new clients and keep them coming back on the world's largest beauty and wellness marketplace. So you can wake up to a fully booked day, every day.")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={"gra-el-1084"} data-el-id={"el-1084"}>
                  <div className={"gra-el-1085 flex h-[300px] snap-x snap-mandatory snap-center flex-col justify-between gap-3 overflow-x-auto rounded-xl border border-neutral-faded bg-muted p-6 text-muted-foreground laptop:h-[416px] laptop:p-12"} data-el-id={"el-1085"}>
                    <div className={"gra-el-1086 flex flex-col gap-3 laptop:gap-4"} data-el-id={"el-1086"}>
                      <h3 className={"gra-el-1087 text-[64px] font-bold leading-[64px] text-accent"} data-el-id={"el-1087"}>
                        {translateText("89%")}
                      </h3>
                      <p className={"gra-el-1088 text-2xl font-semibold"} data-el-id={"el-1088"}>
                        {translateText("Fewer no-shows")}
                      </p>
                    </div>
                    <div className={"gra-el-1089 flex items-center justify-between"} data-el-id={"el-1089"}>
                      <p className={"gra-el-1090"} data-el-id={"el-1090"}>
                        {translateText("Reduce no-shows and cancellations by taking a deposit or a full payment upfront.")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={"gra-el-1091"} data-el-id={"el-1091"}>
                  <div className={"gra-el-1092 flex h-[300px] snap-x snap-mandatory snap-center flex-col justify-between gap-3 overflow-x-auto rounded-xl border border-neutral-faded bg-muted p-6 text-muted-foreground laptop:h-[416px] laptop:p-12"} data-el-id={"el-1092"}>
                    <div className={"gra-el-1093 flex flex-col gap-3 laptop:gap-4"} data-el-id={"el-1093"}>
                      <h3 className={"gra-el-1094 text-[64px] font-bold leading-[64px] text-accent"} data-el-id={"el-1094"}>
                        {translateText("20%")}
                      </h3>
                      <p className={"gra-el-1095 text-2xl font-semibold"} data-el-id={"el-1095"}>
                        {translateText("More sales")}
                      </p>
                    </div>
                    <div className={"gra-el-1096 flex items-center justify-between"} data-el-id={"el-1096"}>
                      <p className={"gra-el-1097"} data-el-id={"el-1097"}>
                        {translateText("Generate more sales by upselling services when clients book online.")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={"gra-el-1098"} data-el-id={"el-1098"}>
                  <div className={"gra-el-1099 flex h-[300px] snap-x snap-mandatory snap-center flex-col justify-between gap-3 overflow-x-auto rounded-xl border border-neutral-faded bg-muted p-6 text-muted-foreground laptop:h-[416px] laptop:p-12"} data-el-id={"el-1099"}>
                    <div className={"gra-el-1100 flex flex-col gap-3 laptop:gap-4"} data-el-id={"el-1100"}>
                      <h3 className={"gra-el-1101 text-[64px] font-bold leading-[64px] text-accent"} data-el-id={"el-1101"}>
                        {translateText("290%")}
                      </h3>
                      <p className={"gra-el-1102 text-2xl font-semibold"} data-el-id={"el-1102"}>
                        {translateText("More tips")}
                      </p>
                    </div>
                    <div className={"gra-el-1103 flex items-center justify-between"} data-el-id={"el-1103"}>
                      <p className={"gra-el-1104"} data-el-id={"el-1104"}>
                        {translateText("Collect more tips when clients book online via Fresha marketplace, your website, Google, or social media platforms.")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={"gra-el-1105"} data-el-id={"el-1105"}>
                  <div className={"gra-el-1106 flex h-[300px] snap-x snap-mandatory snap-center flex-col justify-between gap-3 overflow-x-auto rounded-xl border border-neutral-faded bg-muted p-6 text-muted-foreground laptop:h-[416px] laptop:p-12"} data-el-id={"el-1106"}>
                    <div className={"gra-el-1107 flex flex-col gap-3 laptop:gap-4"} data-el-id={"el-1107"}>
                      <h3 className={"gra-el-1108 text-[64px] font-bold leading-[64px] text-accent"} data-el-id={"el-1108"}>
                        {translateText("12%")}
                      </h3>
                      <p className={"gra-el-1109 text-2xl font-semibold"} data-el-id={"el-1109"}>
                        {translateText("Higher retention")}
                      </p>
                    </div>
                    <div className={"gra-el-1110 flex items-center justify-between"} data-el-id={"el-1110"}>
                      <p className={"gra-el-1111"} data-el-id={"el-1111"}>
                        {translateText("Partners using Fresha experience a higher retention of clients.")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={"gra-el-1112"} data-el-id={"el-1112"}>
                  <div className={"gra-el-1113 flex h-[300px] snap-x snap-mandatory snap-center flex-col justify-between gap-3 overflow-x-auto rounded-xl border border-neutral-faded bg-muted p-6 text-muted-foreground laptop:h-[416px] laptop:p-12"} data-el-id={"el-1113"}>
                    <div className={"gra-el-1114 flex flex-col gap-3 laptop:gap-4"} data-el-id={"el-1114"}>
                      <h3 className={"gra-el-1115 text-[64px] font-bold leading-[64px] text-accent"} data-el-id={"el-1115"}>
                        {translateText("392%")}
                      </h3>
                      <p className={"gra-el-1116 text-2xl font-semibold"} data-el-id={"el-1116"}>
                        {translateText("Return on investment")}
                      </p>
                    </div>
                    <div className={"gra-el-1117 flex items-center justify-between"} data-el-id={"el-1117"}>
                      <p className={"gra-el-1118"} data-el-id={"el-1118"}>
                        {translateText("Most partners grow with Fresha.")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={"gra-el-1119"} data-el-id={"el-1119"}>
                  <div className={"gra-el-1120 flex h-[300px] snap-x snap-mandatory snap-center flex-col justify-between gap-3 overflow-x-auto rounded-xl border border-neutral-faded bg-muted p-6 text-muted-foreground laptop:h-[416px] laptop:p-12"} data-el-id={"el-1120"}>
                    <div className={"gra-el-1121 flex flex-col gap-3 laptop:gap-4"} data-el-id={"el-1121"}>
                      <h3 className={"gra-el-1122 text-[64px] font-bold leading-[64px] text-accent"} data-el-id={"el-1122"}>
                        {translateText("41%")}
                      </h3>
                      <p className={"gra-el-1123 text-2xl font-semibold"} data-el-id={"el-1123"}>
                        {translateText("Booked outside business hours")}
                      </p>
                    </div>
                    <div className={"gra-el-1124 flex items-center justify-between"} data-el-id={"el-1124"}>
                      <p className={"gra-el-1125"} data-el-id={"el-1125"}>
                        {translateText("Our marketplace help you capture clients looking to book outside business hours.")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={"gra-el-1126 mt-8 px-5 tablet:px-16 laptop:px-24 desktop:px-[120px]"} data-el-id={"el-1126"}>
              <div className={"gra-el-1127 mx-auto flex max-w-[1200px] justify-start gap-4"} data-el-id={"el-1127"}>
                <button className={"gra-el-1128 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none transition-transform duration-short-m ease-ease-out bg-transparent text-primary border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-1 w-[36px] h-[36px] cursor-pointer"} data-el-id={"el-1128"} type={"button"}>
                  <div className={"gra-el-1129 rotate-180 rtl:rotate-0 h-6 w-6"} data-el-id={"el-1129"}>
                    <svg className={"gra-el-1130"} data-el-id={"el-1130"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                      <path className={"gra-el-1131"} data-el-id={"el-1131"} fillRule={"evenodd"} d={"M12.293 9.043a1 1 0 0 1 1.414 0l6.25 6.25a1 1 0 0 1 0 1.414l-6.25 6.25a1 1 0 0 1-1.414-1.414L17.836 16l-5.543-5.543a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                    </svg>
                  </div>
                  <span className={"gra-el-1132 sr-only"} data-el-id={"el-1132"}>
                    {translateText("Previous")}
                  </span>
                </button>
                <button className={"gra-el-1133 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none transition-transform duration-short-m ease-ease-out bg-transparent text-primary border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-1 w-[36px] h-[36px] cursor-pointer"} data-el-id={"el-1133"} type={"button"}>
                  <div className={"gra-el-1134 rotate-0 rtl:rotate-180 h-6 w-6"} data-el-id={"el-1134"}>
                    <svg className={"gra-el-1135"} data-el-id={"el-1135"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                      <path className={"gra-el-1136"} data-el-id={"el-1136"} fillRule={"evenodd"} d={"M12.293 9.043a1 1 0 0 1 1.414 0l6.25 6.25a1 1 0 0 1 0 1.414l-6.25 6.25a1 1 0 0 1-1.414-1.414L17.836 16l-5.543-5.543a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                    </svg>
                  </div>
                  <span className={"gra-el-1137 sr-only"} data-el-id={"el-1137"}>
                    {translateText("Next")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={"gra-el-1138 relative overflow-x-hidden px-5 py-16 tablet:p-16 laptop:p-24 desktop:p-[120px] bg-neutral-100 laptop:py-[128px] desktop:py-[128px]"} data-el-id={"el-1138"}>
          <section className={"gra-el-1139 max-w-[1200px] mx-auto"} data-el-id={"el-1139"}>
            <h2 className={"gra-el-1140 text-pretty pb-3 text-[32px] font-bold leading-[40px] laptop:text-[48px] laptop:leading-[52px]"} data-el-id={"el-1140"}>
              {translateText("Committed to your success")}
            </h2>
            <p className={"gra-el-1141 pb-10 text-xl laptop:pb-16"} data-el-id={"el-1141"}>
              {translateText("Every business has its own needs, and we have got you covered with a range of professional services")}
            </p>
            <div className={"gra-el-1142 grid grid-cols-1 gap-10 tablet:grid-cols-2 laptop:grid-cols-3 laptop:gap-x-24"} data-el-id={"el-1142"}>
              <div className={"gra-el-1143"} data-el-id={"el-1143"}>
                <h3 className={"gra-el-1144 pb-3 text-xl font-semibold"} data-el-id={"el-1144"}>
                  {translateText("Customer success manager")}
                </h3>
                <p className={"gra-el-1145 text-[15px] leading-5"} data-el-id={"el-1145"}>
                  {translateText("Get dedicated help to maximize your potential on Fresha")}
                </p>
              </div>
              <div className={"gra-el-1146"} data-el-id={"el-1146"}>
                <h3 className={"gra-el-1147 pb-3 text-xl font-semibold"} data-el-id={"el-1147"}>
                  {translateText("Access our network")}
                </h3>
                <p className={"gra-el-1148 text-[15px] leading-5"} data-el-id={"el-1148"}>
                  {translateText("Use an Enterprise-certified account manager to bring your business to life")}
                </p>
              </div>
              <div className={"gra-el-1149"} data-el-id={"el-1149"}>
                <h3 className={"gra-el-1150 pb-3 text-xl font-semibold"} data-el-id={"el-1150"}>
                  {translateText("24/7 priority support")}
                </h3>
                <p className={"gra-el-1151 text-[15px] leading-5"} data-el-id={"el-1151"}>
                  {translateText("Talk with our customer care team anytime. We're here to help.")}
                </p>
              </div>
              <div className={"gra-el-1152"} data-el-id={"el-1152"}>
                <h3 className={"gra-el-1153 pb-3 text-xl font-semibold"} data-el-id={"el-1153"}>
                  {translateText("Migration support")}
                </h3>
                <p className={"gra-el-1154 text-[15px] leading-5"} data-el-id={"el-1154"}>
                  {translateText("Our team can help bring your data from other platforms")}
                </p>
              </div>
              <div className={"gra-el-1155"} data-el-id={"el-1155"}>
                <h3 className={"gra-el-1156 pb-3 text-xl font-semibold"} data-el-id={"el-1156"}>
                  {translateText("Tailored solutions")}
                </h3>
                <p className={"gra-el-1157 text-[15px] leading-5"} data-el-id={"el-1157"}>
                  {translateText("Have something in mind? Just ask us. We will figure it out together.")}
                </p>
              </div>
              <div className={"gra-el-1158"} data-el-id={"el-1158"}>
                <h3 className={"gra-el-1159 pb-3 text-xl font-semibold"} data-el-id={"el-1159"}>
                  {translateText("Expert consultation")}
                </h3>
                <p className={"gra-el-1160 text-[15px] leading-5"} data-el-id={"el-1160"}>
                  {translateText("Get direct access to product experts for guidance on all things Fresha")}
                </p>
              </div>
            </div>
          </section>
        </div>
        <div className={"gra-el-1161 relative overflow-x-hidden px-5 py-16 tablet:p-16 laptop:p-24 desktop:p-[120px]"} data-el-id={"el-1161"}>
          <section className={"gra-el-1162 max-w-[1200px] mx-auto"} data-el-id={"el-1162"}>
            <div className={"gra-el-1163 mb-12"} data-el-id={"el-1163"}>
              <h2 className={"gra-el-1164 text-pretty text-[32px] font-bold leading-[40px] laptop:text-[48px] laptop:leading-[54px]"} data-el-id={"el-1164"}>
                {translateText("You are never alone, award winning customer support 24/7")}
                <br className={"gra-el-1165"} data-el-id={"el-1165"} />
              </h2>
            </div>
            <div className={"gra-el-1166 grid grid-cols-1 gap-8 laptop:grid-cols-2 laptop:gap-8"} data-el-id={"el-1166"}>
              <a className={"gra-el-1167 group flex flex-col justify-between gap-8 rounded-3xl border border-neutral-faded p-6 transition-colors duration-100 ease-in-out hover:border-neutral-fadedHover hover:bg-secondary-hover active:border-neutral-fadedActive tablet:p-8"} data-el-id={"el-1167"} href={"https://www.fresha.com/help-center"}>
                <div className={"gra-el-1168"} data-el-id={"el-1168"}>
                  <h3 className={"gra-el-1169 mb-3 text-pretty text-xl font-semibold leading-8 tablet:text-2xl"} data-el-id={"el-1169"}>
                    {translateText("Help Center")}
                  </h3>
                  <p className={"gra-el-1170 text-[17px] leading-[24px] text-neutral-500"} data-el-id={"el-1170"}>
                    {translateText("Explore and learn with our help center knowledge base.")}
                  </p>
                </div>
                <div className={"gra-el-1171 typography-body-m-semibold text-nowrap flex items-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none transition-transform duration-short-m ease-ease-out bg-transparent hover:bg-transparentHover active:bg-transparentActive text-primary rounded-full typography-body-s-medium h-5 justify-start space-x-2 p-0"} data-el-id={"el-1171"} type={"button"}>
                  <span className={"gra-el-1172"} data-el-id={"el-1172"}>
                    {translateText("Go to help center")}
                  </span>
                  <div className={"gra-el-1173 rotate-0 h-6 w-6 transition-transform duration-100 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"} data-el-id={"el-1173"}>
                    <svg className={"gra-el-1174"} data-el-id={"el-1174"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                      <path className={"gra-el-1175"} data-el-id={"el-1175"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                    </svg>
                  </div>
                </div>
              </a>
              <a className={"gra-el-1176 group flex flex-col justify-between gap-8 rounded-3xl border border-neutral-faded p-6 transition-colors duration-100 ease-in-out hover:border-neutral-fadedHover hover:bg-secondary-hover active:border-neutral-fadedActive tablet:p-8"} data-el-id={"el-1176"} href={"https://www.fresha.com/help-center/contact-us/search"}>
                <div className={"gra-el-1177"} data-el-id={"el-1177"}>
                  <h3 className={"gra-el-1178 mb-3 text-pretty text-xl font-semibold leading-8 tablet:text-2xl"} data-el-id={"el-1178"}>
                    {translateText("Contact us")}
                  </h3>
                  <p className={"gra-el-1179 text-[17px] leading-[24px] text-neutral-500"} data-el-id={"el-1179"}>
                    {translateText("Contact us via email and phone and one of our team will be there to help.")}
                  </p>
                </div>
                <div className={"gra-el-1180 typography-body-m-semibold text-nowrap flex items-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none transition-transform duration-short-m ease-ease-out bg-transparent hover:bg-transparentHover active:bg-transparentActive text-primary rounded-full typography-body-s-medium h-5 justify-start space-x-2 p-0"} data-el-id={"el-1180"} type={"button"}>
                  <span className={"gra-el-1181"} data-el-id={"el-1181"}>
                    {translateText("Contact us")}
                  </span>
                  <div className={"gra-el-1182 rotate-0 h-6 w-6 transition-transform duration-100 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"} data-el-id={"el-1182"}>
                    <svg className={"gra-el-1183"} data-el-id={"el-1183"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                      <path className={"gra-el-1184"} data-el-id={"el-1184"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                    </svg>
                  </div>
                </div>
              </a>
            </div>
          </section>
        </div>
        <div className={"gra-el-1185 relative overflow-x-hidden px-5 py-16 tablet:p-16 laptop:p-24 desktop:p-[120px]"} data-el-id={"el-1185"}>
          <section className={"gra-el-1186 max-w-[800px] mx-auto"} data-el-id={"el-1186"}>
            <h2 className={"gra-el-1187 text-center text-[32px] font-bold leading-[40px] laptop:typography-display-l-bold"} data-el-id={"el-1187"}>
              {translateText("Frequently asked questions")}
            </h2>
            <div className={"gra-el-1188 gra-faq-list mt-10 laptop:mt-24"} data-el-id={"el-1188"}>
              {GIRIS_FAQ_ITEMS.map((item, index) => {
                const isOpen = openFaqIndex === index;

                return (
                  <div
                    key={item.containerId}
                    className={`gra-${item.containerId} gra-faq-item relative rounded-lg bg-background-pageFadedActive hover:bg-background-pageFadedHover active:bg-background-pageFadedActive mb-4 last-of-type:mb-0`}
                    data-el-id={item.containerId}
                  >
                    <button
                      className={`gra-${item.buttonId} gra-faq-trigger group flex w-full items-center justify-between gap-3 mobile:px-6 mobile:py-5 p-4 transition-all cursor-pointer`}
                      data-el-id={item.buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`giris-faq-panel-${index}`}
                      onClick={() => toggleFaq(index)}
                    >
                      <h3
                        className={`gra-${item.titleId} gra-faq-title text-left typography-body-m-semibold laptop:typography-body-ml-semibold`}
                        data-el-id={item.titleId}
                      >
                        {translateText(item.question)}
                      </h3>
                      <div
                        className={`gra-${item.iconWrapId} gra-faq-icon size-6 shrink-0`}
                        data-el-id={item.iconWrapId}
                        style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease-in-out' }}
                      >
                        <svg
                          className={`gra-${item.iconSvgId}`}
                          data-el-id={item.iconSvgId}
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 32 32"
                        >
                          <path
                            className={`gra-${item.iconPathId}`}
                            data-el-id={item.iconPathId}
                            fillRule="evenodd"
                            d="M16 5.333a1 1 0 0 1 1 1V15h8.667a1 1 0 1 1 0 2H17v8.667a1 1 0 1 1-2 0V17H6.333a1 1 0 1 1 0-2H15V6.333a1 1 0 0 1 1-1"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </button>
                    <div
                      id={`giris-faq-panel-${index}`}
                      className={`gra-${item.answerWrapId} gra-faq-panel grid overflow-hidden transition-all duration-300 ease-in-out`}
                      data-el-id={item.answerWrapId}
                      style={{ gridTemplateRows: isOpen ? '1fr' : '0fr', opacity: isOpen ? 1 : 0 }}
                    >
                      <div className={`gra-${item.answerInnerId} gra-faq-panel-inner overflow-hidden`} data-el-id={item.answerInnerId}>
                        <div
                          className={`gra-${item.answerTextId} gra-faq-answer -mt-1 max-w-[800px] mobile:px-6 mobile:py-5 p-4 pt-2 mobile:pt-2 text-[16px] leading-[22px] text-granite-800`}
                          data-el-id={item.answerTextId}
                        >
                          {item.answer.map((paragraph, paragraphIndex) => (
                            <p
                              key={`${item.containerId}-paragraph-${paragraphIndex}`}
                              className={paragraphIndex < item.answer.length - 1 ? 'pb-3' : undefined}
                            >
                              {translateText(paragraph)}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
        <div className={"gra-el-1264 py-20 laptop:pb-28 laptop:pt-32 bg-transparent"} data-el-id={"el-1264"}>
          <div className={"gra-el-1265 mx-auto max-w-[2000px]"} data-el-id={"el-1265"}>
            <div className={"gra-el-1266 mx-auto max-w-[1240px] px-5 pb-16 text-center"} data-el-id={"el-1266"}>
              <h2 className={"gra-el-1267 text-[32px] font-bold leading-[40px] text-[#141414] laptop:text-[48px] laptop:leading-[52px]"} data-el-id={"el-1267"}>
                {translateText("A platform suitable for all")}
              </h2>
            </div>
            <div className={"gra-el-1268 mx-auto max-w-[2000px] pb-6"} data-el-id={"el-1268"}>
              <div className={"gra-el-1269 relative w-full overflow-hidden"} data-el-id={"el-1269"} dir={"ltr"}>
                <div className={"gra-el-1270 pointer-events-none absolute top-0 z-[2] hidden h-full w-[200px] min-[2000px]:block sf-hidden"} data-el-id={"el-1270"}>
                </div>
                <div className={"gra-el-1271 pointer-events-none absolute top-0 z-[2] hidden h-full w-[200px] min-[2000px]:block sf-hidden"} data-el-id={"el-1271"}>
                </div>
                <div className={"gra-el-1272 w-full overflow-hidden"} data-el-id={"el-1272"}>
                  <div className={"gra-el-1273 flex w-fit items-start space-x-4 laptop:space-x-8 animate-[slide_90s_linear_infinite] hover:[animation-play-state:paused]"} data-el-id={"el-1273"}>
                    <a className={"gra-el-1274 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1274"} href={"https://www.fresha.com/for-business/salon"}>
                      <div className={"gra-el-1275 group"} data-el-id={"el-1275"} dir={"ltr"}>
                        <picture className={"gra-el-1276 slide cursor-pointer"} data-el-id={"el-1276"}>
                          <img className={"gra-el-1277 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1277"} alt={translateText("Hair stylist cutting a client’s hair with scissors in a salon")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1278 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1278"}>
                          <div className={"gra-el-1279 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1279"}>
                            <div className={"gra-el-1280 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1280"}>
                              {translateText("Hair Salon")}
                            </div>
                            <div className={"gra-el-1281"} data-el-id={"el-1281"}>
                              <button className={"gra-el-1282 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1282"} aria-label={translateText("Hair Salon-0")} type={"button"}>
                                <span className={"gra-el-1283 sr-only"} data-el-id={"el-1283"}>
                                  {translateText("Hair Salon-0")}
                                </span>
                                <div className={"gra-el-1284 rotate-0 h-4 w-4"} data-el-id={"el-1284"}>
                                  <svg className={"gra-el-1285"} data-el-id={"el-1285"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1286"} data-el-id={"el-1286"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1287 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1287"} href={"https://www.fresha.com/for-business/nails"}>
                      <div className={"gra-el-1288 group"} data-el-id={"el-1288"} dir={"ltr"}>
                        <picture className={"gra-el-1289 slide cursor-pointer"} data-el-id={"el-1289"}>
                          <img className={"gra-el-1290 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1290"} alt={translateText("Close-up of a manicurist applying nail polish to a client’s nails")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1291 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1291"}>
                          <div className={"gra-el-1292 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1292"}>
                            <div className={"gra-el-1293 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1293"}>
                              {translateText("Nail Salon")}
                            </div>
                            <div className={"gra-el-1294"} data-el-id={"el-1294"}>
                              <button className={"gra-el-1295 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1295"} aria-label={translateText("Nail Salon-1")} type={"button"}>
                                <span className={"gra-el-1296 sr-only"} data-el-id={"el-1296"}>
                                  {translateText("Nail Salon-1")}
                                </span>
                                <div className={"gra-el-1297 rotate-0 h-4 w-4"} data-el-id={"el-1297"}>
                                  <svg className={"gra-el-1298"} data-el-id={"el-1298"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1299"} data-el-id={"el-1299"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1300 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1300"} href={"https://www.fresha.com/for-business/barber"}>
                      <div className={"gra-el-1301 group"} data-el-id={"el-1301"} dir={"ltr"}>
                        <picture className={"gra-el-1302 slide cursor-pointer"} data-el-id={"el-1302"}>
                          <img className={"gra-el-1303 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1303"} alt={translateText("Barber trimming a client’s beard with clippers in a barber chair")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1304 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1304"}>
                          <div className={"gra-el-1305 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1305"}>
                            <div className={"gra-el-1306 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1306"}>
                              {translateText("Barbers")}
                            </div>
                            <div className={"gra-el-1307"} data-el-id={"el-1307"}>
                              <button className={"gra-el-1308 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1308"} aria-label={translateText("Barbers-2")} type={"button"}>
                                <span className={"gra-el-1309 sr-only"} data-el-id={"el-1309"}>
                                  {translateText("Barbers-2")}
                                </span>
                                <div className={"gra-el-1310 rotate-0 h-4 w-4"} data-el-id={"el-1310"}>
                                  <svg className={"gra-el-1311"} data-el-id={"el-1311"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1312"} data-el-id={"el-1312"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1313 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1313"} href={"https://www.fresha.com/for-business/salon"}>
                      <div className={"gra-el-1314 group"} data-el-id={"el-1314"} dir={"ltr"}>
                        <picture className={"gra-el-1315 slide cursor-pointer"} data-el-id={"el-1315"}>
                          <img className={"gra-el-1316 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1316"} alt={translateText("Beauty professional applying wax to a client’s leg for hair removal")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1317 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1317"}>
                          <div className={"gra-el-1318 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1318"}>
                            <div className={"gra-el-1319 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1319"}>
                              {translateText("Waxing Salon")}
                            </div>
                            <div className={"gra-el-1320"} data-el-id={"el-1320"}>
                              <button className={"gra-el-1321 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1321"} aria-label={translateText("Waxing Salon-3")} type={"button"}>
                                <span className={"gra-el-1322 sr-only"} data-el-id={"el-1322"}>
                                  {translateText("Waxing Salon-3")}
                                </span>
                                <div className={"gra-el-1323 rotate-0 h-4 w-4"} data-el-id={"el-1323"}>
                                  <svg className={"gra-el-1324"} data-el-id={"el-1324"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1325"} data-el-id={"el-1325"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1326 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1326"} href={"https://www.fresha.com/for-business/medspa"}>
                      <div className={"gra-el-1327 group"} data-el-id={"el-1327"} dir={"ltr"}>
                        <picture className={"gra-el-1328 slide cursor-pointer"} data-el-id={"el-1328"}>
                          <img className={"gra-el-1329 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1329"} alt={translateText("Woman receiving a facial treatment from a professional in a medspa setting")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1330 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1330"}>
                          <div className={"gra-el-1331 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1331"}>
                            <div className={"gra-el-1332 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1332"}>
                              {translateText("Medspa")}
                            </div>
                            <div className={"gra-el-1333"} data-el-id={"el-1333"}>
                              <button className={"gra-el-1334 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1334"} aria-label={translateText("Medspa-4")} type={"button"}>
                                <span className={"gra-el-1335 sr-only"} data-el-id={"el-1335"}>
                                  {translateText("Medspa-4")}
                                </span>
                                <div className={"gra-el-1336 rotate-0 h-4 w-4"} data-el-id={"el-1336"}>
                                  <svg className={"gra-el-1337"} data-el-id={"el-1337"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1338"} data-el-id={"el-1338"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1339 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1339"} href={"https://www.fresha.com/for-business/salon"}>
                      <div className={"gra-el-1340 group"} data-el-id={"el-1340"} dir={"ltr"}>
                        <picture className={"gra-el-1341 slide cursor-pointer"} data-el-id={"el-1341"}>
                          <img className={"gra-el-1342 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1342"} alt={translateText("Beauty technician shaping a client’s eyebrows using tweezers")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1343 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1343"}>
                          <div className={"gra-el-1344 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1344"}>
                            <div className={"gra-el-1345 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1345"}>
                              {translateText("Eyebrow Bar")}
                            </div>
                            <div className={"gra-el-1346"} data-el-id={"el-1346"}>
                              <button className={"gra-el-1347 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1347"} aria-label={translateText("Eyebrow Bar-5")} type={"button"}>
                                <span className={"gra-el-1348 sr-only"} data-el-id={"el-1348"}>
                                  {translateText("Eyebrow Bar-5")}
                                </span>
                                <div className={"gra-el-1349 rotate-0 h-4 w-4"} data-el-id={"el-1349"}>
                                  <svg className={"gra-el-1350"} data-el-id={"el-1350"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1351"} data-el-id={"el-1351"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1352 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1352"} href={"https://www.fresha.com/for-business/salon"}>
                      <div className={"gra-el-1353 group"} data-el-id={"el-1353"} dir={"ltr"}>
                        <picture className={"gra-el-1354 slide cursor-pointer"} data-el-id={"el-1354"}>
                          <img className={"gra-el-1355 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1355"} alt={translateText("Hair stylist cutting a client’s hair with scissors in a salon")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1356 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1356"}>
                          <div className={"gra-el-1357 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1357"}>
                            <div className={"gra-el-1358 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1358"}>
                              {translateText("Hair Salon")}
                            </div>
                            <div className={"gra-el-1359"} data-el-id={"el-1359"}>
                              <button className={"gra-el-1360 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1360"} aria-label={translateText("Hair Salon-0")} type={"button"}>
                                <span className={"gra-el-1361 sr-only"} data-el-id={"el-1361"}>
                                  {translateText("Hair Salon-0")}
                                </span>
                                <div className={"gra-el-1362 rotate-0 h-4 w-4"} data-el-id={"el-1362"}>
                                  <svg className={"gra-el-1363"} data-el-id={"el-1363"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1364"} data-el-id={"el-1364"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1365 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1365"} href={"https://www.fresha.com/for-business/nails"}>
                      <div className={"gra-el-1366 group"} data-el-id={"el-1366"} dir={"ltr"}>
                        <picture className={"gra-el-1367 slide cursor-pointer"} data-el-id={"el-1367"}>
                          <img className={"gra-el-1368 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1368"} alt={translateText("Close-up of a manicurist applying nail polish to a client’s nails")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1369 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1369"}>
                          <div className={"gra-el-1370 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1370"}>
                            <div className={"gra-el-1371 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1371"}>
                              {translateText("Nail Salon")}
                            </div>
                            <div className={"gra-el-1372"} data-el-id={"el-1372"}>
                              <button className={"gra-el-1373 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1373"} aria-label={translateText("Nail Salon-1")} type={"button"}>
                                <span className={"gra-el-1374 sr-only"} data-el-id={"el-1374"}>
                                  {translateText("Nail Salon-1")}
                                </span>
                                <div className={"gra-el-1375 rotate-0 h-4 w-4"} data-el-id={"el-1375"}>
                                  <svg className={"gra-el-1376"} data-el-id={"el-1376"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1377"} data-el-id={"el-1377"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1378 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1378"} href={"https://www.fresha.com/for-business/barber"}>
                      <div className={"gra-el-1379 group"} data-el-id={"el-1379"} dir={"ltr"}>
                        <picture className={"gra-el-1380 slide cursor-pointer"} data-el-id={"el-1380"}>
                          <img className={"gra-el-1381 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1381"} alt={translateText("Barber trimming a client’s beard with clippers in a barber chair")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1382 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1382"}>
                          <div className={"gra-el-1383 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1383"}>
                            <div className={"gra-el-1384 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1384"}>
                              {translateText("Barbers")}
                            </div>
                            <div className={"gra-el-1385"} data-el-id={"el-1385"}>
                              <button className={"gra-el-1386 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1386"} aria-label={translateText("Barbers-2")} type={"button"}>
                                <span className={"gra-el-1387 sr-only"} data-el-id={"el-1387"}>
                                  {translateText("Barbers-2")}
                                </span>
                                <div className={"gra-el-1388 rotate-0 h-4 w-4"} data-el-id={"el-1388"}>
                                  <svg className={"gra-el-1389"} data-el-id={"el-1389"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1390"} data-el-id={"el-1390"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1391 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1391"} href={"https://www.fresha.com/for-business/salon"}>
                      <div className={"gra-el-1392 group"} data-el-id={"el-1392"} dir={"ltr"}>
                        <picture className={"gra-el-1393 slide cursor-pointer"} data-el-id={"el-1393"}>
                          <img className={"gra-el-1394 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1394"} alt={translateText("Beauty professional applying wax to a client’s leg for hair removal")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1395 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1395"}>
                          <div className={"gra-el-1396 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1396"}>
                            <div className={"gra-el-1397 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1397"}>
                              {translateText("Waxing Salon")}
                            </div>
                            <div className={"gra-el-1398"} data-el-id={"el-1398"}>
                              <button className={"gra-el-1399 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1399"} aria-label={translateText("Waxing Salon-3")} type={"button"}>
                                <span className={"gra-el-1400 sr-only"} data-el-id={"el-1400"}>
                                  {translateText("Waxing Salon-3")}
                                </span>
                                <div className={"gra-el-1401 rotate-0 h-4 w-4"} data-el-id={"el-1401"}>
                                  <svg className={"gra-el-1402"} data-el-id={"el-1402"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1403"} data-el-id={"el-1403"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1404 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1404"} href={"https://www.fresha.com/for-business/medspa"}>
                      <div className={"gra-el-1405 group"} data-el-id={"el-1405"} dir={"ltr"}>
                        <picture className={"gra-el-1406 slide cursor-pointer"} data-el-id={"el-1406"}>
                          <img className={"gra-el-1407 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1407"} alt={translateText("Woman receiving a facial treatment from a professional in a medspa setting")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1408 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1408"}>
                          <div className={"gra-el-1409 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1409"}>
                            <div className={"gra-el-1410 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1410"}>
                              {translateText("Medspa")}
                            </div>
                            <div className={"gra-el-1411"} data-el-id={"el-1411"}>
                              <button className={"gra-el-1412 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1412"} aria-label={translateText("Medspa-4")} type={"button"}>
                                <span className={"gra-el-1413 sr-only"} data-el-id={"el-1413"}>
                                  {translateText("Medspa-4")}
                                </span>
                                <div className={"gra-el-1414 rotate-0 h-4 w-4"} data-el-id={"el-1414"}>
                                  <svg className={"gra-el-1415"} data-el-id={"el-1415"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1416"} data-el-id={"el-1416"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1417 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1417"} href={"https://www.fresha.com/for-business/salon"}>
                      <div className={"gra-el-1418 group"} data-el-id={"el-1418"} dir={"ltr"}>
                        <picture className={"gra-el-1419 slide cursor-pointer"} data-el-id={"el-1419"}>
                          <img className={"gra-el-1420 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1420"} alt={translateText("Beauty technician shaping a client’s eyebrows using tweezers")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1421 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1421"}>
                          <div className={"gra-el-1422 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1422"}>
                            <div className={"gra-el-1423 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1423"}>
                              {translateText("Eyebrow Bar")}
                            </div>
                            <div className={"gra-el-1424"} data-el-id={"el-1424"}>
                              <button className={"gra-el-1425 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1425"} aria-label={translateText("Eyebrow Bar-5")} type={"button"}>
                                <span className={"gra-el-1426 sr-only"} data-el-id={"el-1426"}>
                                  {translateText("Eyebrow Bar-5")}
                                </span>
                                <div className={"gra-el-1427 rotate-0 h-4 w-4"} data-el-id={"el-1427"}>
                                  <svg className={"gra-el-1428"} data-el-id={"el-1428"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1429"} data-el-id={"el-1429"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1430 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1430"} href={"https://www.fresha.com/for-business/salon"}>
                      <div className={"gra-el-1431 group"} data-el-id={"el-1431"} dir={"ltr"}>
                        <picture className={"gra-el-1432 slide cursor-pointer"} data-el-id={"el-1432"}>
                          <img className={"gra-el-1433 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1433"} alt={translateText("Hair stylist cutting a client’s hair with scissors in a salon")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1434 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1434"}>
                          <div className={"gra-el-1435 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1435"}>
                            <div className={"gra-el-1436 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1436"}>
                              {translateText("Hair Salon")}
                            </div>
                            <div className={"gra-el-1437"} data-el-id={"el-1437"}>
                              <button className={"gra-el-1438 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1438"} aria-label={translateText("Hair Salon-0")} type={"button"}>
                                <span className={"gra-el-1439 sr-only"} data-el-id={"el-1439"}>
                                  {translateText("Hair Salon-0")}
                                </span>
                                <div className={"gra-el-1440 rotate-0 h-4 w-4"} data-el-id={"el-1440"}>
                                  <svg className={"gra-el-1441"} data-el-id={"el-1441"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1442"} data-el-id={"el-1442"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1443 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1443"} href={"https://www.fresha.com/for-business/nails"}>
                      <div className={"gra-el-1444 group"} data-el-id={"el-1444"} dir={"ltr"}>
                        <picture className={"gra-el-1445 slide cursor-pointer"} data-el-id={"el-1445"}>
                          <img className={"gra-el-1446 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1446"} alt={translateText("Close-up of a manicurist applying nail polish to a client’s nails")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1447 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1447"}>
                          <div className={"gra-el-1448 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1448"}>
                            <div className={"gra-el-1449 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1449"}>
                              {translateText("Nail Salon")}
                            </div>
                            <div className={"gra-el-1450"} data-el-id={"el-1450"}>
                              <button className={"gra-el-1451 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1451"} aria-label={translateText("Nail Salon-1")} type={"button"}>
                                <span className={"gra-el-1452 sr-only"} data-el-id={"el-1452"}>
                                  {translateText("Nail Salon-1")}
                                </span>
                                <div className={"gra-el-1453 rotate-0 h-4 w-4"} data-el-id={"el-1453"}>
                                  <svg className={"gra-el-1454"} data-el-id={"el-1454"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1455"} data-el-id={"el-1455"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1456 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1456"} href={"https://www.fresha.com/for-business/barber"}>
                      <div className={"gra-el-1457 group"} data-el-id={"el-1457"} dir={"ltr"}>
                        <picture className={"gra-el-1458 slide cursor-pointer"} data-el-id={"el-1458"}>
                          <img className={"gra-el-1459 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1459"} alt={translateText("Barber trimming a client’s beard with clippers in a barber chair")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1460 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1460"}>
                          <div className={"gra-el-1461 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1461"}>
                            <div className={"gra-el-1462 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1462"}>
                              {translateText("Barbers")}
                            </div>
                            <div className={"gra-el-1463"} data-el-id={"el-1463"}>
                              <button className={"gra-el-1464 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1464"} aria-label={translateText("Barbers-2")} type={"button"}>
                                <span className={"gra-el-1465 sr-only"} data-el-id={"el-1465"}>
                                  {translateText("Barbers-2")}
                                </span>
                                <div className={"gra-el-1466 rotate-0 h-4 w-4"} data-el-id={"el-1466"}>
                                  <svg className={"gra-el-1467"} data-el-id={"el-1467"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1468"} data-el-id={"el-1468"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1469 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1469"} href={"https://www.fresha.com/for-business/salon"}>
                      <div className={"gra-el-1470 group"} data-el-id={"el-1470"} dir={"ltr"}>
                        <picture className={"gra-el-1471 slide cursor-pointer"} data-el-id={"el-1471"}>
                          <img className={"gra-el-1472 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1472"} alt={translateText("Beauty professional applying wax to a client’s leg for hair removal")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1473 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1473"}>
                          <div className={"gra-el-1474 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1474"}>
                            <div className={"gra-el-1475 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1475"}>
                              {translateText("Waxing Salon")}
                            </div>
                            <div className={"gra-el-1476"} data-el-id={"el-1476"}>
                              <button className={"gra-el-1477 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1477"} aria-label={translateText("Waxing Salon-3")} type={"button"}>
                                <span className={"gra-el-1478 sr-only"} data-el-id={"el-1478"}>
                                  {translateText("Waxing Salon-3")}
                                </span>
                                <div className={"gra-el-1479 rotate-0 h-4 w-4"} data-el-id={"el-1479"}>
                                  <svg className={"gra-el-1480"} data-el-id={"el-1480"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1481"} data-el-id={"el-1481"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1482 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1482"} href={"https://www.fresha.com/for-business/medspa"}>
                      <div className={"gra-el-1483 group"} data-el-id={"el-1483"} dir={"ltr"}>
                        <picture className={"gra-el-1484 slide cursor-pointer"} data-el-id={"el-1484"}>
                          <img className={"gra-el-1485 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1485"} alt={translateText("Woman receiving a facial treatment from a professional in a medspa setting")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1486 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1486"}>
                          <div className={"gra-el-1487 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1487"}>
                            <div className={"gra-el-1488 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1488"}>
                              {translateText("Medspa")}
                            </div>
                            <div className={"gra-el-1489"} data-el-id={"el-1489"}>
                              <button className={"gra-el-1490 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1490"} aria-label={translateText("Medspa-4")} type={"button"}>
                                <span className={"gra-el-1491 sr-only"} data-el-id={"el-1491"}>
                                  {translateText("Medspa-4")}
                                </span>
                                <div className={"gra-el-1492 rotate-0 h-4 w-4"} data-el-id={"el-1492"}>
                                  <svg className={"gra-el-1493"} data-el-id={"el-1493"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1494"} data-el-id={"el-1494"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1495 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1495"} href={"https://www.fresha.com/for-business/salon"}>
                      <div className={"gra-el-1496 group"} data-el-id={"el-1496"} dir={"ltr"}>
                        <picture className={"gra-el-1497 slide cursor-pointer"} data-el-id={"el-1497"}>
                          <img className={"gra-el-1498 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1498"} alt={translateText("Beauty technician shaping a client’s eyebrows using tweezers")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1499 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1499"}>
                          <div className={"gra-el-1500 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1500"}>
                            <div className={"gra-el-1501 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1501"}>
                              {translateText("Eyebrow Bar")}
                            </div>
                            <div className={"gra-el-1502"} data-el-id={"el-1502"}>
                              <button className={"gra-el-1503 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1503"} aria-label={translateText("Eyebrow Bar-5")} type={"button"}>
                                <span className={"gra-el-1504 sr-only"} data-el-id={"el-1504"}>
                                  {translateText("Eyebrow Bar-5")}
                                </span>
                                <div className={"gra-el-1505 rotate-0 h-4 w-4"} data-el-id={"el-1505"}>
                                  <svg className={"gra-el-1506"} data-el-id={"el-1506"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1507"} data-el-id={"el-1507"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1508 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1508"} href={"https://www.fresha.com/for-business/salon"}>
                      <div className={"gra-el-1509 group"} data-el-id={"el-1509"} dir={"ltr"}>
                        <picture className={"gra-el-1510 slide cursor-pointer"} data-el-id={"el-1510"}>
                          <img className={"gra-el-1511 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1511"} alt={translateText("Hair stylist cutting a client’s hair with scissors in a salon")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1512 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1512"}>
                          <div className={"gra-el-1513 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1513"}>
                            <div className={"gra-el-1514 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1514"}>
                              {translateText("Hair Salon")}
                            </div>
                            <div className={"gra-el-1515"} data-el-id={"el-1515"}>
                              <button className={"gra-el-1516 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1516"} aria-label={translateText("Hair Salon-0")} type={"button"}>
                                <span className={"gra-el-1517 sr-only"} data-el-id={"el-1517"}>
                                  {translateText("Hair Salon-0")}
                                </span>
                                <div className={"gra-el-1518 rotate-0 h-4 w-4"} data-el-id={"el-1518"}>
                                  <svg className={"gra-el-1519"} data-el-id={"el-1519"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1520"} data-el-id={"el-1520"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1521 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1521"} href={"https://www.fresha.com/for-business/nails"}>
                      <div className={"gra-el-1522 group"} data-el-id={"el-1522"} dir={"ltr"}>
                        <picture className={"gra-el-1523 slide cursor-pointer"} data-el-id={"el-1523"}>
                          <img className={"gra-el-1524 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1524"} alt={translateText("Close-up of a manicurist applying nail polish to a client’s nails")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1525 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1525"}>
                          <div className={"gra-el-1526 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1526"}>
                            <div className={"gra-el-1527 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1527"}>
                              {translateText("Nail Salon")}
                            </div>
                            <div className={"gra-el-1528"} data-el-id={"el-1528"}>
                              <button className={"gra-el-1529 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1529"} aria-label={translateText("Nail Salon-1")} type={"button"}>
                                <span className={"gra-el-1530 sr-only"} data-el-id={"el-1530"}>
                                  {translateText("Nail Salon-1")}
                                </span>
                                <div className={"gra-el-1531 rotate-0 h-4 w-4"} data-el-id={"el-1531"}>
                                  <svg className={"gra-el-1532"} data-el-id={"el-1532"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1533"} data-el-id={"el-1533"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1534 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1534"} href={"https://www.fresha.com/for-business/barber"}>
                      <div className={"gra-el-1535 group"} data-el-id={"el-1535"} dir={"ltr"}>
                        <picture className={"gra-el-1536 slide cursor-pointer"} data-el-id={"el-1536"}>
                          <img className={"gra-el-1537 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1537"} alt={translateText("Barber trimming a client’s beard with clippers in a barber chair")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1538 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1538"}>
                          <div className={"gra-el-1539 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1539"}>
                            <div className={"gra-el-1540 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1540"}>
                              {translateText("Barbers")}
                            </div>
                            <div className={"gra-el-1541"} data-el-id={"el-1541"}>
                              <button className={"gra-el-1542 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1542"} aria-label={translateText("Barbers-2")} type={"button"}>
                                <span className={"gra-el-1543 sr-only"} data-el-id={"el-1543"}>
                                  {translateText("Barbers-2")}
                                </span>
                                <div className={"gra-el-1544 rotate-0 h-4 w-4"} data-el-id={"el-1544"}>
                                  <svg className={"gra-el-1545"} data-el-id={"el-1545"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1546"} data-el-id={"el-1546"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1547 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1547"} href={"https://www.fresha.com/for-business/salon"}>
                      <div className={"gra-el-1548 group"} data-el-id={"el-1548"} dir={"ltr"}>
                        <picture className={"gra-el-1549 slide cursor-pointer"} data-el-id={"el-1549"}>
                          <img className={"gra-el-1550 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1550"} alt={translateText("Beauty professional applying wax to a client’s leg for hair removal")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1551 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1551"}>
                          <div className={"gra-el-1552 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1552"}>
                            <div className={"gra-el-1553 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1553"}>
                              {translateText("Waxing Salon")}
                            </div>
                            <div className={"gra-el-1554"} data-el-id={"el-1554"}>
                              <button className={"gra-el-1555 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1555"} aria-label={translateText("Waxing Salon-3")} type={"button"}>
                                <span className={"gra-el-1556 sr-only"} data-el-id={"el-1556"}>
                                  {translateText("Waxing Salon-3")}
                                </span>
                                <div className={"gra-el-1557 rotate-0 h-4 w-4"} data-el-id={"el-1557"}>
                                  <svg className={"gra-el-1558"} data-el-id={"el-1558"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1559"} data-el-id={"el-1559"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1560 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1560"} href={"https://www.fresha.com/for-business/medspa"}>
                      <div className={"gra-el-1561 group"} data-el-id={"el-1561"} dir={"ltr"}>
                        <picture className={"gra-el-1562 slide cursor-pointer"} data-el-id={"el-1562"}>
                          <img className={"gra-el-1563 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1563"} alt={translateText("Woman receiving a facial treatment from a professional in a medspa setting")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1564 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1564"}>
                          <div className={"gra-el-1565 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1565"}>
                            <div className={"gra-el-1566 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1566"}>
                              {translateText("Medspa")}
                            </div>
                            <div className={"gra-el-1567"} data-el-id={"el-1567"}>
                              <button className={"gra-el-1568 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1568"} aria-label={translateText("Medspa-4")} type={"button"}>
                                <span className={"gra-el-1569 sr-only"} data-el-id={"el-1569"}>
                                  {translateText("Medspa-4")}
                                </span>
                                <div className={"gra-el-1570 rotate-0 h-4 w-4"} data-el-id={"el-1570"}>
                                  <svg className={"gra-el-1571"} data-el-id={"el-1571"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1572"} data-el-id={"el-1572"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1573 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1573"} href={"https://www.fresha.com/for-business/salon"}>
                      <div className={"gra-el-1574 group"} data-el-id={"el-1574"} dir={"ltr"}>
                        <picture className={"gra-el-1575 slide cursor-pointer"} data-el-id={"el-1575"}>
                          <img className={"gra-el-1576 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1576"} alt={translateText("Beauty technician shaping a client’s eyebrows using tweezers")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1577 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1577"}>
                          <div className={"gra-el-1578 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1578"}>
                            <div className={"gra-el-1579 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1579"}>
                              {translateText("Eyebrow Bar")}
                            </div>
                            <div className={"gra-el-1580"} data-el-id={"el-1580"}>
                              <button className={"gra-el-1581 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1581"} aria-label={translateText("Eyebrow Bar-5")} type={"button"}>
                                <span className={"gra-el-1582 sr-only"} data-el-id={"el-1582"}>
                                  {translateText("Eyebrow Bar-5")}
                                </span>
                                <div className={"gra-el-1583 rotate-0 h-4 w-4"} data-el-id={"el-1583"}>
                                  <svg className={"gra-el-1584"} data-el-id={"el-1584"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1585"} data-el-id={"el-1585"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className={"gra-el-1586 mx-auto max-w-[2000px]"} data-el-id={"el-1586"}>
              <div className={"gra-el-1587 relative w-full overflow-hidden"} data-el-id={"el-1587"} dir={"rtl"}>
                <div className={"gra-el-1588 pointer-events-none absolute top-0 z-[2] hidden h-full w-[200px] min-[2000px]:block sf-hidden"} data-el-id={"el-1588"}>
                </div>
                <div className={"gra-el-1589 pointer-events-none absolute top-0 z-[2] hidden h-full w-[200px] min-[2000px]:block sf-hidden"} data-el-id={"el-1589"}>
                </div>
                <div className={"gra-el-1590 w-full overflow-hidden"} data-el-id={"el-1590"}>
                  <div className={"gra-el-1591 flex w-fit items-start space-x-4 laptop:space-x-8 animate-[slide-rtl_90s_linear_infinite] hover:[animation-play-state:paused]"} data-el-id={"el-1591"}>
                    <a className={"gra-el-1592 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1592"} href={"https://www.fresha.com/for-business/massage"}>
                      <div className={"gra-el-1593 group"} data-el-id={"el-1593"} dir={"ltr"}>
                        <picture className={"gra-el-1594 slide cursor-pointer"} data-el-id={"el-1594"}>
                          <img className={"gra-el-1595 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1595"} alt={translateText("Massage therapist giving a back massage to a client lying on a treatment table")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"389\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1596 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1596"}>
                          <div className={"gra-el-1597 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1597"}>
                            <div className={"gra-el-1598 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1598"}>
                              {translateText("Massage Salon")}
                            </div>
                            <div className={"gra-el-1599"} data-el-id={"el-1599"}>
                              <button className={"gra-el-1600 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1600"} aria-label={translateText("Massage Salon-0")} type={"button"}>
                                <span className={"gra-el-1601 sr-only"} data-el-id={"el-1601"}>
                                  {translateText("Massage Salon-0")}
                                </span>
                                <div className={"gra-el-1602 rotate-0 h-4 w-4"} data-el-id={"el-1602"}>
                                  <svg className={"gra-el-1603"} data-el-id={"el-1603"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1604"} data-el-id={"el-1604"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1605 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1605"} href={"https://www.fresha.com/for-business/spa-and-sauna"}>
                      <div className={"gra-el-1606 group"} data-el-id={"el-1606"} dir={"ltr"}>
                        <picture className={"gra-el-1607 slide cursor-pointer"} data-el-id={"el-1607"}>
                          <img className={"gra-el-1608 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1608"} alt={translateText("Woman relaxing with her eyes closed while wearing a white robe and head towel in a spa setting")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1609 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1609"}>
                          <div className={"gra-el-1610 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1610"}>
                            <div className={"gra-el-1611 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1611"}>
                              {translateText("Spa")}
                            </div>
                            <div className={"gra-el-1612"} data-el-id={"el-1612"}>
                              <button className={"gra-el-1613 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1613"} aria-label={translateText("Spa-1")} type={"button"}>
                                <span className={"gra-el-1614 sr-only"} data-el-id={"el-1614"}>
                                  {translateText("Spa-1")}
                                </span>
                                <div className={"gra-el-1615 rotate-0 h-4 w-4"} data-el-id={"el-1615"}>
                                  <svg className={"gra-el-1616"} data-el-id={"el-1616"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1617"} data-el-id={"el-1617"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1618 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1618"} href={"https://www.fresha.com/for-business/fitness-and-recovery"}>
                      <div className={"gra-el-1619 group"} data-el-id={"el-1619"} dir={"ltr"}>
                        <picture className={"gra-el-1620 slide cursor-pointer"} data-el-id={"el-1620"}>
                          <img className={"gra-el-1621 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1621"} alt={translateText("Three people performing sit-ups together on mats in a fitness studio")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1622 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1622"}>
                          <div className={"gra-el-1623 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1623"}>
                            <div className={"gra-el-1624 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1624"}>
                              {translateText("Fitness")}
                            </div>
                            <div className={"gra-el-1625"} data-el-id={"el-1625"}>
                              <button className={"gra-el-1626 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1626"} aria-label={translateText("Fitness-2")} type={"button"}>
                                <span className={"gra-el-1627 sr-only"} data-el-id={"el-1627"}>
                                  {translateText("Fitness-2")}
                                </span>
                                <div className={"gra-el-1628 rotate-0 h-4 w-4"} data-el-id={"el-1628"}>
                                  <svg className={"gra-el-1629"} data-el-id={"el-1629"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1630"} data-el-id={"el-1630"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1631 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1631"} href={"https://www.fresha.com/for-business/fitness-and-recovery"}>
                      <div className={"gra-el-1632 group"} data-el-id={"el-1632"} dir={"ltr"}>
                        <picture className={"gra-el-1633 slide cursor-pointer"} data-el-id={"el-1633"}>
                          <img className={"gra-el-1634 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1634"} alt={translateText("Personal trainer guiding a client through a fitness workout at a gym")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1635 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1635"}>
                          <div className={"gra-el-1636 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1636"}>
                            <div className={"gra-el-1637 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1637"}>
                              {translateText("Personal Trainer")}
                            </div>
                            <div className={"gra-el-1638"} data-el-id={"el-1638"}>
                              <button className={"gra-el-1639 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1639"} aria-label={translateText("Personal Trainer-3")} type={"button"}>
                                <span className={"gra-el-1640 sr-only"} data-el-id={"el-1640"}>
                                  {translateText("Personal Trainer-3")}
                                </span>
                                <div className={"gra-el-1641 rotate-0 h-4 w-4"} data-el-id={"el-1641"}>
                                  <svg className={"gra-el-1642"} data-el-id={"el-1642"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1643"} data-el-id={"el-1643"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1644 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1644"} href={"https://www.fresha.com/for-business/salon"}>
                      <div className={"gra-el-1645 group"} data-el-id={"el-1645"} dir={"ltr"}>
                        <picture className={"gra-el-1646 slide cursor-pointer"} data-el-id={"el-1646"}>
                          <img className={"gra-el-1647 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1647"} alt={translateText("Hair stylist cutting a client’s hair with scissors in a salon")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1648 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1648"}>
                          <div className={"gra-el-1649 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1649"}>
                            <div className={"gra-el-1650 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1650"}>
                              {translateText("Salon")}
                            </div>
                            <div className={"gra-el-1651"} data-el-id={"el-1651"}>
                              <button className={"gra-el-1652 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1652"} aria-label={translateText("Salon-4")} type={"button"}>
                                <span className={"gra-el-1653 sr-only"} data-el-id={"el-1653"}>
                                  {translateText("Salon-4")}
                                </span>
                                <div className={"gra-el-1654 rotate-0 h-4 w-4"} data-el-id={"el-1654"}>
                                  <svg className={"gra-el-1655"} data-el-id={"el-1655"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1656"} data-el-id={"el-1656"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1657 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1657"} href={"https://www.fresha.com/for-business/physical-therapy"}>
                      <div className={"gra-el-1658 group"} data-el-id={"el-1658"} dir={"ltr"}>
                        <picture className={"gra-el-1659 slide cursor-pointer"} data-el-id={"el-1659"}>
                          <img className={"gra-el-1660 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1660"} alt={translateText("Therapist assisting a patient with leg exercises during a rehab session")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1661 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1661"}>
                          <div className={"gra-el-1662 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1662"}>
                            <div className={"gra-el-1663 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1663"}>
                              {translateText("Therapy Center")}
                            </div>
                            <div className={"gra-el-1664"} data-el-id={"el-1664"}>
                              <button className={"gra-el-1665 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1665"} aria-label={translateText("Therapy Center-5")} type={"button"}>
                                <span className={"gra-el-1666 sr-only"} data-el-id={"el-1666"}>
                                  {translateText("Therapy Center-5")}
                                </span>
                                <div className={"gra-el-1667 rotate-0 h-4 w-4"} data-el-id={"el-1667"}>
                                  <svg className={"gra-el-1668"} data-el-id={"el-1668"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1669"} data-el-id={"el-1669"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1670 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1670"} href={"https://www.fresha.com/for-business/tattoo-and-piercing"}>
                      <div className={"gra-el-1671 group"} data-el-id={"el-1671"} dir={"ltr"}>
                        <picture className={"gra-el-1672 slide cursor-pointer"} data-el-id={"el-1672"}>
                          <img className={"gra-el-1673 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1673"} alt={translateText("Tattoo artist inking a client’s arm inside a modern studio")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1674 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1674"}>
                          <div className={"gra-el-1675 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1675"}>
                            <div className={"gra-el-1676 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1676"}>
                              {translateText("Tattooing & Piercing")}
                            </div>
                            <div className={"gra-el-1677"} data-el-id={"el-1677"}>
                              <button className={"gra-el-1678 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1678"} aria-label={translateText("Tattooing & Piercing-6")} type={"button"}>
                                <span className={"gra-el-1679 sr-only"} data-el-id={"el-1679"}>
                                  {translateText("Tattooing & Piercing-6")}
                                </span>
                                <div className={"gra-el-1680 rotate-0 h-4 w-4"} data-el-id={"el-1680"}>
                                  <svg className={"gra-el-1681"} data-el-id={"el-1681"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1682"} data-el-id={"el-1682"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1683 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1683"} href={"https://www.fresha.com/for-business/tanning-studio"}>
                      <div className={"gra-el-1684 group"} data-el-id={"el-1684"} dir={"ltr"}>
                        <picture className={"gra-el-1685 slide cursor-pointer"} data-el-id={"el-1685"}>
                          <img className={"gra-el-1686 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1686"} alt={translateText("Modern tanning studio with sunbeds and ambient lighting, representing sunless tanning services on Fresha.")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1687 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1687"}>
                          <div className={"gra-el-1688 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1688"}>
                            <div className={"gra-el-1689 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1689"}>
                              {translateText("Tanning Studios")}
                            </div>
                            <div className={"gra-el-1690"} data-el-id={"el-1690"}>
                              <button className={"gra-el-1691 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1691"} aria-label={translateText("Tanning Studios-7")} type={"button"}>
                                <span className={"gra-el-1692 sr-only"} data-el-id={"el-1692"}>
                                  {translateText("Tanning Studios-7")}
                                </span>
                                <div className={"gra-el-1693 rotate-0 h-4 w-4"} data-el-id={"el-1693"}>
                                  <svg className={"gra-el-1694"} data-el-id={"el-1694"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1695"} data-el-id={"el-1695"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1696 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1696"} href={"https://www.fresha.com/for-business/massage"}>
                      <div className={"gra-el-1697 group"} data-el-id={"el-1697"} dir={"ltr"}>
                        <picture className={"gra-el-1698 slide cursor-pointer"} data-el-id={"el-1698"}>
                          <img className={"gra-el-1699 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1699"} alt={translateText("Massage therapist giving a back massage to a client lying on a treatment table")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"389\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1700 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1700"}>
                          <div className={"gra-el-1701 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1701"}>
                            <div className={"gra-el-1702 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1702"}>
                              {translateText("Massage Salon")}
                            </div>
                            <div className={"gra-el-1703"} data-el-id={"el-1703"}>
                              <button className={"gra-el-1704 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1704"} aria-label={translateText("Massage Salon-0")} type={"button"}>
                                <span className={"gra-el-1705 sr-only"} data-el-id={"el-1705"}>
                                  {translateText("Massage Salon-0")}
                                </span>
                                <div className={"gra-el-1706 rotate-0 h-4 w-4"} data-el-id={"el-1706"}>
                                  <svg className={"gra-el-1707"} data-el-id={"el-1707"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1708"} data-el-id={"el-1708"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1709 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1709"} href={"https://www.fresha.com/for-business/spa-and-sauna"}>
                      <div className={"gra-el-1710 group"} data-el-id={"el-1710"} dir={"ltr"}>
                        <picture className={"gra-el-1711 slide cursor-pointer"} data-el-id={"el-1711"}>
                          <img className={"gra-el-1712 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1712"} alt={translateText("Woman relaxing with her eyes closed while wearing a white robe and head towel in a spa setting")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1713 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1713"}>
                          <div className={"gra-el-1714 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1714"}>
                            <div className={"gra-el-1715 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1715"}>
                              {translateText("Spa")}
                            </div>
                            <div className={"gra-el-1716"} data-el-id={"el-1716"}>
                              <button className={"gra-el-1717 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1717"} aria-label={translateText("Spa-1")} type={"button"}>
                                <span className={"gra-el-1718 sr-only"} data-el-id={"el-1718"}>
                                  {translateText("Spa-1")}
                                </span>
                                <div className={"gra-el-1719 rotate-0 h-4 w-4"} data-el-id={"el-1719"}>
                                  <svg className={"gra-el-1720"} data-el-id={"el-1720"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1721"} data-el-id={"el-1721"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1722 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1722"} href={"https://www.fresha.com/for-business/fitness-and-recovery"}>
                      <div className={"gra-el-1723 group"} data-el-id={"el-1723"} dir={"ltr"}>
                        <picture className={"gra-el-1724 slide cursor-pointer"} data-el-id={"el-1724"}>
                          <img className={"gra-el-1725 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1725"} alt={translateText("Three people performing sit-ups together on mats in a fitness studio")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1726 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1726"}>
                          <div className={"gra-el-1727 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1727"}>
                            <div className={"gra-el-1728 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1728"}>
                              {translateText("Fitness")}
                            </div>
                            <div className={"gra-el-1729"} data-el-id={"el-1729"}>
                              <button className={"gra-el-1730 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1730"} aria-label={translateText("Fitness-2")} type={"button"}>
                                <span className={"gra-el-1731 sr-only"} data-el-id={"el-1731"}>
                                  {translateText("Fitness-2")}
                                </span>
                                <div className={"gra-el-1732 rotate-0 h-4 w-4"} data-el-id={"el-1732"}>
                                  <svg className={"gra-el-1733"} data-el-id={"el-1733"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1734"} data-el-id={"el-1734"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1735 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1735"} href={"https://www.fresha.com/for-business/fitness-and-recovery"}>
                      <div className={"gra-el-1736 group"} data-el-id={"el-1736"} dir={"ltr"}>
                        <picture className={"gra-el-1737 slide cursor-pointer"} data-el-id={"el-1737"}>
                          <img className={"gra-el-1738 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1738"} alt={translateText("Personal trainer guiding a client through a fitness workout at a gym")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1739 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1739"}>
                          <div className={"gra-el-1740 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1740"}>
                            <div className={"gra-el-1741 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1741"}>
                              {translateText("Personal Trainer")}
                            </div>
                            <div className={"gra-el-1742"} data-el-id={"el-1742"}>
                              <button className={"gra-el-1743 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1743"} aria-label={translateText("Personal Trainer-3")} type={"button"}>
                                <span className={"gra-el-1744 sr-only"} data-el-id={"el-1744"}>
                                  {translateText("Personal Trainer-3")}
                                </span>
                                <div className={"gra-el-1745 rotate-0 h-4 w-4"} data-el-id={"el-1745"}>
                                  <svg className={"gra-el-1746"} data-el-id={"el-1746"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1747"} data-el-id={"el-1747"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1748 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1748"} href={"https://www.fresha.com/for-business/salon"}>
                      <div className={"gra-el-1749 group"} data-el-id={"el-1749"} dir={"ltr"}>
                        <picture className={"gra-el-1750 slide cursor-pointer"} data-el-id={"el-1750"}>
                          <img className={"gra-el-1751 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1751"} alt={translateText("Hair stylist cutting a client’s hair with scissors in a salon")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1752 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1752"}>
                          <div className={"gra-el-1753 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1753"}>
                            <div className={"gra-el-1754 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1754"}>
                              {translateText("Salon")}
                            </div>
                            <div className={"gra-el-1755"} data-el-id={"el-1755"}>
                              <button className={"gra-el-1756 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1756"} aria-label={translateText("Salon-4")} type={"button"}>
                                <span className={"gra-el-1757 sr-only"} data-el-id={"el-1757"}>
                                  {translateText("Salon-4")}
                                </span>
                                <div className={"gra-el-1758 rotate-0 h-4 w-4"} data-el-id={"el-1758"}>
                                  <svg className={"gra-el-1759"} data-el-id={"el-1759"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1760"} data-el-id={"el-1760"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1761 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1761"} href={"https://www.fresha.com/for-business/physical-therapy"}>
                      <div className={"gra-el-1762 group"} data-el-id={"el-1762"} dir={"ltr"}>
                        <picture className={"gra-el-1763 slide cursor-pointer"} data-el-id={"el-1763"}>
                          <img className={"gra-el-1764 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1764"} alt={translateText("Therapist assisting a patient with leg exercises during a rehab session")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1765 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1765"}>
                          <div className={"gra-el-1766 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1766"}>
                            <div className={"gra-el-1767 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1767"}>
                              {translateText("Therapy Center")}
                            </div>
                            <div className={"gra-el-1768"} data-el-id={"el-1768"}>
                              <button className={"gra-el-1769 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1769"} aria-label={translateText("Therapy Center-5")} type={"button"}>
                                <span className={"gra-el-1770 sr-only"} data-el-id={"el-1770"}>
                                  {translateText("Therapy Center-5")}
                                </span>
                                <div className={"gra-el-1771 rotate-0 h-4 w-4"} data-el-id={"el-1771"}>
                                  <svg className={"gra-el-1772"} data-el-id={"el-1772"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1773"} data-el-id={"el-1773"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1774 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1774"} href={"https://www.fresha.com/for-business/tattoo-and-piercing"}>
                      <div className={"gra-el-1775 group"} data-el-id={"el-1775"} dir={"ltr"}>
                        <picture className={"gra-el-1776 slide cursor-pointer"} data-el-id={"el-1776"}>
                          <img className={"gra-el-1777 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1777"} alt={translateText("Tattoo artist inking a client’s arm inside a modern studio")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1778 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1778"}>
                          <div className={"gra-el-1779 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1779"}>
                            <div className={"gra-el-1780 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1780"}>
                              {translateText("Tattooing & Piercing")}
                            </div>
                            <div className={"gra-el-1781"} data-el-id={"el-1781"}>
                              <button className={"gra-el-1782 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1782"} aria-label={translateText("Tattooing & Piercing-6")} type={"button"}>
                                <span className={"gra-el-1783 sr-only"} data-el-id={"el-1783"}>
                                  {translateText("Tattooing & Piercing-6")}
                                </span>
                                <div className={"gra-el-1784 rotate-0 h-4 w-4"} data-el-id={"el-1784"}>
                                  <svg className={"gra-el-1785"} data-el-id={"el-1785"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1786"} data-el-id={"el-1786"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1787 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1787"} href={"https://www.fresha.com/for-business/tanning-studio"}>
                      <div className={"gra-el-1788 group"} data-el-id={"el-1788"} dir={"ltr"}>
                        <picture className={"gra-el-1789 slide cursor-pointer"} data-el-id={"el-1789"}>
                          <img className={"gra-el-1790 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1790"} alt={translateText("Modern tanning studio with sunbeds and ambient lighting, representing sunless tanning services on Fresha.")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1791 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1791"}>
                          <div className={"gra-el-1792 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1792"}>
                            <div className={"gra-el-1793 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1793"}>
                              {translateText("Tanning Studios")}
                            </div>
                            <div className={"gra-el-1794"} data-el-id={"el-1794"}>
                              <button className={"gra-el-1795 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1795"} aria-label={translateText("Tanning Studios-7")} type={"button"}>
                                <span className={"gra-el-1796 sr-only"} data-el-id={"el-1796"}>
                                  {translateText("Tanning Studios-7")}
                                </span>
                                <div className={"gra-el-1797 rotate-0 h-4 w-4"} data-el-id={"el-1797"}>
                                  <svg className={"gra-el-1798"} data-el-id={"el-1798"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1799"} data-el-id={"el-1799"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1800 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1800"} href={"https://www.fresha.com/for-business/massage"}>
                      <div className={"gra-el-1801 group"} data-el-id={"el-1801"} dir={"ltr"}>
                        <picture className={"gra-el-1802 slide cursor-pointer"} data-el-id={"el-1802"}>
                          <img className={"gra-el-1803 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1803"} alt={translateText("Massage therapist giving a back massage to a client lying on a treatment table")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"389\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1804 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1804"}>
                          <div className={"gra-el-1805 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1805"}>
                            <div className={"gra-el-1806 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1806"}>
                              {translateText("Massage Salon")}
                            </div>
                            <div className={"gra-el-1807"} data-el-id={"el-1807"}>
                              <button className={"gra-el-1808 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1808"} aria-label={translateText("Massage Salon-0")} type={"button"}>
                                <span className={"gra-el-1809 sr-only"} data-el-id={"el-1809"}>
                                  {translateText("Massage Salon-0")}
                                </span>
                                <div className={"gra-el-1810 rotate-0 h-4 w-4"} data-el-id={"el-1810"}>
                                  <svg className={"gra-el-1811"} data-el-id={"el-1811"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1812"} data-el-id={"el-1812"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1813 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1813"} href={"https://www.fresha.com/for-business/spa-and-sauna"}>
                      <div className={"gra-el-1814 group"} data-el-id={"el-1814"} dir={"ltr"}>
                        <picture className={"gra-el-1815 slide cursor-pointer"} data-el-id={"el-1815"}>
                          <img className={"gra-el-1816 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1816"} alt={translateText("Woman relaxing with her eyes closed while wearing a white robe and head towel in a spa setting")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1817 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1817"}>
                          <div className={"gra-el-1818 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1818"}>
                            <div className={"gra-el-1819 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1819"}>
                              {translateText("Spa")}
                            </div>
                            <div className={"gra-el-1820"} data-el-id={"el-1820"}>
                              <button className={"gra-el-1821 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1821"} aria-label={translateText("Spa-1")} type={"button"}>
                                <span className={"gra-el-1822 sr-only"} data-el-id={"el-1822"}>
                                  {translateText("Spa-1")}
                                </span>
                                <div className={"gra-el-1823 rotate-0 h-4 w-4"} data-el-id={"el-1823"}>
                                  <svg className={"gra-el-1824"} data-el-id={"el-1824"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1825"} data-el-id={"el-1825"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1826 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1826"} href={"https://www.fresha.com/for-business/fitness-and-recovery"}>
                      <div className={"gra-el-1827 group"} data-el-id={"el-1827"} dir={"ltr"}>
                        <picture className={"gra-el-1828 slide cursor-pointer"} data-el-id={"el-1828"}>
                          <img className={"gra-el-1829 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1829"} alt={translateText("Three people performing sit-ups together on mats in a fitness studio")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1830 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1830"}>
                          <div className={"gra-el-1831 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1831"}>
                            <div className={"gra-el-1832 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1832"}>
                              {translateText("Fitness")}
                            </div>
                            <div className={"gra-el-1833"} data-el-id={"el-1833"}>
                              <button className={"gra-el-1834 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1834"} aria-label={translateText("Fitness-2")} type={"button"}>
                                <span className={"gra-el-1835 sr-only"} data-el-id={"el-1835"}>
                                  {translateText("Fitness-2")}
                                </span>
                                <div className={"gra-el-1836 rotate-0 h-4 w-4"} data-el-id={"el-1836"}>
                                  <svg className={"gra-el-1837"} data-el-id={"el-1837"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1838"} data-el-id={"el-1838"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1839 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1839"} href={"https://www.fresha.com/for-business/fitness-and-recovery"}>
                      <div className={"gra-el-1840 group"} data-el-id={"el-1840"} dir={"ltr"}>
                        <picture className={"gra-el-1841 slide cursor-pointer"} data-el-id={"el-1841"}>
                          <img className={"gra-el-1842 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1842"} alt={translateText("Personal trainer guiding a client through a fitness workout at a gym")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1843 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1843"}>
                          <div className={"gra-el-1844 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1844"}>
                            <div className={"gra-el-1845 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1845"}>
                              {translateText("Personal Trainer")}
                            </div>
                            <div className={"gra-el-1846"} data-el-id={"el-1846"}>
                              <button className={"gra-el-1847 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1847"} aria-label={translateText("Personal Trainer-3")} type={"button"}>
                                <span className={"gra-el-1848 sr-only"} data-el-id={"el-1848"}>
                                  {translateText("Personal Trainer-3")}
                                </span>
                                <div className={"gra-el-1849 rotate-0 h-4 w-4"} data-el-id={"el-1849"}>
                                  <svg className={"gra-el-1850"} data-el-id={"el-1850"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1851"} data-el-id={"el-1851"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1852 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1852"} href={"https://www.fresha.com/for-business/salon"}>
                      <div className={"gra-el-1853 group"} data-el-id={"el-1853"} dir={"ltr"}>
                        <picture className={"gra-el-1854 slide cursor-pointer"} data-el-id={"el-1854"}>
                          <img className={"gra-el-1855 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1855"} alt={translateText("Hair stylist cutting a client’s hair with scissors in a salon")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1856 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1856"}>
                          <div className={"gra-el-1857 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1857"}>
                            <div className={"gra-el-1858 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1858"}>
                              {translateText("Salon")}
                            </div>
                            <div className={"gra-el-1859"} data-el-id={"el-1859"}>
                              <button className={"gra-el-1860 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1860"} aria-label={translateText("Salon-4")} type={"button"}>
                                <span className={"gra-el-1861 sr-only"} data-el-id={"el-1861"}>
                                  {translateText("Salon-4")}
                                </span>
                                <div className={"gra-el-1862 rotate-0 h-4 w-4"} data-el-id={"el-1862"}>
                                  <svg className={"gra-el-1863"} data-el-id={"el-1863"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1864"} data-el-id={"el-1864"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1865 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1865"} href={"https://www.fresha.com/for-business/physical-therapy"}>
                      <div className={"gra-el-1866 group"} data-el-id={"el-1866"} dir={"ltr"}>
                        <picture className={"gra-el-1867 slide cursor-pointer"} data-el-id={"el-1867"}>
                          <img className={"gra-el-1868 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1868"} alt={translateText("Therapist assisting a patient with leg exercises during a rehab session")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1869 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1869"}>
                          <div className={"gra-el-1870 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1870"}>
                            <div className={"gra-el-1871 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1871"}>
                              {translateText("Therapy Center")}
                            </div>
                            <div className={"gra-el-1872"} data-el-id={"el-1872"}>
                              <button className={"gra-el-1873 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1873"} aria-label={translateText("Therapy Center-5")} type={"button"}>
                                <span className={"gra-el-1874 sr-only"} data-el-id={"el-1874"}>
                                  {translateText("Therapy Center-5")}
                                </span>
                                <div className={"gra-el-1875 rotate-0 h-4 w-4"} data-el-id={"el-1875"}>
                                  <svg className={"gra-el-1876"} data-el-id={"el-1876"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1877"} data-el-id={"el-1877"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1878 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1878"} href={"https://www.fresha.com/for-business/tattoo-and-piercing"}>
                      <div className={"gra-el-1879 group"} data-el-id={"el-1879"} dir={"ltr"}>
                        <picture className={"gra-el-1880 slide cursor-pointer"} data-el-id={"el-1880"}>
                          <img className={"gra-el-1881 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1881"} alt={translateText("Tattoo artist inking a client’s arm inside a modern studio")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1882 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1882"}>
                          <div className={"gra-el-1883 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1883"}>
                            <div className={"gra-el-1884 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1884"}>
                              {translateText("Tattooing & Piercing")}
                            </div>
                            <div className={"gra-el-1885"} data-el-id={"el-1885"}>
                              <button className={"gra-el-1886 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1886"} aria-label={translateText("Tattooing & Piercing-6")} type={"button"}>
                                <span className={"gra-el-1887 sr-only"} data-el-id={"el-1887"}>
                                  {translateText("Tattooing & Piercing-6")}
                                </span>
                                <div className={"gra-el-1888 rotate-0 h-4 w-4"} data-el-id={"el-1888"}>
                                  <svg className={"gra-el-1889"} data-el-id={"el-1889"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1890"} data-el-id={"el-1890"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1891 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1891"} href={"https://www.fresha.com/for-business/tanning-studio"}>
                      <div className={"gra-el-1892 group"} data-el-id={"el-1892"} dir={"ltr"}>
                        <picture className={"gra-el-1893 slide cursor-pointer"} data-el-id={"el-1893"}>
                          <img className={"gra-el-1894 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1894"} alt={translateText("Modern tanning studio with sunbeds and ambient lighting, representing sunless tanning services on Fresha.")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1895 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1895"}>
                          <div className={"gra-el-1896 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1896"}>
                            <div className={"gra-el-1897 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1897"}>
                              {translateText("Tanning Studios")}
                            </div>
                            <div className={"gra-el-1898"} data-el-id={"el-1898"}>
                              <button className={"gra-el-1899 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1899"} aria-label={translateText("Tanning Studios-7")} type={"button"}>
                                <span className={"gra-el-1900 sr-only"} data-el-id={"el-1900"}>
                                  {translateText("Tanning Studios-7")}
                                </span>
                                <div className={"gra-el-1901 rotate-0 h-4 w-4"} data-el-id={"el-1901"}>
                                  <svg className={"gra-el-1902"} data-el-id={"el-1902"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1903"} data-el-id={"el-1903"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1904 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1904"} href={"https://www.fresha.com/for-business/massage"}>
                      <div className={"gra-el-1905 group"} data-el-id={"el-1905"} dir={"ltr"}>
                        <picture className={"gra-el-1906 slide cursor-pointer"} data-el-id={"el-1906"}>
                          <img className={"gra-el-1907 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1907"} alt={translateText("Massage therapist giving a back massage to a client lying on a treatment table")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"389\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1908 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1908"}>
                          <div className={"gra-el-1909 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1909"}>
                            <div className={"gra-el-1910 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1910"}>
                              {translateText("Massage Salon")}
                            </div>
                            <div className={"gra-el-1911"} data-el-id={"el-1911"}>
                              <button className={"gra-el-1912 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1912"} aria-label={translateText("Massage Salon-0")} type={"button"}>
                                <span className={"gra-el-1913 sr-only"} data-el-id={"el-1913"}>
                                  {translateText("Massage Salon-0")}
                                </span>
                                <div className={"gra-el-1914 rotate-0 h-4 w-4"} data-el-id={"el-1914"}>
                                  <svg className={"gra-el-1915"} data-el-id={"el-1915"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1916"} data-el-id={"el-1916"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1917 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1917"} href={"https://www.fresha.com/for-business/spa-and-sauna"}>
                      <div className={"gra-el-1918 group"} data-el-id={"el-1918"} dir={"ltr"}>
                        <picture className={"gra-el-1919 slide cursor-pointer"} data-el-id={"el-1919"}>
                          <img className={"gra-el-1920 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1920"} alt={translateText("Woman relaxing with her eyes closed while wearing a white robe and head towel in a spa setting")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1921 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1921"}>
                          <div className={"gra-el-1922 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1922"}>
                            <div className={"gra-el-1923 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1923"}>
                              {translateText("Spa")}
                            </div>
                            <div className={"gra-el-1924"} data-el-id={"el-1924"}>
                              <button className={"gra-el-1925 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1925"} aria-label={translateText("Spa-1")} type={"button"}>
                                <span className={"gra-el-1926 sr-only"} data-el-id={"el-1926"}>
                                  {translateText("Spa-1")}
                                </span>
                                <div className={"gra-el-1927 rotate-0 h-4 w-4"} data-el-id={"el-1927"}>
                                  <svg className={"gra-el-1928"} data-el-id={"el-1928"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1929"} data-el-id={"el-1929"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1930 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1930"} href={"https://www.fresha.com/for-business/fitness-and-recovery"}>
                      <div className={"gra-el-1931 group"} data-el-id={"el-1931"} dir={"ltr"}>
                        <picture className={"gra-el-1932 slide cursor-pointer"} data-el-id={"el-1932"}>
                          <img className={"gra-el-1933 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1933"} alt={translateText("Three people performing sit-ups together on mats in a fitness studio")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1934 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1934"}>
                          <div className={"gra-el-1935 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1935"}>
                            <div className={"gra-el-1936 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1936"}>
                              {translateText("Fitness")}
                            </div>
                            <div className={"gra-el-1937"} data-el-id={"el-1937"}>
                              <button className={"gra-el-1938 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1938"} aria-label={translateText("Fitness-2")} type={"button"}>
                                <span className={"gra-el-1939 sr-only"} data-el-id={"el-1939"}>
                                  {translateText("Fitness-2")}
                                </span>
                                <div className={"gra-el-1940 rotate-0 h-4 w-4"} data-el-id={"el-1940"}>
                                  <svg className={"gra-el-1941"} data-el-id={"el-1941"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1942"} data-el-id={"el-1942"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1943 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1943"} href={"https://www.fresha.com/for-business/fitness-and-recovery"}>
                      <div className={"gra-el-1944 group"} data-el-id={"el-1944"} dir={"ltr"}>
                        <picture className={"gra-el-1945 slide cursor-pointer"} data-el-id={"el-1945"}>
                          <img className={"gra-el-1946 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1946"} alt={translateText("Personal trainer guiding a client through a fitness workout at a gym")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1947 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1947"}>
                          <div className={"gra-el-1948 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1948"}>
                            <div className={"gra-el-1949 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1949"}>
                              {translateText("Personal Trainer")}
                            </div>
                            <div className={"gra-el-1950"} data-el-id={"el-1950"}>
                              <button className={"gra-el-1951 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1951"} aria-label={translateText("Personal Trainer-3")} type={"button"}>
                                <span className={"gra-el-1952 sr-only"} data-el-id={"el-1952"}>
                                  {translateText("Personal Trainer-3")}
                                </span>
                                <div className={"gra-el-1953 rotate-0 h-4 w-4"} data-el-id={"el-1953"}>
                                  <svg className={"gra-el-1954"} data-el-id={"el-1954"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1955"} data-el-id={"el-1955"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1956 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1956"} href={"https://www.fresha.com/for-business/salon"}>
                      <div className={"gra-el-1957 group"} data-el-id={"el-1957"} dir={"ltr"}>
                        <picture className={"gra-el-1958 slide cursor-pointer"} data-el-id={"el-1958"}>
                          <img className={"gra-el-1959 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1959"} alt={translateText("Hair stylist cutting a client’s hair with scissors in a salon")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1960 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1960"}>
                          <div className={"gra-el-1961 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1961"}>
                            <div className={"gra-el-1962 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1962"}>
                              {translateText("Salon")}
                            </div>
                            <div className={"gra-el-1963"} data-el-id={"el-1963"}>
                              <button className={"gra-el-1964 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1964"} aria-label={translateText("Salon-4")} type={"button"}>
                                <span className={"gra-el-1965 sr-only"} data-el-id={"el-1965"}>
                                  {translateText("Salon-4")}
                                </span>
                                <div className={"gra-el-1966 rotate-0 h-4 w-4"} data-el-id={"el-1966"}>
                                  <svg className={"gra-el-1967"} data-el-id={"el-1967"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1968"} data-el-id={"el-1968"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1969 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1969"} href={"https://www.fresha.com/for-business/physical-therapy"}>
                      <div className={"gra-el-1970 group"} data-el-id={"el-1970"} dir={"ltr"}>
                        <picture className={"gra-el-1971 slide cursor-pointer"} data-el-id={"el-1971"}>
                          <img className={"gra-el-1972 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1972"} alt={translateText("Therapist assisting a patient with leg exercises during a rehab session")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1973 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1973"}>
                          <div className={"gra-el-1974 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1974"}>
                            <div className={"gra-el-1975 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1975"}>
                              {translateText("Therapy Center")}
                            </div>
                            <div className={"gra-el-1976"} data-el-id={"el-1976"}>
                              <button className={"gra-el-1977 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1977"} aria-label={translateText("Therapy Center-5")} type={"button"}>
                                <span className={"gra-el-1978 sr-only"} data-el-id={"el-1978"}>
                                  {translateText("Therapy Center-5")}
                                </span>
                                <div className={"gra-el-1979 rotate-0 h-4 w-4"} data-el-id={"el-1979"}>
                                  <svg className={"gra-el-1980"} data-el-id={"el-1980"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1981"} data-el-id={"el-1981"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1982 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1982"} href={"https://www.fresha.com/for-business/tattoo-and-piercing"}>
                      <div className={"gra-el-1983 group"} data-el-id={"el-1983"} dir={"ltr"}>
                        <picture className={"gra-el-1984 slide cursor-pointer"} data-el-id={"el-1984"}>
                          <img className={"gra-el-1985 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1985"} alt={translateText("Tattoo artist inking a client’s arm inside a modern studio")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1986 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1986"}>
                          <div className={"gra-el-1987 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-1987"}>
                            <div className={"gra-el-1988 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-1988"}>
                              {translateText("Tattooing & Piercing")}
                            </div>
                            <div className={"gra-el-1989"} data-el-id={"el-1989"}>
                              <button className={"gra-el-1990 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-1990"} aria-label={translateText("Tattooing & Piercing-6")} type={"button"}>
                                <span className={"gra-el-1991 sr-only"} data-el-id={"el-1991"}>
                                  {translateText("Tattooing & Piercing-6")}
                                </span>
                                <div className={"gra-el-1992 rotate-0 h-4 w-4"} data-el-id={"el-1992"}>
                                  <svg className={"gra-el-1993"} data-el-id={"el-1993"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-1994"} data-el-id={"el-1994"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <a className={"gra-el-1995 relative inline-block h-[140px] w-[244px] shrink-0 overflow-hidden rounded-lg transition-shadow hover:shadow-[0px_4px_8px_0px_rgba(13,22,25,0.06),0px_12px_20px_0px_rgba(13,22,25,0.06)] laptop:h-[194px] laptop:w-[309px]"} data-el-id={"el-1995"} href={"https://www.fresha.com/for-business/tanning-studio"}>
                      <div className={"gra-el-1996 group"} data-el-id={"el-1996"} dir={"ltr"}>
                        <picture className={"gra-el-1997 slide cursor-pointer"} data-el-id={"el-1997"}>
                          <img className={"gra-el-1998 size-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.03]"} data-el-id={"el-1998"} alt={translateText("Modern tanning studio with sunbeds and ambient lighting, representing sunless tanning services on Fresha.")} loading={"lazy"} width={"309"} height={"194"} src={"data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"620\" height=\"388\"><rect fill-opacity=\"0\"/></svg>"} srcSet={""} sizes={""} />
                        </picture>
                        <div className={"gra-el-1999 absolute inset-0 z-10 flex w-full flex-col justify-end bg-gradient-to-b from-transparent via-black/20 to-black/70"} data-el-id={"el-1999"}>
                          <div className={"gra-el-2000 flex flex-row items-center justify-between gap-2 p-3 laptop:p-4"} data-el-id={"el-2000"}>
                            <div className={"gra-el-2001 text-[15px] font-semibold leading-[21px] text-white laptop:text-[20px] laptop:leading-[28px]"} data-el-id={"el-2001"}>
                              {translateText("Tanning Studios")}
                            </div>
                            <div className={"gra-el-2002"} data-el-id={"el-2002"}>
                              <button className={"gra-el-2003 typography-body-m-semibold text-nowrap flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none duration-short-m ease-ease-out bg-secondary text-secondary-foreground border border-solid border-neutral hover:border-neutral-hover hover:bg-secondary-hover active:border-neutral-active active:scale-active rounded-full p-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"} data-el-id={"el-2003"} aria-label={translateText("Tanning Studios-7")} type={"button"}>
                                <span className={"gra-el-2004 sr-only"} data-el-id={"el-2004"}>
                                  {translateText("Tanning Studios-7")}
                                </span>
                                <div className={"gra-el-2005 rotate-0 h-4 w-4"} data-el-id={"el-2005"}>
                                  <svg className={"gra-el-2006"} data-el-id={"el-2006"} id={"img"} fill={"currentColor"} xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 32 32"}>
                                    <path className={"gra-el-2007"} data-el-id={"el-2007"} fillRule={"evenodd"} d={"M17.293 6.293a1 1 0 0 1 1.414 0l9 9a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414-1.414L24.586 17H5a1 1 0 1 1 0-2h19.586l-7.293-7.293a1 1 0 0 1 0-1.414"} clipRule={"evenodd"} />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}

