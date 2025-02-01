Car Configurator / Konfigurator Samochodów

🇬🇧 English Version

# Project Description

Car Configurator is a web application that enables users to customize and order their dream car through an intuitive step-by-step process. The application guides users through various car customization options, ranging from basic features to advanced modifications, while providing real-time price updates. Users can save their configurations and resume them later, making the car customization process convenient and user-friendly.

# Architecture

graph TD
A[Frontend React App] --> B[Redux/Zustand Store]
A --> C[React Query]
C --> D[JSON Server API]
D --> E[(Local Storage)]
B --> E

# Tech Stack

| **Technology**         | **Description**                                         |
|------------------------|---------------------------------------------------------|
| React                  | Frontend framework for building user interfaces        |
| TypeScript             | Static typing for better code quality and developer experience |
| Material UI            | Component library for consistent and professional UI design |
| React Query            | Data fetching, caching, and server state management     |
| Redux Toolkit / Zustand | Global state management for applications                |
| React Router           | Navigation and routing management in applications       |
| JSON Server            | Mock API backend for development and testing           |
| ESLint                 | Code linting and maintaining code quality              |
| Prettier               | Code formatting                                         |
| Husky                  | Git hooks for checking code quality before commits     |

# Local Development

Prerequisites: Node.js v20.\*

git clone https://github.com/your-username/car-configurator
cd my-app

# Install dependencies

npm install

# Start JSON server (in a separate terminal)

json-server --watch db.json --port 3000

# Start development server

npm run start

# Available Scripts

| **Command** | **Description**                       |
| ----------- | ------------------------------------- |
| dev         | Starts the development server         |
| server      | Runs the JSON server for mock API     |
| build       | Builds the application for production |
| preview     | Serves the built application locally  |
| lint        | Runs ESLint to check code quality     |
| lint:fix    | Fixes auto-fixable ESLint issues      |
| format      | Runs Prettier to format code          |
| prepare     | Sets up Husky git hooks               |

# Features Implemented

Multi-step car configuration wizard with category-based progression

Real-time price calculation and display

Persistent configuration storage using localStorage

Admin panel for managing categories and parts

Comprehensive order management system

Responsive Material UI design

Form validation for user details

Order history and configuration summary

Automatic routing based on configuration steps

Real-time configuration updates

Future Plans

Implement user accounts and authentication

Add comparison feature between different configurations

Integrate with real car manufacturer APIs

Add PDF export for configurations

Implement configuration sharing functionality

Expand customization options and categories

# Contact

Email: tomek12olech@gmail.com
GitHub: [takimi12](https://github.com/takimi12)
LinkedIn:

🇵🇱 Polska Wersja

Opis Projektu

Konfigurator Samochodów to aplikacja internetowa umożliwiająca użytkownikom dostosowanie i zamówienie wymarzonego samochodu poprzez intuicyjny proces krok po kroku. Aplikacja prowadzi użytkowników przez różne kategorie opcji personalizacji, od podstawowych funkcji po zaawansowane modyfikacje, zapewniając jednocześnie aktualizacje cen w czasie rzeczywistym. Użytkownicy mogą zapisywać swoje konfiguracje i wracać do nich później, co sprawia, że proces personalizacji samochodu jest wygodny i przyjazny dla użytkownika.

Architektura

graph TD
A[Frontend React App] --> B[Redux/Zustand Store]
A --> C[React Query]
C --> D[JSON Server API]
D --> E[(Local Storage)]
B --> E

# Stack Technologiczny



| **Technologia**        | **Opis**                                                |
|------------------------|--------------------------------------------------------|
| React                  | Framework frontendowy do budowy interfejsu użytkownika |
| TypeScript             | Typowanie statyczne dla lepszej jakości kodu i doświadczenia developera |
| Material UI            | Biblioteka komponentów dla spójnego i profesjonalnego designu UI |
| React Query            | Pobieranie danych, cachowanie i zarządzanie stanem serwera |
| Redux Toolkit / Zustand | Globalne zarządzanie stanem aplikacji                  |
| React Router           | Obsługa nawigacji i routingu w aplikacjach             |
| JSON Server            | Mock API backendowe do rozwoju i testowania           |
| ESLint                 | Linting kodu i utrzymanie jego jakości                 |
| Prettier               | Formatowanie kodu                                      |
| Husky                  | Git hooks do sprawdzania jakości kodu przed commitem   |


# Lokalny Development

Wymagania: Node.js v20.\*

git clone https://github.com/your-username/car-configurator
cd my-app

# Instalacja zależności

npm install

# Uruchomienie JSON servera (w osobnym terminalu)

json-server --watch db.json --port 3000

# Uruchomienie serwera deweloperskiego

npm run start

# Dostępne Skrypty

| **Polecenie** | **Opis**                                           |
| ------------- | -------------------------------------------------- |
| dev           | Uruchamia serwer deweloperski                      |
| server        | Uruchamia JSON server dla mockowego API            |
| build         | Buduje aplikację do wersji produkcyjnej            |
| preview       | Serwuje zbudowaną aplikację lokalnie               |
| lint          | Uruchamia ESLint, aby sprawdzić jakość kodu        |
| lint:fix      | Naprawia automatycznie naprawialne problemy ESLint |
| format        | Uruchamia Prettier, aby sformatować kod            |
| prepare       | Ustawia git hooki Husky                            |

# Zaimplementowane Funkcje

Wieloetapowy kreator konfiguracji samochodu z progresją opartą na kategoriach
Obliczanie i wyświetlanie ceny w czasie rzeczywistym
Trwałe przechowywanie konfiguracji przy użyciu localStorage
Panel administracyjny do zarządzania kategoriami i częściami
Kompleksowy system zarządzania zamówieniami
Responsywny design z Material UI
Walidacja formularza danych użytkownika
Historia zamówień i podsumowanie konfiguracji
Automatyczne routowanie na podstawie kroków konfiguracji
Aktualizacje konfiguracji w czasie rzeczywistym

# Plany na Przyszłość

Implementacja kont użytkowników i uwierzytelniania
Dodanie funkcji porównywania różnych konfiguracji
Integracja z rzeczywistymi API producentów samochodów
Dodanie eksportu konfiguracji do PDF
Implementacja funkcji udostępniania konfiguracji
Rozszerzenie opcji i kategorii dostosowywania

# Kontakt

Email: tomek12olech@gmail.com
GitHub: [takimi12](https://github.com/takimi12)
LinkedIn:
