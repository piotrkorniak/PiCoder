export type AppStatus = 'aktywna' | 'w budowie';

export type ResolvedAppStatus = 'aktywna' | 'w budowie' | 'nieznany';

export interface AppEntry {
  /** Unikalny identyfikator aplikacji, max 64 znaki */
  id: string;
  /** Nazwa aplikacji, max 100 znaków */
  name: string;
  /** Opis aplikacji, max 200 znaków */
  description: string;
  /** URL subdomeny: {nazwa}.picoder.top */
  url: string;
  /** Klasa ikony lub ścieżka do pliku graficznego */
  icon: string;
  /** Status aplikacji */
  status: AppStatus;
}
