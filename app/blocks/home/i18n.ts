import type { HomeI18n, Lang } from "./types";

export const LANGS: Lang[] = ["ru", "ro", "en"];
export const LANG_STORAGE_KEY = "amaterra.lang";

export const I18N: Record<Lang, HomeI18n> = {
  ru: {
    brand: "amaterra.md",
    nav: ["Главная", "О нас", "Услуги", "Отзывы", "Запись"],
    callNow: "Позвонить",
    phoneNumberDisplay: "+373 685 55 585",
    phoneTel: "+37368555585",
    tagline: "Улыбка с заботой каждый день.",
    title: "Красивая улыбка без стресса",
    description:
      "Современная стоматология с мягким подходом, понятными ценами и быстрым приёмом.",
    book: "Записаться",
    learn: "Подробнее",
    languageLabel: "Язык",
    aboutLabel: "(о нас)",
    aboutTitle: "Простой способ сэкономить на стоматологии",
    aboutDescription:
      "Наша команда опытных стоматологов создаёт комфортную и тёплую атмосферу для каждого пациента. Мы предлагаем широкий спектр услуг.",
    aboutCta: "Записаться",
    aboutSatisfaction: "98%",
    aboutSatisfactionLabel: "Удовлетворенность клиентов сервисом",
    specTitle: "Мы специализируемся на вас, какой бы ни была ваша потребность",
    specDescription:
      "Мы гордимся тем, что предоставляем индивидуальные решения, специально подобранные под ваши уникальные потребности и предпочтения.",
    specServices: [
      {
        title: "Профилактический осмотр",
        description:
          "Регулярные осмотры — основа здоровой и красивой улыбки. Мы проводим тщательную диагностику для раннего выявления проблем.",
        image: "/spec-1.webp",
      },
      {
        title: "Профессиональная чистка",
        description:
          "Поддержание оптимальной гигиены полости рта важно для сияющей улыбки и общего здоровья. Ультразвуковая чистка и Air Flow.",
        image: "/spec-2.webp",
      },
      {
        title: "Надёжные пломбы",
        description:
          "Мы уделяем особое внимание долговечности и функциональности. Наши пломбы из современных композитов обеспечивают прочную реставрацию.",
        image: "/spec-3.webp",
      },
    ],
    findUsTitle: "Запишитесь\nонлайн",
    findUsName: "Ваше имя",
    findUsEmail: "Электронная почта",
    findUsDate: "Выбрать дату",
    findUsTime: "Выбрать время",
    findUsCta: "Записаться",
    findUsLocationLabel: "Наш адрес",
    findUsAddress: "ул. Василе Лупу 34/2,\nКишинёв, Молдова",
    modalTitle: "Запись на прием",
    modalSubtitle: "Оставьте ваши данные, и наш администратор свяжется с вами для подтверждения времени.",
    modalLastName: "Фамилия",
    modalFirstName: "Имя",
    modalPhone: "Номер телефона",
    modalEmail: "Электронная почта",
    modalDate: "Желаемая дата записи",
    modalSubmit: "Записаться",
    modalClose: "Отмена",
    ourServicesTitle: "Наши услуги",
    ourServicesMain: [
      { title: "Терапия", bullets: ["Консультация", "Лечение кариеса", "Лечение каналов"], image: "/service-probe.png" },
      { title: "Эстетическая стоматология", bullets: ["Отбеливание зубов", "Виниры"], image: "/service-tooth.png" }
    ],
    ourServicesMinor: ["Хирургия", "Имплантология", "Ортопедия", "Ортодонтия"],
    reviewsTitle: "Что говорят наши клиенты:",
    reviewsDescription: "Откройте для себя искренние отзывы наших благодарных пациентов и убедитесь в непревзойденном качестве наших стоматологических услуг!",
    reviewsReadMore: "Читать далее >",
    reviewsItems: [
      { text: "В клинике исключительно чисто и строго соблюдаются правила гигиены. Это придаёт уверенности и чувство безопасности во время лечения.", name: "Кристи Харли", role: "Менеджер по продукту", avatar: "https://i.pravatar.cc/150?u=1" },
      { text: "Очень понравился профессионализм врачей. Лечение прошло совершенно безболезненно, а результат превзошел все мои ожидания.", name: "Селина Мартин", role: "Арт-директор", avatar: "https://i.pravatar.cc/150?u=2" },
      { text: "Замечательная клиника! Приветливый персонал, современное оборудование и прозрачные цены. Всем рекомендую!", name: "Якоб Смит", role: "Аналитик", avatar: "https://i.pravatar.cc/150?u=3" }
    ],
    insightsTitle: "Последние статьи",
    insightsItems: [
      { date: "9 Июля 2025", title: "Лечение зубов по страховке", text: "С возрастом понимание медицинского страхования и вариантов лечения становится важнее. Многие семьи не уверены, какие услуги покрываются полисом.", image: "/insight-1.webp" },
      { date: "9 Июля 2025", title: "Современная стоматология", text: "С возрастом понимание медицинского страхования и вариантов лечения становится важнее. Многие семьи не уверены, какие услуги покрываются полисом.", image: "/banner-bg-v2.jpg" },
      { date: "9 Июля 2025", title: "Профилактика кариеса", text: "С возрастом понимание медицинского страхования и вариантов лечения становится важнее. Многие семьи не уверены, какие услуги покрываются полисом.", image: "/insight-3.webp" }
    ],
    footerDescription: "Мы стремимся предоставлять исключительную стоматологическую помощь, уделяя особое внимание комфорту и удовлетворенности пациентов. Наша опытная команда использует передовые технологии: от профилактики до сложных процедур.",
    footerPhoneLabel: "НОМЕР ТЕЛЕФОНА",
    footerEmailLabel: "ЭЛЕКТРОННАЯ ПОЧТА",
    footerEmail: "info@amaterra.md",
    footerHoursLabel: "ЧАСЫ РАБОТЫ",
    footerHours: ["Понедельник - Пятница: 09:00 - 19:00", "Суббота: 09:00 - 14:00", "Воскресенье: Закрыто"],
    footerCopyright: "Copyright © 2026 Amaterra. Все права защищены.",
    footerLinksCol1: ["О НАС", "УСЛУГИ"],
    footerLinksCol2: ["ВРАЧИ", "РАСПОЛОЖЕНИЕ"],
    footerSocial: ["INSTAGRAM", "TWITTER", "FACEBOOK", "TIKTOK"]
  },
  ro: {
    brand: "amaterra.md",
    nav: ["Acasă", "Despre", "Servicii", "Recenzii", "Programare"],
    callNow: "Sună acum",
    phoneNumberDisplay: "+373 685 55 585",
    phoneTel: "+37368555585",
    tagline: "Zâmbet frumos, grijă adevărată.",
    title: "Stomatologie modernă, fără stres",
    description:
      "Tratament blând, prețuri clare și programare rapidă pentru toată familia.",
    book: "Programează-te",
    learn: "Află mai mult",
    languageLabel: "Limbă",
    aboutLabel: "(despre noi)",
    aboutTitle: "O metodă simplă de a economisi la îngrijirea dentară",
    aboutDescription:
      "Echipa noastră de profesioniști creează un mediu confortabil și prietenos pentru fiecare pacient. Oferim o gamă largă de servicii.",
    aboutCta: "Programează-te",
    aboutSatisfaction: "98%",
    aboutSatisfactionLabel: "Satisfacția clienților față de serviciu",
    specTitle: "Ne specializăm pe tine, oricare ar fi nevoia ta",
    specDescription:
      "Suntem mândri că oferim soluții personalizate, adaptate în mod specific la nevoile și preferințele dvs. unice.",
    specServices: [
      {
        title: "Control preventiv",
        description:
          "Controalele regulate sunt baza unui zâmbet sănătos și radiant. Efectuăm un diagnostic amănunțit pentru detectarea timpurie a problemelor.",
        image: "/spec-1.webp",
      },
      {
        title: "Curățare profesională",
        description:
          "Menținerea igienei orale optime este esențială pentru un zâmbet radiant și bunăstarea generală. Curățare ultrasonică și Air Flow.",
        image: "/spec-2.webp",
      },
      {
        title: "Plombe solide",
        description:
          "Acordăm o atenție deosebită durabilității și funcționalității. Plombele noastre din compozite moderne oferă o restaurare fiabilă.",
        image: "/spec-3.webp",
      },
    ],
    findUsTitle: "Programează-te\nonline",
    findUsName: "Numele dvs.",
    findUsEmail: "Adresa de email",
    findUsDate: "Selectează data",
    findUsTime: "Selectează ora",
    findUsCta: "Programează-te",
    findUsLocationLabel: "Adresa noastră",
    findUsAddress: "Strada Vasile Lupu 34/2,\nChișinău, Moldova",
    modalTitle: "Programare",
    modalSubtitle: "Lăsați datele dvs., iar administratorul nostru vă va contacta pentru a confirma timpul.",
    modalLastName: "Nume",
    modalFirstName: "Prenume",
    modalPhone: "Număr de telefon",
    modalEmail: "Adresa de email",
    modalDate: "Data dorită",
    modalSubmit: "Programează-te",
    modalClose: "Anulează",
    ourServicesTitle: "Serviciile noastre",
    ourServicesMain: [
      { title: "Terapie", bullets: ["Consultație", "Tratament carii", "Endodonție"], image: "/service-probe.png" },
      { title: "Estetică dentară", bullets: ["Albire dentară", "Fațete dentare"], image: "/service-tooth.png" }
    ],
    ourServicesMinor: ["Chirurgie", "Implantologie", "Ortopedie", "Ortodonție"],
    reviewsTitle: "Vedeți ce spun clienții noștri:",
    reviewsDescription: "Îmbarcați-vă într-o călătorie prin experiențe sincere - descoperiți laudele și mărturiile pacienților noștri stimabili, dezvăluind calitatea de neegalat a serviciilor noastre!",
    reviewsReadMore: "Citește mai mult >",
    reviewsItems: [
      { text: "Clinica este excepțional de curată și prioritizează igiena. Respectă protocoale stricte de curățenie, ceea ce îmi oferă o siguranță suplimentară.", name: "Crysty Harly", role: "Manager de Produs", avatar: "https://i.pravatar.cc/150?u=1" },
      { text: "Sunt extrem de mulțumită de profesionalismul medicilor. Tratamentul a fost complet nedureros, iar rezultatul a depășit așteptările mele.", name: "Selina Martin", role: "Director Artistic", avatar: "https://i.pravatar.cc/150?u=2" },
      { text: "O clinică minunată! Personal amabil, echipament modern și prețuri transparente. Recomand cu încredere tuturor!", name: "Yacob Smith", role: "Analist", avatar: "https://i.pravatar.cc/150?u=3" }
    ],
    insightsTitle: "Ultimele articole",
    insightsItems: [
      { date: "9 Iul 2025", title: "Asigurare și tratament dentar", text: "Pe măsură ce înaintăm în vârstă, înțelegerea asigurărilor medicale și a opțiunilor de tratament devine mai importantă. Multe familii nu sunt sigure ce servicii sunt acoperite.", image: "/insight-1.webp" },
      { date: "9 Iul 2025", title: "Stomatologie modernă", text: "Pe măsură ce înaintăm în vârstă, înțelegerea asigurărilor medicale și a opțiunilor de tratament devine mai importantă. Multe familii nu sunt sigure ce servicii sunt acoperite.", image: "/banner-bg-v2.jpg" },
      { date: "9 Iul 2025", title: "Prevenirea cariilor", text: "Pe măsură ce înaintăm în vârstă, înțelegerea asigurărilor medicale și a opțiunilor de tratament devine mai importantă. Multe familii nu sunt sigure ce servicii sunt acoperite.", image: "/insight-3.webp" }
    ],
    footerDescription: "Ne dedicăm furnizării de servicii stomatologice excepționale, cu accent pe confortul și satisfacția pacienților. Echipa noastră experimentată folosește tehnologii avansate pentru a vă oferi cel mai bun tratament.",
    footerPhoneLabel: "NUMĂR DE TELEFON",
    footerEmailLabel: "EMAIL",
    footerEmail: "info@amaterra.md",
    footerHoursLabel: "PROGRAM DE LUCRU",
    footerHours: ["Luni - Vineri: 09:00 - 19:00", "Sâmbătă: 09:00 - 14:00", "Duminică: Închis"],
    footerCopyright: "Copyright © 2026 Amaterra. Toate drepturile rezervate.",
    footerLinksCol1: ["DESPRE NOI", "SERVICII"],
    footerLinksCol2: ["MEDICI", "LOCAȚIE"],
    footerSocial: ["INSTAGRAM", "TWITTER", "FACEBOOK", "TIKTOK"]
  },
  en: {
    brand: "amaterra.md",
    nav: ["Home", "About", "Services", "Reviews", "Appointment"],
    callNow: "Call Now",
    phoneNumberDisplay: "+373 685 55 585",
    phoneTel: "+37368555585",
    tagline: "Your smile, beautifully cared for.",
    title: "Modern Dental Care, Stress-Free",
    description:
      "Gentle treatment, clear pricing, and fast appointments in one calm, friendly clinic.",
    book: "Book Appointment",
    learn: "Learn More",
    languageLabel: "Language",
    aboutLabel: "(about us)",
    aboutTitle: "A Simple Way to Save on Dental Care",
    aboutDescription:
      "Our team of skilled and experienced dental professionals strives to create a comfortable and welcoming environment for each patient. We offer a wide range of services.",
    aboutCta: "Book Appointment",
    aboutSatisfaction: "98%",
    aboutSatisfactionLabel: "Client satisfaction with our service",
    specTitle: "We specialize in you, whatever your specialty",
    specDescription:
      "We take pride in providing individually customized solutions that are specifically tailored to meet your unique expertise, requirements, and preferences.",
    specServices: [
      {
        title: "Vibrant Checkups",
        description:
          "Regular dental exams are the cornerstone of a healthy and radiant smile. We provide thorough diagnostics for early detection of issues.",
        image: "/spec-1.webp",
      },
      {
        title: "Revitalized Cleaning",
        description:
          "Maintaining optimal oral health is essential for a radiant smile and overall well-being. Ultrasonic cleaning and Air Flow treatment.",
        image: "/spec-2.webp",
      },
      {
        title: "Reinforced Fillings",
        description:
          "We prioritize the longevity and functionality of your smile. Our reinforced fillings from modern composites offer reliable restoration.",
        image: "/spec-3.webp",
      },
    ],
    findUsTitle: "Book Online\nNow",
    findUsName: "Your Name",
    findUsEmail: "Email Address",
    findUsDate: "Select Date",
    findUsTime: "Select Time",
    findUsCta: "Book Now",
    findUsLocationLabel: "Our Location",
    findUsAddress: "Strada Vasile Lupu 34/2,\nChișinău, Moldova",
    modalTitle: "Book Appointment",
    modalSubtitle: "Leave your details, and our receptionist will contact you to confirm the time.",
    modalLastName: "Last Name",
    modalFirstName: "First Name",
    modalPhone: "Phone Number",
    modalEmail: "Email Address",
    modalDate: "Desired Date",
    modalSubmit: "Submit",
    modalClose: "Cancel",
    ourServicesTitle: "Our Services",
    ourServicesMain: [
      { title: "Therapy", bullets: ["Consultation", "Cavity Treatment", "Endodontics"], image: "/service-probe.png" },
      { title: "Aesthetic Care", bullets: ["Dental Whitening", "Veneer"], image: "/service-tooth.png" }
    ],
    ourServicesMinor: ["Surgery", "Implantology", "Orthopedics", "Orthodontics"],
    reviewsTitle: "See What Our Clients Have to Say:",
    reviewsDescription: "Embark on a Journey through Heartfelt Experiences - Unveil the Praises and Testimonials from Our Esteemed Clients, Unraveling the Unmatched Quality of Our Services!",
    reviewsReadMore: "Read More >",
    reviewsItems: [
      { text: "The clinic is also exceptionally clean and prioritizes hygiene. They follow strict cleanliness protocols, which gives me added confidence that I am in a safe environment for dental care.", name: "Crysty Harly", role: "Product Manager", avatar: "https://i.pravatar.cc/150?u=1" },
      { text: "I was very pleased with the professionalism of the doctors. The treatment was completely painless, and the result exceeded all my expectations.", name: "Selina Martin", role: "Art Director", avatar: "https://i.pravatar.cc/150?u=2" },
      { text: "Wonderful clinic! Welcoming staff, modern equipment, and transparent pricing. I highly recommend it to everyone!", name: "Yacob Smith", role: "Data Analyst", avatar: "https://i.pravatar.cc/150?u=3" }
    ],
    insightsTitle: "Latest Insights",
    insightsItems: [
      { date: "July 9, 2025", title: "Medicare And Long Term Care", text: "As seniors age, understanding Medicare and the range of long-term care options becomes. Many families are unsure which services", image: "/insight-1.webp" },
      { date: "July 9, 2025", title: "Medicare And Long Term Care", text: "As seniors age, understanding Medicare and the range of long-term care options becomes. Many families are unsure which services", image: "/banner-bg-v2.jpg" },
      { date: "July 9, 2025", title: "Medicare And Long Term Care", text: "As seniors age, understanding Medicare and the range of long-term care options becomes. Many families are unsure which services", image: "/insight-3.webp" }
    ],
    footerDescription: "We are dedicated to providing exceptional dental care with a focus on patient comfort and satisfaction. Our experienced team of dentists is committed to delivering personalized treatments using advanced technology and techniques.",
    footerPhoneLabel: "PHONE NUMBER",
    footerEmailLabel: "EMAIL",
    footerEmail: "info@amaterra.md",
    footerHoursLabel: "CLINIC HOURS",
    footerHours: ["Monday - Friday: 09:00 - 19:00", "Saturday: 09:00 - 14:00", "Sunday: Closed"],
    footerCopyright: "Copyright © 2026 Amaterra. All rights reserved.",
    footerLinksCol1: ["ABOUT US", "OUR SERVICES"],
    footerLinksCol2: ["DENTISTS", "LOCATION"],
    footerSocial: ["INSTAGRAM", "TWITTER", "FACEBOOK", "TIKTOK"]
  },
};
