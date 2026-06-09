"use client";

import { useEffect, useRef, useState } from "react";
import { showToast } from "./toast";
import type { Patient } from "../adminTypes";
import { useAdminLang } from "./admin-lang-context";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

type CreateAppointmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function CreateAppointmentModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateAppointmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const searchTimeoutRef = useRef<number | null>(null);
  const { t } = useAdminLang();

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [busySlots, setBusySlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSearchResults([]);
      setSelectedPatient(null);
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setSelectedDate("");
      setSelectedDoctor("");
      setBusySlots([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedDate && selectedDoctor) {
      setIsLoadingSlots(true);
      fetch(`/api/appointments/busy-slots?date=${selectedDate}&doctorId=${selectedDoctor}`)
        .then(res => res.json())
        .then(data => setBusySlots(data.busySlots || []))
        .catch(() => setBusySlots([]))
        .finally(() => setIsLoadingSlots(false));
    } else {
      setBusySlots([]);
    }
  }, [selectedDate, selectedDoctor]);

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/admin/patients/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.patients || []);
        }
      } catch (err) {
        console.error("Failed to search patients:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) window.clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  function handleSelectPatient(patient: Patient) {
    setSelectedPatient(patient);
    setFirstName(patient.first_name);
    setLastName(patient.last_name);
    setPhone(patient.phone);
    setEmail(patient.email || "");
    setSearchQuery("");
    setSearchResults([]);
  }

  function handleClearPatient() {
    setSelectedPatient(null);
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
  }

  if (!isOpen) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      firstName: selectedPatient ? selectedPatient.first_name : firstName,
      lastName: selectedPatient ? selectedPatient.last_name : lastName,
      phone: selectedPatient ? selectedPatient.phone : phone,
      email: selectedPatient ? selectedPatient.email : email,
      preferredDate: String(formData.get("preferredDate") ?? ""),
      preferredTime: String(formData.get("preferredTime") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      doctor: String(formData.get("doctor") ?? ""),
      patientId: selectedPatient?.id || undefined,
      lang: "ru",
      source: "admin",
    };

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(errorData?.error ?? t("modal.error"));
      }

      // Mark this appointment as admin-created so notifications polling skips it
      const responseData = (await response.json().catch(() => null)) as { appointmentId?: string } | null;
      if (responseData?.appointmentId) {
        const existing = sessionStorage.getItem("admin-created-ids");
        const ids: string[] = existing ? JSON.parse(existing) : [];
        ids.push(responseData.appointmentId);
        // keep only last 20
        sessionStorage.setItem("admin-created-ids", JSON.stringify(ids.slice(-20)));
      }

      showToast(t("modal.success"), "success");
      onSuccess();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : t("modal.error");
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-2xl flex-col max-h-[90vh] rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div className="shrink-0 border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("modal.createTitle")}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="pb-2">
            {/* Patient Search Section */}
          {!selectedPatient && (
            <div className="relative mb-6">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {t("modal.searchPatient")}
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("modal.searchPlaceholder")}
                  className="h-11 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-900/50 dark:text-white"
                />
              </label>

              {searchQuery.length >= 2 && (
                <div className="absolute left-0 right-0 top-[70px] z-10 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  {isSearching ? (
                    <div className="p-3 text-sm text-gray-500 text-center">{t("modal.searching")}</div>
                  ) : searchResults.length > 0 ? (
                    <ul className="max-h-60 overflow-y-auto">
                      {searchResults.map((patient) => (
                        <li key={patient.id}>
                          <button
                            type="button"
                            onClick={() => handleSelectPatient(patient)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition border-b border-gray-100 dark:border-gray-700 last:border-0"
                          >
                            <p className="font-medium text-gray-900 dark:text-white">
                              {patient.first_name} {patient.last_name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {patient.phone} {patient.email ? `• ${patient.email}` : ""}
                            </p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-3 text-sm text-gray-500 text-center">
                      {t("modal.notFound")}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          </div>

          {selectedPatient && (
            <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-900/10 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                  {t("modal.selectedPatient")}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedPatient.first_name} {selectedPatient.last_name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedPatient.phone}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearPatient}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium underline"
              >
                {t("modal.clearPatient")}
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="pt-4">
            <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("modal.firstName")} {!selectedPatient && <span className="text-red-500">*</span>}
                </span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!!selectedPatient}
                  required={!selectedPatient}
                  className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("modal.lastName")} {!selectedPatient && <span className="text-red-500">*</span>}
                </span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!!selectedPatient}
                  required={!selectedPatient}
                  className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("modal.phone")} {!selectedPatient && <span className="text-red-500">*</span>}
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!!selectedPatient}
                  required={!selectedPatient}
                  className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("modal.email")}
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!!selectedPatient}
                  className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
                />
              </label>
            </div>

            <hr className="my-2 border-gray-200 dark:border-gray-700" />

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("modal.visitDate")} <span className="text-red-500">*</span>
                </span>
                <input
                  type="date"
                  name="preferredDate"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("modal.doctor")} <span className="text-red-500">*</span>
                </span>
                <select
                  name="doctor"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  required
                  className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">{t("modal.selectDoctor")}</option>
                  <option value="d1">Ruslan Ceban - Медик-генералист</option>
                  <option value="d2">Sorin Rabac - Терапевт-протезист</option>
                  <option value="d4">Dumitru Gurenco - Терапевт-протезист</option>
                  <option value="d5">Natalia Lozova - Ортодонт</option>
                </select>
              </label>

              <label className="grid gap-2 sm:col-span-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("modal.visitTime")} <span className="text-red-500">*</span>
                </span>
                <select
                  name="preferredTime"
                  disabled={!selectedDate || !selectedDoctor || isLoadingSlots}
                  required
                  className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition disabled:opacity-60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">
                    {!selectedDate || !selectedDoctor 
                      ? "Сначала выберите дату и врача" 
                      : isLoadingSlots 
                        ? "Загрузка..." 
                        : "Выберите время"}
                  </option>
                  {TIME_SLOTS.map(time => {
                    const isBusy = busySlots.includes(time);
                    return (
                      <option key={time} value={time} disabled={isBusy}>
                        {time} {isBusy ? "(Занято)" : ""}
                      </option>
                    );
                  })}
                </select>
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("modal.notes")}
              </span>
              <textarea
                name="notes"
                rows={4}
                placeholder={t("modal.notesPlaceholder")}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-500"
              />
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              {t("modal.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-lg bg-emerald-500 px-4 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? t("modal.submitting") : t("modal.submit")}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
