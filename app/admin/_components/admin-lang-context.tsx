"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";

export type AdminLang = "ru" | "ro";

const ADMIN_LANG_KEY = "amaterra.admin.lang";

type AdminLangContextType = {
  lang: AdminLang;
  setLang: (lang: AdminLang) => void;
  t: (key: string) => string;
};

const translations: Record<AdminLang, Record<string, string>> = {
  ru: {
    // Shell / Nav
    "nav.dashboard": "Дашборд",
    "nav.calendar": "Календарь",
    "nav.appointments": "Записи",
    "nav.doctors": "Врачи",
    "nav.patients": "Пациенты",
    "nav.blog": "Блог",
    "nav.chat": "Чат",
    "nav.messages": "Сообщения",
    "sidebar.collapse": "Свернуть",
    "sidebar.expand": "Развернуть",
    "common.reset": "Сбросить",
    "common.hide": "Скрыть",
    "common.details": "Подробнее",

    // Dashboard
    "dashboard.title": "Панель управления",
    "dashboard.subtitle": "Управление клиникой Amaterra",
    "dashboard.confirmed": "Подтверждено",
    "dashboard.pending": "Ожидают ответа",
    "dashboard.completed": "Завершено",
    "dashboard.cancelled": "Отменено",
    "dashboard.description": "Здесь отображаются последние записи пациентов и текущая сводка по статусам. Уведомления о новых заявках появляются автоматически.",
    "dashboard.summaryTitle": "Сводка по записям",
    "dashboard.summarySubtitle": "Актуальный статус всех заявок",
    "dashboard.summaryDescription": "Подтвержденные, ожидающие ответа, завершенные и отмененные заявки собраны в одном блоке.",
    "dashboard.totalAppointments": "Всего записей:",
    "dashboard.recentTitle": "Последние записи",
    "dashboard.recentSubtitle": "Новые заявки пациентов",
    "dashboard.noRecent": "Новых записей пока нет.",
    "dashboard.viewAll": "Посмотреть все записи →",
    "dashboard.overview": "Обзор",
    "dashboard.overviewSubtitle": "Статистика записей, активность пациентов и ключевые метрики клиники",
    "dashboard.languagesTitle": "Языки пациентов",
    "dashboard.languagesSubtitle": "Распределение по языкам",
    "chart.title": "Активность за неделю",
    "chart.subtitle": "Записи за последние 7 дней",
    "stats.total": "Всего записей",
    "stats.last24h": "За последние 24ч",
    "stats.today": "Сегодня",
    "stats.thisWeek": "На этой неделе",

    // Appointments
    "appointments.management": "Управление записями",
    "appointments.title": "Записи пациентов",
    "appointments.description": "Просмотр, фильтрация и управление всеми записями на приём. Изменяйте статусы и добавляйте комментарии",
    "appointments.historyTitle": "История записей",
    "appointments.historyDescription": "Просмотр всех записей, включая завершенные и отмененные",
    "appointments.viewHistory": "История записей",
    "appointments.backToActive": "К активным записям",
    "appointments.search": "Поиск: имя, фамилия или телефон",
    "common.prev": "Назад",
    "common.next": "Вперед",
    "common.page": "Страница",
    "common.of": "из",
    "appointments.resetFilters": "Сбросить фильтры",
    "appointments.found": "Найдено записей:",
    "appointments.noResults": "По выбранным фильтрам записей не найдено.",
    "appointments.visitDate": "Дата визита",
    "appointments.time": "Время",
    "appointments.created": "Создано",
    "appointments.language": "Язык",
    "appointments.notSpecified": "Не указано",
    "appointments.emailNotSpecified": "Email не указан",
    "appointments.status": "Статус записи",
    "appointments.adminComment": "Комментарий администратора",
    "appointments.addComment": "Добавьте комментарий по записи",
    "appointments.save": "Сохранить",
    "appointments.saving": "Сохранение...",
    "appointments.noNotes": "Проблема не была указана в записи.",

    // Statuses
    "status.pending": "Ожидает",
    "status.confirmed": "Подтверждена",
    "status.cancelled": "Отменена",
    "status.completed": "Завершена",

    // Patients
    "patients.database": "База пациентов",
    "patients.title": "Пациенты клиники",
    "patients.description": "Карточки пациентов с завершёнными приёмами, история обращений и контактная информация",
    "patients.search": "Поиск: имя, фамилия, телефон или email",
    "patients.found": "Пациентов:",
    "patients.noResults": "Пациенты не найдены по текущему запросу.",
    "patients.visits": "Визиты",
    "patients.doctor": "Врач",
    "patients.notAssigned": "Не назначен",
    "patients.noCompletedVisits": "Нет завершённых визитов",
    "patients.empty": "Пока нет завершенных записей пациентов.",
    "patients.name": "Пациент",
    "patients.contact": "Контакт",
    "patients.lastVisit": "Последний визит",
    "patients.history": "История",
    "patients.actions": "Действия",
    "patients.lang": "Язык",
    "patients.noEmail": "Email не указан",
    "patients.historyDetails": "История обращений / доп. информация",

    // Doctors
    "doctors.title": "Наши врачи",
    "doctors.subtitle": "Просмотр профилей врачей и истории завершённых случаев лечения пациентов",
    "doctors.completed": "Завершено:",
    "doctors.patientHistory": "История пациентов:",
    "doctors.completedCases": "Завершенные случаи лечения",
    "doctors.noCases": "У этого врача пока нет завершенных случаев",
    "doctors.problem": "Проблема:",

    // Messages
    "messages.title": "Сообщения",
    "messages.description": "Заявки с формы обратной связи",
    "messages.empty": "Нет сообщений",
    "messages.name": "Имя",
    "messages.contact": "Контакт",
    "messages.message": "Сообщение",
    "messages.date": "Дата визита",
    "messages.time": "Время",
    "messages.status": "Статус",
    "messages.read": "Прочитано",
    "messages.unread": "Новое",
    "messages.markRead": "Отметить как прочитанное",
    "messages.markUnread": "Отметить как новое",

    // Create appointment modal
    "modal.createTitle": "Создать запись",
    "modal.searchPatient": "Поиск существующего пациента",
    "modal.searchPlaceholder": "Введите имя, телефон или email...",
    "modal.searching": "Поиск...",
    "modal.notFound": "Пациент не найден. Будет создана новая карточка.",
    "modal.selectedPatient": "Выбран пациент",
    "modal.clearPatient": "Отменить",
    "modal.firstName": "Имя",
    "modal.lastName": "Фамилия",
    "modal.phone": "Телефон",
    "modal.email": "Email",
    "modal.visitDate": "Дата визита",
    "modal.visitTime": "Время визита",
    "modal.doctor": "Лечащий врач",
    "modal.selectDoctor": "Выберите врача",
    "modal.notes": "Примечания",
    "modal.notesPlaceholder": "Опишите проблему или причину визита",
    "modal.cancel": "Отмена",
    "modal.submit": "Создать запись",
    "modal.submitting": "Создание...",
    "modal.success": "Запись успешно создана",
    "modal.error": "Не удалось создать запись",

    // Quick actions
    "actions.newAppointment": "Новая запись",
    "actions.newAppointmentDesc": "Создать запись вручную",
    "actions.calendarDesc": "Просмотр расписания",
    "actions.pendingDesc": "Обработать заявки",
    "actions.confirmedDesc": "Смена статуса",
    "actions.title": "Быстрые действия",
    "actions.subtitle": "Часто используемые функции",
  },
  ro: {
    // Shell / Nav
    "nav.dashboard": "Panou",
    "nav.calendar": "Calendar",
    "nav.appointments": "Programări",
    "nav.doctors": "Medici",
    "nav.patients": "Pacienți",
    "nav.blog": "Blog",
    "nav.chat": "Chat",
    "nav.messages": "Mesaje",
    "sidebar.collapse": "Restrânge",
    "sidebar.expand": "Extinde",
    "common.reset": "Resetează",
    "common.hide": "Ascunde",
    "common.details": "Detalii",

    // Dashboard
    "dashboard.title": "Panoul de control",
    "dashboard.subtitle": "Administrarea clinicii Amaterra",
    "dashboard.confirmed": "Confirmate",
    "dashboard.pending": "În așteptare",
    "dashboard.completed": "Finalizate",
    "dashboard.cancelled": "Anulate",
    "dashboard.description": "Aici sunt afișate cele mai recente programări și rezumatul actual al statusurilor. Notificările pentru cererile noi apar automat.",
    "dashboard.summaryTitle": "Rezumat programări",
    "dashboard.summarySubtitle": "Statusul actual al tuturor cererilor",
    "dashboard.summaryDescription": "Programările confirmate, în așteptare, finalizate și anulate sunt adunate într-un singur bloc.",
    "dashboard.totalAppointments": "Total programări:",
    "dashboard.recentTitle": "Programări recente",
    "dashboard.recentSubtitle": "Cereri noi de la pacienți",
    "dashboard.noRecent": "Nu există programări noi.",
    "dashboard.viewAll": "Vezi toate programările →",
    "dashboard.overview": "Prezentare generală",
    "dashboard.overviewSubtitle": "Statistici programări, activitatea pacienților și valori cheie ale clinicii",
    "dashboard.languagesTitle": "Limbile pacienților",
    "dashboard.languagesSubtitle": "Distribuția după limbă",
    "chart.title": "Activitate săptămânală",
    "chart.subtitle": "Programări în ultimele 7 zile",
    "stats.total": "Total programări",
    "stats.last24h": "În ultimele 24h",
    "stats.today": "Astăzi",
    "stats.thisWeek": "Săptămâna aceasta",

    // Appointments
    "appointments.management": "Gestionarea programărilor",
    "appointments.title": "Programările pacienților",
    "appointments.description": "Vizualizarea, filtrarea și gestionarea tuturor programărilor. Modificați statusurile și adăugați comentarii",
    "appointments.historyTitle": "Istoricul programărilor",
    "appointments.historyDescription": "Vizualizarea tuturor programărilor, inclusiv cele finalizate și anulate",
    "appointments.viewHistory": "Istoricul programărilor",
    "appointments.backToActive": "La programările active",
    "appointments.search": "Căutare: nume, prenume sau telefon",
    "common.prev": "Înapoi",
    "common.next": "Înainte",
    "common.page": "Pagina",
    "common.of": "din",
    "appointments.resetFilters": "Resetare filtre",
    "appointments.found": "Programări găsite:",
    "appointments.noResults": "Nu s-au găsit programări conform filtrelor selectate.",
    "appointments.visitDate": "Data vizitei",
    "appointments.time": "Ora",
    "appointments.created": "Creat",
    "appointments.language": "Limba",
    "appointments.notSpecified": "Nespecificat",
    "appointments.emailNotSpecified": "Email nespecificat",
    "appointments.status": "Statusul programării",
    "appointments.adminComment": "Comentariul administratorului",
    "appointments.addComment": "Adăugați un comentariu",
    "appointments.save": "Salvează",
    "appointments.saving": "Se salvează...",
    "appointments.noNotes": "Problema nu a fost indicată în programare.",

    // Statuses
    "status.pending": "În așteptare",
    "status.confirmed": "Confirmată",
    "status.cancelled": "Anulată",
    "status.completed": "Finalizată",

    // Patients
    "patients.database": "Baza de pacienți",
    "patients.title": "Pacienții clinicii",
    "patients.description": "Fișele pacienților cu consultații finalizate, istoricul vizitelor și informații de contact",
    "patients.search": "Căutare: nume, prenume, telefon sau email",
    "patients.found": "Pacienți:",
    "patients.noResults": "Nu s-au găsit pacienți.",
    "patients.visits": "Vizite",
    "patients.doctor": "Medic",
    "patients.notAssigned": "Nealocat",
    "patients.noCompletedVisits": "Nu există vizite finalizate",
    "patients.empty": "Nu există pacienți cu vizite finalizate.",
    "patients.name": "Pacient",
    "patients.contact": "Contact",
    "patients.lastVisit": "Ultima vizită",
    "patients.history": "Istoric",
    "patients.actions": "Acțiuni",
    "patients.lang": "Limba",
    "patients.noEmail": "Email nespecificat",
    "patients.historyDetails": "Istoricul vizitelor / detalii",

    // Doctors
    "doctors.title": "Medicii noștri",
    "doctors.subtitle": "Vizualizarea profilurilor medicilor și a istoricului cazurilor finalizate",
    "doctors.completed": "Finalizate:",
    "doctors.patientHistory": "Istoricul pacienților:",
    "doctors.completedCases": "Cazuri de tratament finalizate",
    "doctors.noCases": "Acest medic nu are încă cazuri finalizate",
    "doctors.problem": "Problema:",

    // Messages
    "messages.title": "Mesaje",
    "messages.description": "Cereri din formularul de contact",
    "messages.empty": "Nu există mesaje",
    "messages.name": "Nume",
    "messages.contact": "Contact",
    "messages.message": "Mesaj",
    "messages.date": "Data vizitei",
    "messages.time": "Ora",
    "messages.status": "Status",
    "messages.read": "Citit",
    "messages.unread": "Nou",
    "messages.markRead": "Marchează ca citit",
    "messages.markUnread": "Marchează ca nou",

    // Create appointment modal
    "modal.createTitle": "Creare programare",
    "modal.searchPatient": "Căutare pacient existent",
    "modal.searchPlaceholder": "Introduceți numele, telefonul sau emailul...",
    "modal.searching": "Se caută...",
    "modal.notFound": "Pacientul nu a fost găsit. Se va crea o fișă nouă.",
    "modal.selectedPatient": "Pacient selectat",
    "modal.clearPatient": "Anulează",
    "modal.firstName": "Prenume",
    "modal.lastName": "Nume",
    "modal.phone": "Telefon",
    "modal.email": "Email",
    "modal.visitDate": "Data vizitei",
    "modal.visitTime": "Ora vizitei",
    "modal.doctor": "Medic curant",
    "modal.selectDoctor": "Selectați medicul",
    "modal.notes": "Note",
    "modal.notesPlaceholder": "Descrieți problema sau motivul vizitei",
    "modal.cancel": "Anulează",
    "modal.submit": "Creează programarea",
    "modal.submitting": "Se creează...",
    "modal.success": "Programare creată cu succes",
    "modal.error": "Nu s-a putut crea programarea",

    // Quick actions
    "actions.newAppointment": "Programare nouă",
    "actions.newAppointmentDesc": "Creează manual",
    "actions.calendarDesc": "Vezi orarul",
    "actions.pendingDesc": "Procesează cererile",
    "actions.confirmedDesc": "Schimbă statusul",
    "actions.title": "Acțiuni rapide",
    "actions.subtitle": "Funcții utilizate frecvent",
  },
};

const AdminLangContext = createContext<AdminLangContextType>({
  lang: "ro",
  setLang: () => {},
  t: (key) => key,
});

export function AdminLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<AdminLang>("ro");

  useEffect(() => {
    const saved = localStorage.getItem(ADMIN_LANG_KEY) as AdminLang | null;
    if (saved === "ru" || saved === "ro") {
      setLangState(saved);
    }
  }, []);

  const setLang = useCallback((newLang: AdminLang) => {
    setLangState(newLang);
    localStorage.setItem(ADMIN_LANG_KEY, newLang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[lang]?.[key] ?? translations["ru"]?.[key] ?? key;
    },
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, t }),
    [lang, setLang, t]
  );

  return (
    <AdminLangContext.Provider value={value}>
      {children}
    </AdminLangContext.Provider>
  );
}

export function useAdminLang() {
  return useContext(AdminLangContext);
}
